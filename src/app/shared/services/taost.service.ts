import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent} from './components/notification/notification.component';
import { INotification, IActionNotification } from './components/notification/types';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _snackBar: MatSnackBar) {}

  open(notification: INotification): void {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: notification,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [
        'notification', `notification--${notification.color}`
      ],
      duration: notification.duration
    });
  }

  notifyAction({ title, message, type }: IActionNotification): void {
    const notification: INotification = {
      title,
      message,
      color: type === 'success' ? 'success' : 'danger',
      icon: {
        show: true,
        name: `heroicons_outline:${type === 'success' ? 'check-circle' : 'x-circle'}`
      },
      duration: 10000
    };

    this.open(notification);
  }
}
