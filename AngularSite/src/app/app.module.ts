import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FontChangeComponent } from './fontChange.component';
import { UserAccountComponent } from './userAccount.component'; // Import the UserAccountComponent
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    FontChangeComponent, // Import the standalone component
    UserAccountComponent // Import the standalone component
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

