import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { SubSink } from 'subsink';

@Injectable()
export abstract class BaseComponent implements OnDestroy {
  protected _subscription = new Subject();

  protected subs = new SubSink();

  ngOnDestroy(): void {
    this._subscription.next(null);
    this._subscription.complete();

    this.subs.unsubscribe();
  }
}
