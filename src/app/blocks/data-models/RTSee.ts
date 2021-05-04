import { WSMessageInterface } from '../../core/socket-io/socket-io.service';
import { RTSeePeerConnectionsList } from './RTSeePeerConnectionsList';
import { RTSeePeerConnection } from './RTSeePeerConnection';
import { EventEmitter } from 'events';


export interface IRTSee {
  roomId: string;
  constraints?: MediaStreamConstraints;
  videoEl?: HTMLVideoElement;
  iceServers?: RTCIceServer[];
  wsSignal?: (message: WSMessageInterface) => void;
}

export class RTSee extends EventEmitter {
  private roomId: string;
  private clientId: string;
  private constraints: MediaStreamConstraints;
  private videoEl: HTMLVideoElement;
  localStream: MediaStream;
  private remoteStream: MediaStream;
  private iceServers: RTCIceServer[];
  rtcPeerConnections: RTSeePeerConnectionsList = new RTSeePeerConnectionsList();
  private wsSignal: (message: WSMessageInterface) => void;
  mute: boolean;
  camera: boolean;

  constructor(options?: IRTSee) {
    super();
    if (options) { this.init(options); }
  }

  init(options: IRTSee): void {
    this.clientId = this.uuidv4();
    if (options.roomId) { this.roomId = options.roomId; }
    if (options.constraints) { this.constraints = options.constraints; }
    if (options.videoEl) { this.videoEl = options.videoEl; }
    if (options.iceServers) { this.iceServers = options.iceServers; }
    if (options.wsSignal) { this.wsSignal = options.wsSignal; }
  }

  getUserMedia(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia(this.constraints)
      .catch(this.onGetUserMediaError.bind(this))
      .then(this.onGetUserMediaSuccess.bind(this));
  }

  offer(options): void {
    const peer = this.rtcPeerConnections.add(new RTSeePeerConnection({
      connection: new RTCPeerConnection(this.iceServers as RTCConfiguration),
      clientId: options.clientId
    }));
    this.addLocalTracks(peer);
    this.attachPeerConnectionEvents(peer);
    this.createOffer(peer);
  }

  answer(options): void {
    const peer = this.rtcPeerConnections.add(new RTSeePeerConnection({
      connection: new RTCPeerConnection(this.iceServers as RTCConfiguration),
      clientId: options.clientId
    }));
    this.addLocalTracks(peer);
    this.attachPeerConnectionEvents(peer);
    this.setRemoteDescription(options);
    this.createAnswer(peer);
  }

  addIceCandidate(event): void {
    this.rtcPeerConnections.addIceCandidate(event.clientId, new RTCIceCandidate({
      sdpMLineIndex: event.label,
      candidate: event.candidate,
    }));
  }

  setRemoteDescription(event): void {
    this.rtcPeerConnections.setRemoteDescription(event.clientId, new RTCSessionDescription(event.sdp));
  }

  getClientId(): string {
    return this.clientId;
  }

  muteClicked(): void {
    // this.mute = this.localStream.getAudioTracks()[0].enabled = true;
    this.rtcPeerConnections.muteLocalAudio();
    console.log(this.mute + 'mute');
  }

  unmuteClicked(): void {
    this.mute = this.localStream.getAudioTracks()[0].enabled = false;
    console.log(this.mute + 'Unmute');
  }

  cameraOff(): void {
    this.camera = this.localStream.getVideoTracks()[0].enabled = true;
    console.log(this.camera + 'off');
  }

  cameraOn(): void {
    this.camera = this.localStream.getVideoTracks()[0].enabled = false;
    console.log(this.camera + 'on');
  }

  private createAnswer(peer: RTSeePeerConnection): void {
    this.getAnswer(peer.connection)
      .then((result) => {
        peer.connection.setLocalDescription(result);
        // this.emit('webrtc_answer', {
        //   type: 'webrtc_answer',
        //   sdp: result
        // });
        this.wsSignal({
          event: 'rtc_answer',
          data: {
            type: 'rtc_answer',
            sdp: result,
            roomId: this.roomId,
            from: this.clientId,
            to: peer.clientId
          }
        });
      });
  }

  private createOffer(peer: RTSeePeerConnection): void {
    this.getOffer(peer.connection)
      .then((result) => {
        peer.connection.setLocalDescription(result);
        // this.emit('webrtc_offer', {
        //   type: 'webrtc_offer',
        //   sdp: result
        // });
        this.wsSignal({
          event: 'rtc_offer',
          data: {
            type: 'rtc_offer',
            sdp: result,
            roomId: this.roomId,
            from: this.clientId,
            to: peer.clientId
          }
        });
      });
  }

  private attachPeerConnectionEvents(peer: RTSeePeerConnection): void {
    peer.on('track', this.onRemoteTrack.bind(this));
    peer.on('iceCandidate', this.onIceCandidate.bind(this));
  }

  private onRemoteTrack(data): void {
    // this.videoEl.srcObject = data.event.streams[0];
    // this.videoEl.play();
  }

  private onIceCandidate(data): any {
    if (!data.event.candidate) { return false; }
    // this.emit('ice-candidate', {
    //   label: event.candidate.sdpMLineIndex,
    //   candidate: event.candidate.candidate,
    // });
    this.wsSignal({
      event: 'ice_candidate',
      data: {
        label: data.event.candidate.sdpMLineIndex,
        candidate: data.event.candidate.candidate,
        roomId: this.roomId,
        from: this.clientId,
        to: data.clientId
      }
    });
  }

  private addLocalTracks(peer: RTSeePeerConnection): void {
    peer.addLocalTracks(this.localStream);
  }

  private onGetUserMediaError(e): void {
    console.log(e);
  }

  private onGetUserMediaSuccess(stream: MediaStream): void {
    this.localStream = stream;
    this.attachVideoStream();
  }

  private attachVideoStream(): any {
    if (!this.videoEl) { return false; }
    // this.videoEl.srcObject = this.localStream;
  }

  private getAnswer(peerConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
    return peerConnection.createAnswer();
  }

  private getOffer(peerConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
    return peerConnection.createOffer();
  }



  private uuidv4(): string {
    return ([1e7] as any + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      // tslint:disable-next-line:no-bitwise
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
}

