import { WSMessageInterface } from '../../core/socket-io/socket-io.service';
import { Connector } from './Connector';


export interface ICall {
  fromId?: string;
  toId?: string;
  token?: string;
  videoEl?: HTMLVideoElement;
  iceServers?: RTCIceServer[];
  wsSignal?: (message: WSMessageInterface) => void;
}

export class Call {
  fromId: string;
  toId: string;
  token: string;
  connector: Connector;
  videoEl: HTMLVideoElement;
  iceServers: RTCIceServer[];
  wsSignal: (message: WSMessageInterface) => void;

  constructor(options?: ICall) {
    if (options) { this.init(options); }
  }

  init(options: ICall): void {
    this.fromId = options.fromId;
    this.toId = options.toId;
    this.token = options.token;
    this.videoEl = options.videoEl;
    this.iceServers = options.iceServers;
    this.wsSignal = options.wsSignal;
  }

  connect(): any {
    this.connector = new Connector({
      token: this.token,
      videoEl: this.videoEl,
      wsSignal: this.wsSignal
    });

    return this.getUserMedia();
  }

  startCall(message): void {
    this.connector.start(message);
  }

  answerCall(event): void {
    this.connector.answer(event);
  }

  setRemoteDescription(event): void {
    this.connector.setRemoteDescription(event);
  }

  getUserMedia(): any {
    return this.connector.getUserMedia();
  }

  onIceCandidate(event): void {
    this.connector.onIceCandidate(event);
  }

  getClientId(): any {
    if (!this.connector) { return null; }
    return this.connector.getClientId();
  }

}
