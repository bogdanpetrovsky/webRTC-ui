export interface ISocketUser {
  socketId: string;
  name: string;
}

export interface IUser {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  about?: string;
  imageUrl?: string;
  interests?: string;
}

export class User {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  about?: string;
  imageUrl?: string;
  interests?: string;

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
    if (user.interests) { this.interests = user.interests; }
    if (user.imageUrl) { this.imageUrl = user.imageUrl; }
  }

  toJson(): IUser {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      about: this.about,
      imageUrl: this.imageUrl,
      interests: this.interests,
    };
  }
}
