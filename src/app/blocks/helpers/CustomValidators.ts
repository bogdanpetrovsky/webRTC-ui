import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CustomValidators {

  static password(control: AbstractControl): ValidationErrors | null {
    let error: string;

    const value: string = control.value;

    if (!value || value.length < 8) {
      error = 'Minimum password length is 8';
    } else if (!/.*[a-z].*/.test(value)) {
      error = 'Password should contain lowercase letters';
    } else if (!/.*[A-Z].*/.test(value)) {
      error = 'Password should contain uppercase letters';
    } else if (!/.*[0-9].*/.test(value)) {
      error = 'Password should contain numbers';
    } else if (!/[^a-zA-Z0-9]/.test(value)) {
      error = 'Password should contain special characters';
    }

    return !error ? null : {
      password: {
        error
      }
    };
  }

  static checkPasswordsMatch(group: FormGroup): any { // here we have the 'passwords' group
    const password = group.get('password').value;
    const passwordConfirmation = group.get('confirmPassword').value;

    return password === passwordConfirmation ? null : {notMatching: true};
  }
}

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.dirty && control.parent.dirty);
    const invalidParent = !!(control && control.dirty && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

export class CustomPasswordConfirmStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const password = control.parent.get('password');
    const passwordConfirmation = control.value;

    return (password.value !== passwordConfirmation && control.touched) || (!password.valid && password.touched);
  }
}

export class CustomEmailConfirmStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const email = control.parent.get('newEmail');
    const emailConfirmation = control.value;

    return (email.value !== emailConfirmation && control.touched) || (!email.valid && email.touched);
  }
}

export class CustomMaxSalaryStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const minSalary = control.parent.get('minSalary').value;
    const maxSalary = control.value;

    return (((minSalary && maxSalary) && minSalary >= maxSalary || control.invalid) && control.touched);
  }
}
