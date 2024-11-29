import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/fontChange.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientModule, FormsModule)],
}).catch(err => console.error(err));
