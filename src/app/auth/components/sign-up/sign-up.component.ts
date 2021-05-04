import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomPasswordConfirmStateMatcher, CustomValidators } from '../../../blocks/helpers/CustomValidators';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../../blocks/data-models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  errorStateMatcher: CustomPasswordConfirmStateMatcher = new CustomPasswordConfirmStateMatcher();
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  }, { validators: [CustomValidators.checkPasswordsMatch] });
  inProgress: boolean;
  hide = true;
  errors: string;

  get emailField(): AbstractControl {
    return this.signUpForm.get('email');
  }

  get passwordField(): AbstractControl {
    return this.signUpForm.get('password');
  }
  get confirmPasswordField(): AbstractControl {
    return this.signUpForm.get('confirmPassword');
  }

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  signUp(): void {
    if (this.signUpForm.invalid) { this.signUpForm.markAllAsTouched(); return ; }
    this.inProgress = true;
    this.authService.signUp({email: this.emailField.value, password: this.passwordField.value}).then((user: IUser) => {
      console.log(user);
      this.inProgress = false;
      this.router.navigate(['sign-in']).then();
    }).catch((e) => {
      this.inProgress = false;
      this.errors = e.toString().length > 20 ? e : 'Something went wrong!';
    });
  }
}
