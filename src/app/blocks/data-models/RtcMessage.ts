export interface IRtcMessage {
  from: string;
  to: string;
  text: string;
  mine?: boolean;
}

export class RtcMessage {
  from: string;
  to: string;
  text: string;
  mine?: boolean;

  constructor(options: IRtcMessage) {
    if (options) {
      this.init(options);
    }
  }

  init(options: IRtcMessage): void {
    if (options.from) { this.from = options.from; }
    if (options.to) { this.to = options.to; }
    if (options.text) { this.text = options.text; }
    if (options.mine) { this.mine = options.mine; }
  }
}
