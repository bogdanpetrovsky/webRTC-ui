import io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface WSMessageInterface {
  event: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  socket;
  private activeUsers = new Subject<any>();
  users$ = this.activeUsers.asObservable();
  private message = new Subject<WSMessageInterface>();
  message$ = this.message.asObservable();
  peerConnection = new RTCPeerConnection();
  isAlreadyCalling = false;

  constructor() {}

  initialize(): void {
    this.socket = io(environment.apiUrl);

    this.socket.on('connection', () => {
      // either with send()
      this.socket.emit('someEv', 'fuck you');
      this.socket.send('Hello');

      // or with emit() and custom event names
      this.socket.emit('disconnect');
    });

    this.socket.on('update-user-list', ({ users }) => {
      this.activeUsers.next(users);
    });

    this.socket.on('remove-user', ({ socketId }) => {
      const elToRemove = document.getElementById(socketId);

      if (elToRemove) {
        elToRemove.remove();
      }
    });

    this.socket.on('call-made', async (data) => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));

      this.socket.emit('make-answer', {
        answer,
        to: data.socket
      });
    });


    this.socket.on('answer-made', async (data) => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      if (!this.isAlreadyCalling) {
        this.callUser(data.socket);
        this.isAlreadyCalling = true;
      }
    });

    this.peerConnection.ontrack = ({ streams: [stream] }) => {
      const remoteVideo = (document.getElementById('remote-video')) as HTMLVideoElement;
      console.log(remoteVideo, stream);
      if (remoteVideo) {
        remoteVideo.srcObject = stream;
      }
    };

    this.getMedia().then();
  }

  async getMedia(): Promise<void> {
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const localVideo = (document.getElementById('local-video')) as HTMLVideoElement ;
      if (localVideo) {
        localVideo.srcObject = stream;
      }

      stream
        .getTracks()
        .forEach((track) => this.peerConnection.addTrack(track, stream));

    } catch (err) {
      console.log(err);
    }
  }

  async callUser(socketId): Promise<void> {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    this.socket.emit('call-user', {
      offer,
      to: socketId,
    });
  }

  emitMessage(options: WSMessageInterface): void {
    this.socket.emit(options.event, options.data);
  }
}
