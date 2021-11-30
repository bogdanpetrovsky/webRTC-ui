import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  showChatEnabled: boolean;
  showActiveUsersEnabled: boolean;

  constructor() {}

  triggerLayoutChange(): void {
    if (this.showChatEnabled) {this.showChatEnabled = false; return ; }
    if (this.showActiveUsersEnabled) {this.showActiveUsersEnabled = false; return ; }

    this.showActiveUsersEnabled = true;
  }

}
