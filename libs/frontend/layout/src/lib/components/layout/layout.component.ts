import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { LayoutConfig } from '../../types';

@Component({
  selector: 'lf-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  @Output() logout: EventEmitter<undefined> = new EventEmitter<undefined>();

  constructor(
    public layoutService: LayoutService,
  ) {
  }

  @Input() set config(config: LayoutConfig) {
    if (config) {
      this.layoutService.config = { ...config };
    }
  }
}
