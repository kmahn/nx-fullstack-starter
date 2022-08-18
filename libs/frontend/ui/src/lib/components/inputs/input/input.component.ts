import { Component, ElementRef, forwardRef, HostListener, Input, OnInit, Provider, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
  multi: true,
};

@Component({
  selector: 'lf-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [VALUE_ACCESSOR],
})
export class InputComponent implements ControlValueAccessor, OnInit {
  disabled: boolean = false;
  value: string = '';

  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @ViewChild('inputRef') inputRef?: ElementRef;

  private _onChange: any;
  private _onTouch: any;

  constructor() {
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  ngOnInit(): void {
  }

  change(value: string) {
    this.value = value;
    if (this._onChange) {
      this._onChange(this.value);
    }
  }
}
