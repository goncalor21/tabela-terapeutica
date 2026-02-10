import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from '../app/components/main/main.component'
import { SignupComponent } from '../app/components/signup/signup.component';
import { TermsComponent } from '../app/components/terms/terms.component';
import { ProfileComponent } from './components/profile/profile.component';
import { VerifiedEmailComponent } from './components/verified-email/verified-email.component';
import { NewPasswordComponent } from './components/new-password/new-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'mainPage', pathMatch: 'full' },
  { path: 'mainPage', component: MainComponent },
  // Auth routes redirect to mainPage (hidden for now)
  { path: 'login', redirectTo: 'mainPage', pathMatch: 'full' },
  { path: 'signup', redirectTo: 'mainPage', pathMatch: 'full' },
  { path: 'terms', redirectTo: 'mainPage', pathMatch: 'full' },
  { path: 'profile', redirectTo: 'mainPage', pathMatch: 'full' },
  { path: 'verifiedEmail', redirectTo: 'mainPage', pathMatch: 'full' },
  { path: 'newPassword', redirectTo: 'mainPage', pathMatch: 'full' },
  // Catch-all: redirect to mainPage
  { path: '**', redirectTo: 'mainPage' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
