import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

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
  errors: string;


  get emailField(): AbstractControl {
    return this.signInForm.get('email');
  }

  get passwordField(): AbstractControl {
    return this.signInForm.get('password');
  }

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }

  signIn(): void {
    if (this.signInForm.invalid) { this.signInForm.markAllAsTouched(); return ; }
    this.inProgress = true;
    this.authService.signIn({email: this.emailField.value, password: this.passwordField.value}).subscribe(
      (response) => {
        this.authService.setToken(response.token);
        this.authService.setUser(response.user);
        console.log(response);
        this.inProgress = false;
        this.router.navigate(['']).then();
      },
      (e) => {
        this.inProgress = false;
        this.errors = e.toString().length > 20 ? e : 'Something went wrong!';
      });
  }
}
