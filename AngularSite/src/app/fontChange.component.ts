import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface WeatherResponse {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_f: number;
    condition: {
      text: string;
    };
    humidity: number;
    wind_mph: number;
  };
}

@Component({
  selector: 'app-font-change',
  template: `
    <section class="centered-section">
      <div class="centered-content text-center">
        <h1>This is a section to test fun functions!</h1>
        <p>How about checking the weather?</p>

        <input
          class="form-control w-50 mb-3 mx-auto"
          type="text"
          placeholder="Enter Location"
          [(ngModel)]="location"
          name="locationTextBox"
          required
        />

        <button class="btn btn-primary mb-3" type="button" (click)="getWeather()">Get Weather</button>

        <div class="weather-info shadow-lg mx-auto" *ngIf="weatherInfo">
          <h3>{{ weatherInfo.location }}</h3>
          <p><strong>Temperature:</strong> {{ weatherInfo.temp_f }}°F</p>
          <p><strong>Condition:</strong> {{ weatherInfo.condition }}</p>
          <p><strong>Humidity:</strong> {{ weatherInfo.humidity }}%</p>
          <p><strong>Wind Speed:</strong> {{ weatherInfo.wind_mph }} mph</p>
        </div>
      </div>
    </section>

    <section id="fun-font" class="centered-section">  
      <div class="centered-content">  
        <div class="col-lg-8 mx-auto text-center">  
          <h1 [style.fontFamily]="currentFont">Change the Font for Fun!</h1>  
          <p>Click the button to change the font of this text randomly.</p>  
          <button class="btn btn-primary btn-lg" (click)="changeFont()">Change Font</button>  
        </div>  
      </div>  
    </section>
  `,
  styles: [`
    .centered-section {
      padding: 20px 0;
    }
    .weather-info {
      width: 300px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #f9f9f9;
      margin-bottom: 15px; /* Ensure at least 15px gap */
    }
    .weather-info h3 {
      margin-top: 0;
    }
  `],
  standalone: true,
  imports: [FormsModule],
})
export class FontChangeComponent implements OnInit, OnDestroy {
  fonts: string[] = [
    'Arial', 'Courier New', 'Georgia', 'Tahoma', 'Verdana',
    'Times New Roman', 'Comic Sans MS', 'Impact', 'Lucida Console'
  ];
  currentFont: string = 'Arial';

  location: string = '';
  weatherInfo: any = null;

  private subscription: Subscription | null = null;
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeFont(): void {
    const randomIndex = Math.floor(Math.random() * this.fonts.length);
    this.currentFont = this.fonts[randomIndex];
  }

  getWeather(): void {
    if (!this.location) {
      this.weatherInfo = { location: 'Please enter a location.' };
      return;
    }

    const apiKey = '8d827f298c864ec793c01642242911'; // Replace with your API key securely
    const baseUrl = 'http://api.weatherapi.com/v1/current.json';
    const url = `${baseUrl}?key=${apiKey}&q=${this.location}&aqi=no`;

    this.http.get<WeatherResponse>(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          if (response && response.current && response.location) {
            const { name, region, country } = response.location;
            const { temp_f, condition, humidity, wind_mph } = response.current;
            this.weatherInfo = {
              location: `${name}, ${region}, ${country}`,
              temp_f,
              condition: condition.text,
              humidity,
              wind_mph
            };
          } else {
            this.weatherInfo = { location: 'No weather data available for this location.' };
          }
        },
        (error) => {
          this.weatherInfo = { location: 'Error fetching weather data. Please try again later.' };
          console.error('Weather API error:', error);
        }
      );
  }
}


