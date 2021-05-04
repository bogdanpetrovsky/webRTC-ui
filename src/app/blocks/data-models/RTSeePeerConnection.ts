import { EventEmitter } from 'events';

export interface IRTSeePeeConnection {
  clientId: string;
  connection: RTCPeerConnection;
}

export class RTSeePeerConnection extends EventEmitter {
  clientId: string;
  connection: RTCPeerConnection;
  localVideoTrack: MediaStreamTrack;
  localAudioTrack: MediaStreamTrack;
  remoteVideoStream: MediaStream;
  remoteAudioStream: MediaStream;
  receiver: RTCRtpReceiver;
  sender: RTCRtpSender;

  constructor(options: IRTSeePeeConnection) {
    super();
    if (!options || !options.clientId || !options.connection) { throw new Error('RTSeePeerConnection: Invalid options'); }
    this.init(options);
  }

  init(options: IRTSeePeeConnection): void {
    this.clientId = options.clientId;
    this.connection = options.connection;
    this.attachConnectionEvents();
  }

  attachConnectionEvents(): void {
    this.connection.ontrack = this.emitOnTrackEvent.bind(this);
    this.connection.onicecandidate = this.emitOnIceCandidateEvent.bind(this);
  }

  attachTrackEvents(): void {
    if (this.remoteAudioStream) {
      this.remoteAudioStream.getTracks()[0].onmute = () => console.log('mute aud');
      this.remoteAudioStream.getTracks()[0].onunmute = () => console.log('unmute aud');

    }

    if (this.remoteVideoStream) {
      this.remoteVideoStream.getTracks()[0].onmute = () => console.log('mute vid');
      this.remoteVideoStream.getTracks()[0].onunmute = () => console.log('unmute vid');
    }
  }


  emitOnTrackEvent(event): void {
    if (event.track.kind === 'video') { this.remoteVideoStream = event.streams[0]; }
    if (event.track.kind === 'audio') { this.remoteAudioStream = event.streams[0]; }
    this.emit('track', {
      clientId: this.clientId,
      event
    });
    this.attachTrackEvents();
  }

  emitOnIceCandidateEvent(event): void {
    this.emit('iceCandidate', {
      clientId: this.clientId,
      event
    });
  }

  addLocalTracks(stream: MediaStream): void {
    stream.getTracks().forEach((track) => {
      if (track.kind === 'audio') {
        this.localAudioTrack = track;
      }
      if (track.kind === 'video') {
        this.localVideoTrack = track;
      }
      this.sender = this.connection.addTrack(track, stream);
    });
  }

  muteLocalAudio(): void {
    this.localAudioTrack.enabled = false;
    this.localVideoTrack.enabled = false;
  }

  endCall(): void {
    return this.connection.close();
  }
}

