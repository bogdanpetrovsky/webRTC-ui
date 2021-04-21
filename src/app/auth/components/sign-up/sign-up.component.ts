import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });
  inProgress: boolean;
  hide = true;

  get emailField(): AbstractControl {
    return this.signUpForm.get('email');
  }

  get passwordField(): AbstractControl {
    return this.signUpForm.get('password');
  }
  get confirmPasswordField(): AbstractControl {
    return this.signUpForm.get('confirmPassword');
  }

  constructor() { }

  ngOnInit(): void {
  }

  signUp(): void {
    this.inProgress = !this.inProgress;
  }
}
