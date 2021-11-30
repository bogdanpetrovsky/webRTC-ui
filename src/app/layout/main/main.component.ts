import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../../core/socket-io/socket-io.service';
import { ISocketUser, ISocketUserParsed } from '../../blocks/data-models/User';
import { CallsService } from '../../blocks/services/calls.service';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import {LayoutService} from '../layout.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
selected: boolean;
sockets: ISocketUserParsed[] = [];

myVideoOff: boolean;
myMicrophoneOff: boolean;

messageForm = new FormGroup({
  message: new FormControl(''),
});

  get messageField(): AbstractControl {
    return this.messageForm.get('message');
  }

  constructor(private socketIoService: SocketIoService,
              public layoutService: LayoutService,
              public callsService: CallsService,
              public authService: AuthService) {
  }

  ngOnInit(): void {
    this.socketIoService.initialize();
    this.socketIoService.users$.subscribe((users: ISocketUser[]) => {
      this.sockets = [];
      users.forEach((user: ISocketUser) => {
        this.sockets.push({id: user.id, data: user.data as any});
      });
    });
    this.socketIoService.removedUser$.subscribe((socketId) => {
      console.log(socketId);
      this.sockets = this.sockets.filter((s) => s.id !== socketId);
    });
  }

  stopVideoEvent(): void {
    this.myVideoOff = !this.myVideoOff;
    this.socketIoService.videoEvent(!this.myVideoOff);
  }

  muteMicrophoneEvent(): void {
    this.myMicrophoneOff = !this.myMicrophoneOff;
    this.socketIoService.microphoneEvent(!this.myMicrophoneOff);
  }

  sendMessage(): void {
    if (this.messageField.value && this.messageField.value.trim()) {
      this.socketIoService.emitMessage(this.messageField.value.trim());
      setTimeout(() => { this.messageField.setValue(''); });
    }
  }

  keyDownFunction(event): void {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }

  async select(socketId: string): Promise<void> {
    this.selected = !this.selected;
    await this.socketIoService.callUser(socketId);
  }

  enableShowChat(): void {
    this.layoutService.showChatEnabled = true;
  }
}
