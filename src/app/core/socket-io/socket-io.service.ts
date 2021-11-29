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

  videoGrid;
  myVideo;
  peer;
  socket;
  peerConnection = new RTCPeerConnection();
  remoteTracks: RTCRtpSender[] = [];
  isAlreadyCalling = false;

  constructor(private authService: AuthService) {}

  initialize(): void {
    const token = this.authService.getToken();
    if (!token) { return ; }

    this.socket = io(environment.apiUrl);
    this.peer = new Peer(undefined, {
      host: 'localhost',
      port: 5000,
      path: '/peerjs',
    });

    this.peer.on('open', (id) => {
      this.socket.emit('join-room', 'ROOM_ID', id, 'user');
    });

    this.socket.on('createMessage', (message, userName) => console.log(message));
    this.getMedia().then();
  }

  async getMedia(): Promise<void> {
    this.videoGrid = document.getElementById('video-grid') as HTMLVideoElement;
    this.myVideo = document.createElement('video') as HTMLVideoElement;
    this.myVideo.muted = true;
    let myVideoStream;

    navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      myVideoStream = stream;
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

  destroy(): void {
    this.socket.emit('disconnect');
    console.log('disconnecting');
    this.socket.disconnect(true);
    this.remoteTracks = [];
  }
}
