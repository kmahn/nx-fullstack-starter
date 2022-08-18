import { NgModule } from '@angular/core';
import { COMPOSITION_BUFFER_MODE, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FrontendAuthModule } from '@starter/frontend/auth';
import { FrontendLayoutModule } from '@starter/frontend/layout';
import {
  ButtonComponent,
  CheckboxComponent,
  ControlWrapperWithErrorMessageComponent,
  InputComponent
} from '@starter/frontend/ui';
import { environment } from '../environments/environment';
import { routes } from './app-routes';

import { AppComponent } from './app.component';
import { Pages } from './pages';

@NgModule({
  declarations: [
    AppComponent,
    ...Pages,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    FrontendAuthModule.forRoot(environment.authConfig),
    FrontendLayoutModule.forRoot(),
    InputComponent,
    ControlWrapperWithErrorMessageComponent,
    CheckboxComponent,
    ButtonComponent,
  ],
  providers: [
    { provide: COMPOSITION_BUFFER_MODE, useValue: false },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
