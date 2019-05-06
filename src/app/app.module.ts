import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import { FlightsComponent } from './flights/flights.component';
import {MatTableModule} from '@angular/material/table';
import { LandingPageComponent } from './landing-page/landing-page.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {BackendApiService} from './service/backend-api.service';
@NgModule({
  declarations: [
    AppComponent,
    FlightsComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatTableModule,
    MatDividerModule,
    MatListModule,
  ],
  providers: [BackendApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
