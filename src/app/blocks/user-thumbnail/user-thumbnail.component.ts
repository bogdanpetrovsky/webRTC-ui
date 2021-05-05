import { Component, Input, OnInit, Output } from '@angular/core';
import { User } from '../data-models/User';
import { EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserInfoModalComponent } from './user-info-modal/user-info-modal.component';

@Component({
  selector: 'app-user-thumbnail',
  templateUrl: './user-thumbnail.component.html',
  styleUrls: ['./user-thumbnail.component.scss']
})
export class UserThumbnailComponent implements OnInit {
@Input() user: User;
@Output() offerMade = new EventEmitter<boolean>();
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.user);
  }

  chatClicked(): void {
    this.offerMade.emit(true);
  }

  openUserInfoModal(): void {
    this.dialog
      .open(UserInfoModalComponent, {
        width: '500px',
        maxHeight: '90vh',
        data: this.user
      })
      .afterClosed().subscribe(() => {});
  }
}
