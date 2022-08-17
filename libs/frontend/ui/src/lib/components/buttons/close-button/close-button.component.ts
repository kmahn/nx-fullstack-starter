import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'lf-close-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button type="button" class="focus:outline-none">
      <svg xmlns="http://www.w3.org/2000/svg" [class]="iconStyleClass" fill="none" viewBox="0 0 24 24"
           stroke="currentColor"
           stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>`,
})
export class CloseButtonComponent {
  @Input() iconStyleClass = 'h-6 w-6';
}
