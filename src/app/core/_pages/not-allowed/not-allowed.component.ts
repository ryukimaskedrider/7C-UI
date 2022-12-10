import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-not-allowed',
  templateUrl: './not-allowed.component.html',
  styleUrls: ['./not-allowed.component.scss']
})
export class NotAllowedComponent {

  constructor(private _location: Location) { }

  goHome(): void {
    this._location.back();
  }


}
