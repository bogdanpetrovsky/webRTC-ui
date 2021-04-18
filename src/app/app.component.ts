import { Component } from '@angular/core';
import { SocketIoService } from './core/socket-io/socket-io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myWebRTC';

  constructor(private socketIOService: SocketIoService) {
    this.socketIOService.initialize();
  }
}
