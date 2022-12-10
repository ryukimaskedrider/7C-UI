import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[nxLabelTmp]' })
export class NgLabelTemplateDirective {
  constructor(public template: TemplateRef<any>) {}
}
