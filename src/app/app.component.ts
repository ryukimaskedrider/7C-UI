import { Component } from '@angular/core';
import { SplashScreenService, PageLoaderService } from './core/_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '7C Systems';

  constructor(
    private _splashScreenService: SplashScreenService,
    private _pageLoaderService: PageLoaderService
  ) {}
}
