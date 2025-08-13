import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { MainComponent } from '../app/components/main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from '../app/components/signup/signup.component';
import { TermsComponent } from '../app/components/terms/terms.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar'
import { ProfileComponent } from './components/profile/profile.component';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgToastModule } from 'ng-angular-popup';
import { EventEmitterService } from './services/event-emitter.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MainPopUpComponent } from '../app/components/main-pop-up/main-pop-up.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VerifiedEmailComponent } from '../app/components/verified-email/verified-email.component';
import { NewPasswordComponent } from '../app/components/new-password/new-password.component';
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    SignupComponent,
    TermsComponent,
    ProfileComponent,
    MainComponent,
    MainPopUpComponent,
    VerifiedEmailComponent,
    NewPasswordComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatAutocompleteModule,
    NgToastModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MainComponent,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '251009032362-itcbgc5a17o7mug00hoeeul1d3umiqfj.apps.googleusercontent.com'
            ),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
    EventEmitterService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
