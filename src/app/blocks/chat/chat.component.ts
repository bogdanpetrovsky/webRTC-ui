import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { IRtcMessage, RtcMessage } from '../data-models/RtcMessage';
import { SocketIoService } from '../../core/socket-io/socket-io.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('commentEl') comment: ElementRef;
  @ViewChild('messageInput') messageInputField: ElementRef;
  scrollTop: number = null;

  messages: RtcMessage[] = [];
  messageForm = new FormGroup({
    message: new FormControl(''),
  });

  constructor(private socketService: SocketIoService,
              private authService: AuthService) {
    this.socketService.incomingMessage$.subscribe( (mes: IRtcMessage) => {
      this.messages.push(new RtcMessage(mes));
      setTimeout(() => { this.scrollTop = this.comment.nativeElement.scrollHeight; });
    });
  }

  get messageField(): AbstractControl {
    return this.messageForm.get('message');
  }

  ngOnInit(): void {
  }

  emojiSelected(event): void {
    this.messageField.setValue(this.messageField.value + event.emoji.native);
  }

  send(): void {
    const message: IRtcMessage = {
      from: this.authService.user.firstName,
      to: '',
      text: this.messageField.value
    };
    this.socketService.emitMessage({
      event: 'incoming-message',
      data: message
    });

    message.mine = true;
    this.messages.push(new RtcMessage(message));
    setTimeout(() => { this.scrollTop = this.comment.nativeElement.scrollHeight; });
    this.messageField.setValue('');
    this.messageInputField.nativeElement.focus();
  }

  keyDownFunction(event): void {
    if (event.keyCode === 13) {
      this.send();
      setTimeout(() => { this.messageField.setValue(''); });
    }
  }
}
