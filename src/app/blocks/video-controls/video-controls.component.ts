import { Component, Input, OnInit } from '@angular/core';
import { CallsService } from '../services/calls.service';

@Component({
  selector: 'app-video-controls',
  templateUrl: './video-controls.component.html',
  styleUrls: ['./video-controls.component.scss']
})
export class VideoControlsComponent implements OnInit {
  @Input() call: CallsService;
  constructor() { }

  ngOnInit(): void {
  }

}
