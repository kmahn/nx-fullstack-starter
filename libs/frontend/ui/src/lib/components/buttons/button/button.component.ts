import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lf-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {

  @Input() disabled: boolean = false;
  @Input() type: 'submit' | 'button' | 'reset' = 'submit';

  constructor() {}

  ngOnInit(): void {}
}
