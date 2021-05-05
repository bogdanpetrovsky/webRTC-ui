export interface IInterest {
  name: string;
}

export class Interest {
  name: string;

  constructor(options?: IInterest) {
    this.name = options.name;
  }
}
