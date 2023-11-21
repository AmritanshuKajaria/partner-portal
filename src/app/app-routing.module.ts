import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { authGuard } from './shared/guard/auth.guard';
import { logoutGuard } from './shared/guard/logout.guard';
import { ShowMyIpComponent } from './components/show-my-ip/show-my-ip.component';
import { ZendeskSSOComponent } from './components/zendesk-sso/zendesk-sso.component';

const routes: Routes = [
  {
    path: 'showmyip',
    component: ShowMyIpComponent,
  },
  {
    path: 'zendesk/sso',
    component: ZendeskSSOComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login',
    // main/dashboard
  },
  {
    path: 'auth',
    // canActivate: [logoutGuard],
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./pages/auth/auth.module').then((modules) => modules.AuthModule),
  },
  {
    path: 'main',
    // canActivate: [authGuard],
    component: MainLayoutComponent,
    loadChildren: () =>
      import('./pages/main/main.module').then((m) => m.MainModule),
  },
  {
    path: '**',
    redirectTo: '/main/dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
