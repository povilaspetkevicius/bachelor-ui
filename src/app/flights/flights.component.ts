import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, Sort } from '@angular/material';
import { Flight } from './flight-data';
import { BackendApiService } from '../service/backend-api.service'
import { Status } from './status.interface';
import * as _ from 'underscore';
import { FlightStatistics, AirportStatistics } from './statistics.interface';

@Component({
  selector: 'flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Flight>;
  displayedColumns: string[] = ["flightNumber", "airline", "date", "scheduledTime", "expectedTime", "status"];
  flights: Flight[] = [];
  flightStatistics: FlightStatistics;
  airportStatistics: AirportStatistics;
  statusList: Status[] = [];
  flightNumbers: String[];
  airports: String[];
  selectedUnit: String;
  selectedDate: String;
  dataFound: boolean;
  dates: String[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _apiService: BackendApiService) {

  }

  ngOnInit() {
    this.getFlights();
    this.getAirports();
    this.getDates();
    this.dataSource = new MatTableDataSource(this.flights);
  }
  ngAfterViewInit() {
    if (this.flights.length === 0) {
      setTimeout(() => {
        this.ngAfterViewInit();
      }, 1000);
    } else {
      this.dataSource.paginator = this.paginator;
    }
  }

  reset(){
    this.getFlights();
    this.getAirports();
    this.getDates();
    this.dataFound = false;
  }
  getFlights(): void {
    this._apiService.getFlightNumbers()
      .subscribe(res => this.flightNumbers = res);

    console.log('asdasdasdasd', this.flights);
  }

  getAirports(): void {
    this._apiService.getAirports()
      .subscribe(res => this.airports = res);
  }

  getDates(): void {
    this._apiService.getDates()
      .subscribe(res => this.dates = res);
  }

  retrieveDataBasedOnSelectedItem(): void {
    this.dataFound = false;
    let date = this.selectedDate ? this.selectedDate : new Date().toISOString().slice(0, 10).replace(/-/g, '');
    if (this.selectedUnit) {
      if (this.flightNumbers.indexOf(this.selectedUnit) > -1) {
        this._apiService.getFlightRecords(this.selectedUnit).subscribe(val => {
          this.parseFlightRecords(val);
        });
        this._apiService.getFlightStatus(this.selectedUnit).subscribe(val => {
          this.groupStatusAndAddToArray(val);
        });
        this._apiService.getFlightStatistics(this.selectedUnit).subscribe(val => this.flightStatistics = this.parseFlightStatistics(val));
        this._apiService.getFlightStatisticsOnDay(this.selectedUnit, date).subscribe(val => this.flightStatistics = this.parseFlightStatistics(val));
        this.dataFound = true;
      }
      if (this.airports.indexOf(this.selectedUnit) > -1) {
        this._apiService.getAirportStatus(this.selectedUnit).subscribe(val => {
          this.groupStatusAndAddToArray(val);
        });
        this._apiService.getAirportFlights(this.selectedUnit).subscribe(val => this.flightNumbers = val);
        this._apiService.getAirportStatistics(this.selectedUnit).subscribe(val => this.airportStatistics = this.parseAirportStatistics(val));
        this._apiService.getAirportStatisticsOnDate(this.selectedUnit, new Date().toISOString().slice(0, 10).replace(/-/g, '')).subscribe(val => this.airportStatistics = this.parseAirportStatistics(val));
        this.dataFound = true;
      }
    } else {
      this.dataFound = false;
    }
  }

  groupStatusAndAddToArray(statusArr: String[]): void {

    statusArr = _.countBy(statusArr);
    for (var key in statusArr) {
      if (statusArr.hasOwnProperty(key)) {
        let status = { name: key, count: Number(statusArr[key]) };
        this.statusList.push(status);
      }
    }
  }
  parseFlightRecords(flightRecordArray: any[]): void {
    flightRecordArray.forEach(element => {
      let scheduledTime: string;
      console.log('aasdasdasdada', element.scheduledTimeOfArrival.length > 0);
      if (element.scheduledTimeOfArrival.length > 0) {
        scheduledTime = element.scheduledTimeOfArrival
      } else element.scheduledTimeOfDeparture;
      let flight = {
        _id: element._id,
        flightNumber: element.flightNumber,
        date: element.date,
        airport: element.airport,
        expectedTime: element.expectedTime,
        scheduleTime: scheduledTime,
        status: element.status
      };
      this.flights.push(flight);
    });
    this.flights = this.flights.reverse();
    this.dataSource = new MatTableDataSource(this.flights);
  }
  parseFlightStatistics(stats: any): FlightStatistics {
    return {
      disruptionAvg: stats.disruptionAvg,
      disruptionStdDeviation: stats.disruptionStdDeviation,
      numberOfDisruptedFlights: stats.numberOfDisruptedFlightsOnRecords,
      numberOfFlights: stats.numberOfFlightsonRecord,
      linkedFlights: stats.linkedFlights
    } as FlightStatistics;
  }
  parseAirportStatistics(stats: any): AirportStatistics {
    return {
      disruptionAvg: stats.airportMean,
      disruptionStdDeviation: stats.airportStandartDeviation,
      numberOfDisruptedFlights: stats.numberOfDisruptedFlightsOnRecords,
      numberOfFlights: stats.numberOfFlightsonRecord,
      grouped_statistics: {
        cor: stats.linkedFlights.fl_cor,
        cor_i: stats.linkedFlights.fl_cor_i,
        cov: stats.linkedFlights.fl_cov,
        cov_i: stats.linkedFlights.fl_cov_i,
      }
    } as AirportStatistics;
  }
}

