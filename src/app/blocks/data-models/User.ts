export interface ISocketUser {
  socketId: string;
  name: string;
}

export interface IUser {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  about?: string;
  imageUrl?: string;
  interests?: string;
}

export class User {
  email?: string;
  password?: string;
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
    if (user.firstName) { this.firstName = user.firstName; }
    if (user.lastName) { this.lastName = user.lastName; }
    if (user.email) { this.email = user.email; }
    if (user.about) { this.about = user.about; }
    if (user.interests) { this.interests = user.interests; }
    if (user.imageUrl) { this.imageUrl = user.imageUrl; }
  }
}
