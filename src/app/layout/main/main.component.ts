import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../../core/socket-io/socket-io.service';
import { ISocketUser, ISocketUserParsed } from '../../blocks/data-models/User';
import { CallsService } from '../../blocks/services/calls.service';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
selected: boolean;
sockets: ISocketUserParsed[] = [];

  constructor(private socketIoService: SocketIoService,
              public callsService: CallsService) {
  }

  ngOnInit(): void {
    this.socketIoService.users$.subscribe((users: ISocketUser[]) => {
      console.log(users);
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

  async select(socketId: string): Promise<void> {
    this.selected = !this.selected;
    await this.socketIoService.callUser(socketId);
  }
}
