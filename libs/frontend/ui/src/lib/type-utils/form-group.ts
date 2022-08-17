import { FormControl } from '@angular/forms';

export type FormGroupType<T> = {
  [key in keyof T]: FormControl<T[key]>;
};
