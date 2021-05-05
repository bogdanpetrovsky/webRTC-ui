import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { IUser, User } from '../../../blocks/data-models/User';
import { MultiSelect } from '../../../blocks/data-models/Multiselect';
import { Interest } from '../../../blocks/data-models/Interest';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  inProgress: boolean;
  interestsConfig: MultiSelect = new MultiSelect({
    remoteRequest: this.userService.searchByTitle.bind(this.userService),
    model: Interest,
    placeholder: 'Interests *',
    required: true,
    notFoundText: 'Start typing interests...',
    label: 'name',
    single: false,
  });
  profileForm = new FormGroup({
    name: new FormControl(''),
    surName: new FormControl(''),
    age: new FormControl(''),
    gender: new FormControl('unknown'),
    about: new FormControl(''),
    interests: new FormControl('', [Validators.required])
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

  constructor(private authService: AuthService,
              private userService: UsersService) { }

  ngOnInit(): void {
    this.populateForms(this.authService.getUser());
  }

  populateForms(user: User): void {
    console.log(user);
    this.name.setValue(user.firstName);
    this.surName.setValue(user.lastName);
    this.age.setValue(user.age);
    this.interests.setValue(user.interests);
    this.interestsConfig.addPreselectedItemsList(user.interests);
    this.gender.setValue(user.gender);
    this.about.setValue(user.about);
  }

  updateProfile(): void {
    const selectedInterests = this.interestsConfig.getList();

    if (!selectedInterests || !selectedInterests.length) {
      this.interestsConfig.setInvalidState();
      return ;
    }
    this.interests.setValue(this.interestsConfig.getList());
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return ; }

    const userObject = this.getInputData();
    console.log(userObject);

    this.inProgress = true;
    this.userService.update(this.authService.getUserId(), userObject).subscribe(
      (user) => {
        this.authService.setUser(user);
        this.inProgress = false;
    },
      (e) => {
        this.inProgress = false;
        console.log(e);
      });
  }

  getInputData(): IUser {
    return {
      firstName: this.name.value,
      lastName: this.surName.value,
      age: this.age.value,
      interests: JSON.stringify(this.interests.value),
      gender: this.gender.value,
      about: this.about.value,
    };
  }
}
