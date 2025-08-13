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
  { path: '', redirectTo:'login', pathMatch:'full'},
  { path: 'login', component: LoginComponent},
  { path: 'mainPage', component: MainComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'terms', component: TermsComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'verifiedEmail', component: VerifiedEmailComponent},
  { path: 'newPassword', component: NewPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
