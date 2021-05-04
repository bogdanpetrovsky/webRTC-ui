import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../data-models/User';

@Component({
  selector: 'app-user-info-modal',
  templateUrl: './user-info-modal.component.html',
  styleUrls: ['./user-info-modal.component.scss']
})
export class UserInfoModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public user: User,
              public dialogRef: MatDialogRef<UserInfoModalComponent>) { }

  ngOnInit(): void {
  }

}
