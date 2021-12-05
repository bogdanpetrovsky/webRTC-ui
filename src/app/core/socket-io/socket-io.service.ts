import io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { IRtcMessage } from '../../blocks/data-models/RtcMessage';
import Peer from 'peerjs';

export interface WSMessageInterface {
  event: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {
  private activeUsers = new Subject<any>();
  users$ = this.activeUsers.asObservable();
  private removedUser = new Subject<any>();
  removedUser$ = this.removedUser.asObservable();
  private message = new Subject<WSMessageInterface>();
  message$ = this.message.asObservable();
  private incomingMessage = new Subject<IRtcMessage>();
  incomingMessage$ = this.incomingMessage.asObservable();

  peer;
  socket;
  peerConnection = new RTCPeerConnection();
  remoteTracks: RTCRtpSender[] = [];

  videoGrid;
  myVideo;
  myVideoStream;
  text;
  send;
  messages;

  constructor(private authService: AuthService) {}

  initialize(roomId: string): void {
    const token = this.authService.getToken();
    if (!token) { return ; }

    this.socket = io(environment.apiUrl, {
      auth: { token },
      query: { data: JSON.stringify(this.authService.getUser()) },
    });
    this.peer = new Peer(undefined, {
      host: 'localhost',
      port: 5000,
      path: '/peerjs',
    });

    this.peer.on('open', (id) => {
      this.socket.emit('join-room', roomId, id, this.authService.user.firstName);
    });

    this.socket.on('update-user-list', ({ users }) => {
      this.activeUsers.next(users);
    });

    this.socket.on('createMessage', (message, userName) => {
      this.messages.innerHTML =
        this.messages.innerHTML +
        `<div class="message">
        <b><i class="fa fa-user-circle"></i> <span> ${
          userName === this.authService.user.firstName ? 'me' : userName
        }</span> </b>
        <span>${message}</span>
    </div>`;
    });

    this.initSelectors();
    this.getMedia().then();
  }

  initSelectors(): void {
    this.videoGrid = document.getElementById('video-grid') as HTMLVideoElement;
    this.myVideo = document.createElement('video') as HTMLVideoElement;
    this.myVideo.muted = true;
    this.text = document.querySelector('#chat_message');
    this.send = document.getElementById('send');
    this.messages = document.querySelector('.messages');
  }

  async getMedia(): Promise<void> {
    navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      this.myVideoStream = stream;
      this.addVideoStream(this.myVideo, stream);

      this.peer.on('call', (call) => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', (userVideoStream) => {
          this.addVideoStream(video, userVideoStream);
        });
      });

      this.socket.on('user-connected', (userId) => {
        this.connectToNewUser(userId, stream);
      });
    });
  }

  addVideoStream(video, stream): void {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
      this.videoGrid.append(video);
    });
  }

  connectToNewUser(userId, stream): void {
    const call = this.peer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
      this.addVideoStream(video, userVideoStream);
    });
  }

  videoEvent(event: boolean): void {
    this.myVideoStream.getVideoTracks()[0].enabled = event;
  }

  microphoneEvent(event: boolean): void {
    this.myVideoStream.getAudioTracks()[0].enabled = event;
    console.log(this.myVideoStream.getAudioTracks()[0].enabled);
  }

  async callUser(socketId): Promise<void> {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    this.socket.emit('call-user', {
      offer,
      to: socketId,
    });
  }

  emitMessage(message: string): void {
    this.socket.emit('message', message);
  }

  destroy(): void {
    this.socket.emit('disconnect');
    console.log('disconnecting');
    this.socket.disconnect(true);
    this.remoteTracks = [];
  }
}
