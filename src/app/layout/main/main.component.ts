import { Component, OnInit } from '@angular/core';
import { SocketIoService } from '../../core/socket-io/socket-io.service';
import { ISocketUser } from '../../blocks/data-models/User';
import { CallsService } from '../../blocks/services/calls.service';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
selected: boolean;
hidden = true;
sockets: ISocketUser[] = [];

  constructor(private socketIoService: SocketIoService,
              public callsService: CallsService) {
  }

  ngOnInit(): void {
    this.socketIoService.users$.subscribe((users) => {
      console.log(users);
      this.sockets = users;
    });
  }

  async select(user: ISocketUser): Promise<void> {
    this.selected = !this.selected;
    await this.socketIoService.callUser(user);
  }
}
