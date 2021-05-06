import { Component, Input, OnInit, Output } from '@angular/core';
import { CallsService } from '../services/calls.service';
import { SocketIoService } from '../../core/socket-io/socket-io.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-video-controls',
  templateUrl: './video-controls.component.html',
  styleUrls: ['./video-controls.component.scss']
})
export class VideoControlsComponent implements OnInit {
  @Input() call: CallsService;
  @Output() hangedUp = new EventEmitter<boolean>();
  constructor(private socketService: SocketIoService) { }

  ngOnInit(): void {
  }

  hangUp(): void {
    this.socketService.remoteTracks = [];
  }
}
