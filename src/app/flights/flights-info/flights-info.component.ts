import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FlightInfo } from './flight-info.interface';
import { BackendApiService } from 'src/app/service/backend-api.service';

@Component({
  selector: 'flights-info',
  templateUrl: './flights-info.component.html',
  styleUrls: ['./flights-info.component.scss']
})
export class FlightsInfoComponent implements OnInit, OnChanges {


  @Input() flightNumber: String;
  flightsInformation: FlightInfo[];
  selectedFlightInfo: FlightInfo;
  spinner: boolean = false;

  constructor(private _apiService: BackendApiService) { }

  ngOnInit() {
    this.getFlightsData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getFlightsData();
  }
  getFlightsData(): void {
    if (!this.flightsInformation) {
      this._apiService.getFlightsInformation()
      .subscribe(res => this.flightsInformation = res);
      try {
        this.selectedFlightInfo = this.flightsInformation.find((f) => {
          return f.flightNumber === this.flightNumber;
        });
      } catch(err) {
        setTimeout(() => {
          this.selectedFlightInfo = this.flightsInformation.find((f) => {
            return f.flightNumber === this.flightNumber;
          });
        }, 1000);
      }
    } else {
      this.selectedFlightInfo = this.flightsInformation.find((f) => {
        return f.flightNumber === this.flightNumber;
      })
    }   
  }
}
