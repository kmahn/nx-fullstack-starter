import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBuilder, MockRender } from 'ng-mocks';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    return MockBuilder(AppComponent, AppModule);
  });

  it('should create the app', () => {
    const fixture = MockRender(AppComponent);
    const component = fixture.point.componentInstance;
    expect(component).toBeTruthy();
  });

  // it(`should have as title 'frontend-web'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app.title).toEqual('frontend-web');
  // });
  //
  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('h1')?.textContent).toContain(
  //     'Welcome frontend-web'
  //   );
  // });
});
