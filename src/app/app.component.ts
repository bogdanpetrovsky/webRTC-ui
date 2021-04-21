import { Component, OnInit, Renderer2 } from '@angular/core';
import { SocketIoService } from './core/socket-io/socket-io.service';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'myWebRTC';

  constructor(private socketIOService: SocketIoService,
              private authService: AuthService,
              private renderer: Renderer2) {
    this.socketIOService.initialize();
  }

  ngOnInit(): void {
    this.setTheme(this.authService.getActiveTheme());
    this.authService.changeTheme$.subscribe((theme: string) => {
      this.setTheme(theme);
      this.authService.themeChanged(theme);
    });
  }

  setTheme(newTheme?): void {
    const currentTheme = this.authService.getActiveTheme();

    if (currentTheme) {
      this.renderer.removeClass(document.body, currentTheme);
    }
    if (newTheme) {
      this.renderer.addClass(document.body, newTheme);
    }
  }
}
