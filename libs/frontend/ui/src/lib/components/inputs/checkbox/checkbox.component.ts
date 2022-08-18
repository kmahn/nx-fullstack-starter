import { Component, forwardRef, Input, OnInit, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};

@Component({
  selector: 'lf-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [VALUE_ACCESSOR]
})
export class CheckboxComponent implements ControlValueAccessor, OnInit {
  disabled: boolean = false;
  value: boolean = false;

  @Input() label: string = '';

  private _onChange: any;
  private _onTouch: any;

  constructor() {
  }

  change() {
    this.value = !this.value;

    if (this._onChange) {
      this._onChange(this.value);
    }
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  writeValue(value: boolean): void {
    this.value = value || false;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
  }
}
