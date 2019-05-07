import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { Flight } from './flight-data';
import { BackendApiService } from '../service/backend-api.service'
import { Status } from './status.interface';
import { _ } from 'underscore';

@Component({
  selector: 'flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent implements OnInit {

  displayedColumns: string[] = ["flightNumber", "airline", "date", "scheduledTime", "expectedTime", "status"];
  flights: Flight[] = [];
  statusList: Status[] = [];
  flightNumbers: String[];
  airports: String[];
  selectedUnit: String;
  dataFound: boolean;

  constructor(private _apiService: BackendApiService) { }

  ngOnInit() {
    this.getFlights();
    this.getAirports();
  }

  getFlights(): void {
    this._apiService.getFlightNumbers()
      .subscribe(res => this.flightNumbers = res);
  }

  getAirports(): void {
    this._apiService.getAirports()
      .subscribe(res => this.airports = res);
  }

  retrieveDataBasedOnSelectedItem(): void {
    if (this.selectedUnit) {
      if (this.flightNumbers.indexOf(this.selectedUnit) > -1) {
        this._apiService.getFlightRecords(this.selectedUnit).subscribe(val => {
          this.parseFlightRecords(val);
          console.log(val)
        });
        this._apiService.getFlightStatus(this.selectedUnit).subscribe(val => {
          this.groupStatusAndAddToArray(val);
        });
        this._apiService.getFlightStatistics(this.selectedUnit).subscribe(val => console.log(val));
        this._apiService.getFlightStatisticsOnDay(this.selectedUnit, new Date().toISOString().slice(0, 10).replace(/-/g, '')).subscribe(val => console.log(val));
        this.dataFound = true;
      }
      if (this.airports.indexOf(this.selectedUnit) > -1) {
        this._apiService.getAirportStatus(this.selectedUnit).subscribe(val => {
          this.groupStatusAndAddToArray(val);
        });
        this._apiService.getAirportFlights(this.selectedUnit).subscribe(val => console.log(val));
        this._apiService.getAirportStatistics(this.selectedUnit).subscribe(val => console.log(val));
        this._apiService.getAirportStatisticsOnDate(this.selectedUnit, new Date().toISOString().slice(0, 10).replace(/-/g, '')).subscribe(val => console.log(val));
        this.dataFound = true;
      }
    } else {
      this.dataFound = false;
    }
  }

  groupStatusAndAddToArray(statusArr: String[]): void {

    statusArr = _.countBy(statusArr);
    console.log(statusArr);
    for (var key in statusArr) {
      if (statusArr.hasOwnProperty(key)) {
        let status = { name: key, count: Number(statusArr[key]) };
        this.statusList.push(status);
      }
    }
  }
  parseFlightRecords(flightRecordArray: any[]): void {
    flightRecordArray.forEach(element => {
      let scheduledTime = element.scheduledTimeOfArrival && element.scheduledTimeOfArrival.length > 0 ? element.scheduledTimeOfArrival : element.scheduledTimeOfDeparture;
      let flight = {
        _id: element._id,
        flightNumber: element.flghtNumber,
        date: element.date,
        airport: element.airport,
        expectedTime: element.expectedTime,
        scheduleTime: scheduledTime,
        status: element.status
      };
      this.flights.push(flight);
    });
    console.log(this.flights);
  }
}

