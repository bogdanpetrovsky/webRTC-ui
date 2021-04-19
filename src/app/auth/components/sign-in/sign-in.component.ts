import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signInForm = new FormGroup({
  email: new FormControl(''),
  password: new FormControl('')
});
  inProgress: boolean;
  hide = true;

  get emailField(): AbstractControl {
    return this.signInForm.get('email');
  }

  get passwordField(): AbstractControl {
    return this.signInForm.get('password');
  }

  constructor() { }

  ngOnInit(): void {
  }

  signIn(): void {
    this.inProgress = !this.inProgress;
  }
}
