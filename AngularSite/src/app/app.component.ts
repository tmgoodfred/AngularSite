import { Component } from '@angular/core';
import { UserAccountComponent } from './userAccount.component';
import { FontChangeComponent } from './fontChange.component';

@Component({
  selector: 'app-root',
  template: `
    <app-user-account></app-user-account>
    <app-font-change></app-font-change>
  `,
  standalone: true,
  imports: [UserAccountComponent, FontChangeComponent]
})
export class AppComponent { }
