import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lf-control-wrapper-with-error-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './control-wrapper-with-error-message.component.html',
  styleUrls: ['./control-wrapper-with-error-message.component.scss'],
})
export class ControlWrapperWithErrorMessageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
