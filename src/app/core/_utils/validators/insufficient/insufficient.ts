import { FormGroup } from '@angular/forms';

export const insufficient = (key1: string, key2: string): {[key: string]: any} => {
  return (group: FormGroup) => {
    const field1 = group.controls[key1];
    const field2 = group.controls[key2];

    if (field1.value > field2.value) {
      return field1.setErrors({ insufficient: true });
    }
  };
};
