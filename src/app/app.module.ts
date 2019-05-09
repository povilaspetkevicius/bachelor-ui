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
import {MatSelectModule} from '@angular/material/select';
import {BackendApiService} from './service/backend-api.service';
import {MatButtonModule} from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { ChartsModule } from 'ng2-charts';
import { FlightsPairComponent } from './flights/flights-pair/flights-pair.component';
import {MatGridListModule} from '@angular/material/grid-list';
@NgModule({
  declarations: [
    AppComponent,
    FlightsComponent,
    LandingPageComponent,
    FlightsPairComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatTableModule,
    MatDividerModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    ChartsModule,
    MatGridListModule
  ],
  providers: [BackendApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
