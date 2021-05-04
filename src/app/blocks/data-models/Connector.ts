import { WSMessageInterface } from '../../core/socket-io/socket-io.service';
import { RTSee } from './RTSee';


export interface IConnector {
  token: string;
  videoEl?: HTMLVideoElement;
  iceServers?: RTCIceServer[];
  wsSignal?: (message: WSMessageInterface) => void;
}

export class Connector {
  token: string;
  connection: RTSee;

  constructor(options?: IConnector) {
    if (options) { this.init(options); }
  }

  init(options: IConnector): any {
    if (!options) { return false; }
    this.token = options.token;
    this.connection = new RTSee({
      roomId: this.token,
      constraints: { audio: true, video: true },
      videoEl: options.videoEl,
      iceServers: options.iceServers,
      wsSignal: options.wsSignal
    });
  }

  getUserMedia(): Promise<MediaStream> {
    return this.connection.getUserMedia();
  }

  onIceCandidate(event): void {
    this.connection.addIceCandidate(event);
  }

  start(message): void {
    this.connection.offer(message);
  }

  answer(event): void {
    this.connection.answer(event);
  }

  setRemoteDescription(event): void {
    this.connection.setRemoteDescription(event);
  }

  getClientId(): string {
    return this.connection.getClientId();
  }
}

