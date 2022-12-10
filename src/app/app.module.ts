import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routing } from './app.routing';
import { TokenInterceptor, RefreshInterceptor } from './core/_interceptors';
import { AppComponent } from './app.component';
/**
 * State Modules
 */
import { NgxsModule } from '@ngxs/store';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
// import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AppState, PersistAppState  } from '@core/_store';

import { environment as env } from '@env/environment';

/**
 * Theme Modules
 */
import { LayoutModule } from '@core/_layout/layout.module';
// import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';
import { SplashScreenService } from '@core/_services';
import { NotAllowedComponent } from './core/_pages/not-allowed/not-allowed.component';
import { NotFoundComponent } from './core/_pages/not-found/not-found.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent,
    NotAllowedComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    routing,
    BrowserAnimationsModule,
    PerfectScrollbarModule,
    HttpClientModule,
    MatButtonModule,
    NgxsModule.forRoot(
      AppState,
      {
        developmentMode: !env.production,
        compatibility: {
          strictContentSecurityPolicy: true
        }
      }
    ),
    NgxsRouterPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot(PersistAppState),
    FlexLayoutModule,
    LayoutModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshInterceptor,
      multi: true
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    SplashScreenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
