import { Routes } from '@angular/router';
import { NotAuthGuard } from '@starter/frontend/auth';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: 'main', component: MainPageComponent },
  { path: 'login', canActivate: [NotAuthGuard], component: LoginPageComponent },
  { path: 'signup', canActivate: [NotAuthGuard], component: SignupPageComponent },
];
