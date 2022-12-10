import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SplashScreenService {

  public splashScreenEl: HTMLElement;
  public player: AnimationPlayer;

  constructor(
    private _animationBuilder: AnimationBuilder,
    @Inject(DOCUMENT) private _document: Document,
    private _router: Router
  ) {
    this._init();
  }

  private _init(): void {
    this.splashScreenEl = this._document.body.querySelector('#splash-screen');

    if (this.splashScreenEl) {
      this._router
        .events
        .pipe(
          filter((event => event instanceof NavigationEnd)),
          take(1)
        )
        .subscribe(() => {
          setTimeout(() => this.hide());
        });
    }
  }

  show(): void {
    this.player = this._animationBuilder
      .build([
        style({
          opacity: '0',
          zIndex: '999999'
        }),
        animate('400ms ease', style({ opacity: '1' }))
      ])
      .create(this.splashScreenEl);

    setTimeout(() => this.player.play());
  }

  hide(): void {
    this.player = this._animationBuilder
      .build([
        style({ opacity: '1' }),
        animate('400ms ease', style({
          opacity: '0',
          zIndex: '-10'
        }))
      ])
      .create(this.splashScreenEl);

    setTimeout(() => this.player.play());
  }
}
