import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MainComponent } from './layout/main/main.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ShellComponent } from './layout/shell/shell.component';
import { RouterModule } from '@angular/router';
import { SignInComponent } from './auth/components/sign-in/sign-in.component';
import { SignUpComponent } from './auth/components/sign-up/sign-up.component';
import { ProfileComponent } from './auth/components/profile/profile.component';
import { AppRoutingModule } from './app-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MultiselectComponent } from './blocks/multiselect/multiselect.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { UserThumbnailComponent } from './blocks/user-thumbnail/user-thumbnail.component';
import { UserInfoModalComponent } from './blocks/user-thumbnail/user-info-modal/user-info-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ChatComponent } from './blocks/chat/chat.component';
import { VideoControlsComponent } from './blocks/video-controls/video-controls.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth/interceptors/AuthInterceptor';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    ShellComponent,
    SignInComponent,
    SignUpComponent,
    ProfileComponent,
    MultiselectComponent,
    UserThumbnailComponent,
    UserInfoModalComponent,
    ChatComponent,
    VideoControlsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterModule,
    AppRoutingModule,
    MatSelectModule,
    FormsModule,
    NgSelectModule,
    FormsModule,
    PickerModule,
    EmojiModule,
    MatDialogModule,
    HttpClientModule
  ],
  entryComponents: [
    UserInfoModalComponent
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
