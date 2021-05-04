import * as _ from 'underscore';
import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

import { concatMap, map } from 'rxjs/operators';
import { Observable, Subscriber } from 'rxjs';
import { SocketIoService, WSMessageInterface } from '../../core/socket-io/socket-io.service';
import { Call, ICall } from '../data-models/Call';
import { environment } from '../../../environments/environment';


const RTSeeMessageTypes = {
  roomCreated: 'room_created',
  roomJoined: 'room_joined',
  roomFull: 'room_full',
  callStart: 'call_start',
  rtcOffer: 'rtc_offer',
  rtcAnswer: 'rtc_answer',
  iceCandidate: 'ice_candidate'
};

@Injectable({
  providedIn: 'root'
})
export class CallsService {
  call: Call;
  videoEl: HTMLVideoElement;
  roomCreator: boolean;
  isExpanded = true;

  constructor( private socketIoService: SocketIoService) {
    this.init();
  }

  init(): void {
    this.socketIoService.message$.subscribe((message: WSMessageInterface) => this.onMessageReceived(message));
  }

  // create(options: ICall) {
  //   return this.http.post<ICall>(`${environment.apiUrl}/calls`, options).pipe(
  //     concatMap((response: ICall) => this.initializeCall(response))
  //   );
  // }
  //
  // get(token: string) {
  //   return this.http.get<ICall>(`${environment.apiUrl}/calls/${token}`);
  // }
  //
  // joinCall(callId: string): Observable<Call> {
  //   return this.initializeCall({token: callId}).pipe(
  //     map((call: Call) => {
  //       this.socketIoService.emitMessage({ event: 'join_call', data: { roomId: callId, clientId: call.getClientId() } });
  //       return call;
  //     })
  //   );
  // }
  //
  // initializeCall(options: ICall): Observable<Call> {
  //   const callConfig = _.extend(options, {
  //     videoEl: this.videoEl,
  //     iceServers: environment.iceServers,
  //     wsSignal: this.socketIoService.emitMessage.bind(this.socketIoService)
  //   });
  //
  //   this.call = new Call(callConfig);
  //
  //   return new Observable((observer: Subscriber<Call>): void => {
  //     this.call.connect()
  //       .then(() => {
  //         observer.next(this.call);
  //       })
  //       .catch((e) => {
  //         return observer.error(e);
  //       });
  //   });
  // }
  //
  // isCallActive() {
  //   return !!this.call;
  // }
  //
  // setVideoEl(element: HTMLVideoElement) {
  //   this.videoEl = element;
  // }
  //
  // expand() {
  //   this.isExpanded = true;
  // }
  //
  // collapse() {
  //   this.isExpanded = false;
  // }
  //
  private onMessageReceived(message: WSMessageInterface): void {
    switch (message.event) {
      case RTSeeMessageTypes.roomCreated : {
        this.onRoomCreated();
        break;
      }
      case RTSeeMessageTypes.roomJoined: {
        this.onRoomJoined(message);
        break;
      }
      case RTSeeMessageTypes.callStart: {
        this.onCallStart();
        break;
      }
      case RTSeeMessageTypes.rtcOffer: {
        this.onRtcOffer(message);
        break;
      }
      case RTSeeMessageTypes.rtcAnswer: {
        this.onRtcAnswer(message);
        break;
      }
      case RTSeeMessageTypes.iceCandidate: {
        this.onIceCandidate(message);
        break;
      }
      default: {
        break;
      }
    }
  }

  onRoomCreated(): void  {
    this.roomCreator = true;
  }

  onRoomJoined(message): any  {
    if (!this.call || !this.call.token) { return false; }
    // this.socketIoService.emitMessage({ event: 'call_start', data: this.call.token });
    this.call.startCall(message);
  }

  onCallStart(): boolean  {
    if (!this.roomCreator) { return false; }
    // this.call.startCall();
  }

  onRtcOffer(event): void  {
    this.call.answerCall(event);
  }

  onRtcAnswer(event): void  {
    this.call.setRemoteDescription(event);
  }

  onIceCandidate(event): void  {
    this.call.onIceCandidate(event);
  }
}
