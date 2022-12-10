import { NgModule } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@NgModule()
export class IconsModule {

  constructor(
    private _domSanitizer: DomSanitizer,
    private _iconRegistry: MatIconRegistry
  ) {
    this._iconRegistry.addSvgIconSetInNamespace(
      'heroicons_outline',
      this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-outline.svg')
    );
  }
}
