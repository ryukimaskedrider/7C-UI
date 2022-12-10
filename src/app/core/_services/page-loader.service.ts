import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { AuthState } from '@core/_store/auth';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageLoaderService implements OnDestroy {

  public loaderEl!: HTMLElement;
  public player!: AnimationPlayer;

  protected subscription = new Subject();

  @Select(AuthState.isRefreshing)
  public isRefreshing$!: Observable<boolean>;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private _animate: AnimationBuilder
  ) {

    this.initialize();
  }

  protected initialize(): void {
    this.loaderEl = this._document.body.querySelector('#page--loader');

    if (this.loaderEl) {
      this.isRefreshing$
        .pipe(takeUntil(this.subscription))
        .subscribe((isRefreshing: boolean) => {
          if (isRefreshing) {
            this.show();
          } else {
            this.hide();
          }
        });
    }
  }

  show(): void {
    this.player = this._animate
      .build([
        style({
          opacity: '0',
          zIndex: '999999'
        }),
        animate('300ms ease', style({ opacity: '1' }))
      ])
      .create(this.loaderEl);

    setTimeout(() => this.player.play());
  }

  hide(): void {
    this.player = this._animate
      .build([
        style({ opacity: '1' }),
        animate('300ms ease', style({
          opacity: '0',
          zIndex: '-10'
        }))
      ])
      .create(this.loaderEl);

    setTimeout(() => this.player.play());
  }

  ngOnDestroy(): void {
    this.subscription.next(null);
    this.subscription.complete();
  }
}
