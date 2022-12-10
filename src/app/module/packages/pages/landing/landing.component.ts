import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  public isUpdate!: boolean;

  updatePackageOptions(data: any) {
    this.isUpdate = data;
  }
}
