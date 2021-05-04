import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messageForm = new FormGroup({
    message: new FormControl(''),
  });

  constructor() { }

  get messageField(): AbstractControl {
    return this.messageForm.get('message');
  }

  ngOnInit(): void {
  }

  emojiSelected(event): void {
    this.messageField.setValue(this.messageField.value + event.emoji.native);
  }
}
