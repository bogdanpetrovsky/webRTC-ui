import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../../core/socket-io/socket-io.service';
import { ISocketUser, ISocketUserParsed } from '../../blocks/data-models/User';
import { CallsService } from '../../blocks/services/calls.service';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { LayoutService } from '../layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import {MatDialog} from '@angular/material/dialog';
import {InviteUsersModalComponent} from '../../blocks/modals/invite-users-modal/invite-users-modal.component';

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
roomId: string;

  get messageField(): AbstractControl {
    return this.messageForm.get('message');
  }

  constructor(private socketIoService: SocketIoService,
              public layoutService: LayoutService,
              public callsService: CallsService,
              public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private dialog: MatDialog
              ) {
  }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    if (!this.roomId) {
      const newRoomId = uuidv4();
      this.router.navigate(['room', newRoomId]).then();
    }
    this.socketIoService.initialize(this.roomId);
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

  openInviteModal(): void {
    this.dialog
    .open(InviteUsersModalComponent, {
      width: '500px',
      maxHeight: '90vh',
      data: this.roomId
    })
    .afterClosed().subscribe(() => {});
  }
}
