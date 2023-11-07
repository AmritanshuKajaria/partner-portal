import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ListNgZorroModule } from './shared/list-ng-zorro/list-ng-zorro.module';
import { MainModule } from './pages/main/main.module';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthInterceptor } from './shared/interceptor/auth.interceptor';
import { ShowMyIpComponent } from './components/show-my-ip/show-my-ip.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
    ShowMyIpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    MainModule,
    ListNgZorroModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    // { provide: 'googleTagManagerId', useValue: 'GTM-KM84SJMX' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
