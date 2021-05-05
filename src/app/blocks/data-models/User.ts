import { IInterest } from './Interest';

export interface ISocketUser {
  id: string;
  data: string;
}

export interface ISocketUserParsed {
  id: string;
  data: User | IUser;
}

export interface IUser {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  about?: string;
  imageUrl?: string;
  interests?: string;
  gender?: string;
  age?: number;
}

export class User {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  about?: string;
  imageUrl?: string;
  interests?: IInterest[];
  gender?: string;
  age?: number;

  constructor(options?: IUser) {
    if (options) {
      this.init(options);
    }
  }

  init(user: IUser): void {
    if (user.id) { this.id = user.id; }
    if (user.firstName) { this.firstName = user.firstName; }
    if (user.lastName) { this.lastName = user.lastName; }
    if (user.email) { this.email = user.email; }
    if (user.about) { this.about = user.about; }
    if (user.interests) { this.interests = JSON.parse(user.interests); }
    if (user.imageUrl) { this.imageUrl = user.imageUrl; }
    if (user.age) { this.age = user.age; }
    if (user.gender) { this.gender = user.gender; }
  }

  toJson(): IUser {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      about: this.about,
      imageUrl: this.imageUrl,
      interests: JSON.stringify(this.interests),
      age: this.age,
      gender: this.gender,
    };
  }
}
