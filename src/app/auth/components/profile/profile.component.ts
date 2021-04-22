import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  inProgress: boolean;
  profileForm = new FormGroup({
    name: new FormControl(''),
    surName: new FormControl(''),
    age: new FormControl(''),
    gender: new FormControl('unknown'),
    about: new FormControl(''),
    interests: new FormControl('')
});

  get name(): AbstractControl {
    return this.profileForm.get('name');
  }

  get surName(): AbstractControl {
    return this.profileForm.get('surName');
  }

  get age(): AbstractControl {
    return this.profileForm.get('age');
  }

  get gender(): AbstractControl {
    return this.profileForm.get('gender');
  }

  get about(): AbstractControl {
    return this.profileForm.get('about');
  }

  get interests(): AbstractControl {
    return this.profileForm.get('interests');
  }

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  changeTheme(): void {
    this.authService.setTheme('dark');
  }

  updateProfile(): void {

  }
}
