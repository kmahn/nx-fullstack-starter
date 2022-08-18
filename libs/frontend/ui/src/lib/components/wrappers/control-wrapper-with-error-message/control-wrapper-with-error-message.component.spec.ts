import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlWrapperWithErrorMessageComponent } from './control-wrapper-with-error-message.component';

describe('ControlWrapperWithErrorMessageComponent', () => {
  let component: ControlWrapperWithErrorMessageComponent;
  let fixture: ComponentFixture<ControlWrapperWithErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlWrapperWithErrorMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlWrapperWithErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
