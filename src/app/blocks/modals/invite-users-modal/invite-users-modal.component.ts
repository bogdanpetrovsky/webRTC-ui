import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-invite-users-modal',
  templateUrl: './invite-users-modal.component.html',
  styleUrls: ['./invite-users-modal.component.scss']
})
export class InviteUsersModalComponent implements OnInit {
  inviteForm = new FormGroup({
    roomId: new FormControl('', [Validators.required])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public roomId: string,
              private router: Router,
              public dialogRef: MatDialogRef<InviteUsersModalComponent>) { }

  ngOnInit(): void {
    this.inviteForm.get('roomId').setValue('http://localhost:4200' + this.router.url);
  }

  copyLink(): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = `${environment.production ? '' : 'http://localhost:4200'}${this.router.url}`;
    document.body.appendChild(selBox);

    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.dialogRef.close();
  }
}
