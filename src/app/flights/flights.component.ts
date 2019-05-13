import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator, MatTableDataSource, Sort, MatSort } from '@angular/material';
import { Flight } from './flight-data';
import { BackendApiService } from '../service/backend-api.service'
import { Status } from './status.interface';
import * as _ from 'underscore';
import { FlightStatistics, AirportStatistics } from './statistics.interface';
import { ChartType, ChartOptions } from 'chart.js';
import { Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<Flight>;
  displayedColumns: string[] = ["flightNumber", "airline", "date", "scheduledTime", "expectedTime", "status"];
  displayedStatisticColumns: string[] = ["unit", "value"];
  flights: Flight[] = [];
  flightStatistics: FlightStatistics;
  airportStatistics: AirportStatistics;
  statusList: Status[] = [];
  flightNumbers: String[];
  airports: String[];
  simpleStats: any[];
  selectedAirport: String;
  selectedFlight: String;
  selectedDate: String;
  dataFound: boolean;
  dates: String[];
  isDisplayLinkedFlights = this.flightStatistics && this.flightStatistics.linkedFlights && this.flightStatistics.linkedFlights.length > 0;
  statusChartColors: any[] = [
    {
      backgroundColor: ["#FF7360", "#6FC8CE", "#FAFFF2", "#FFFCC4", "#B9E8E0", '#d13537', '#b0o0b5', '#coffee', '#blue', "#fff"]
    }];
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  statusChartData: number[] = [];
  statusChartLabels: Label[] = [];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _apiService: BackendApiService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.getFlights();
    this.getAirports();
    this.getDates();
    this.dataSource = new MatTableDataSource(this.flights);
    
  }
  ngAfterViewInit() {
    this.attachPaginator();
    this.dataSource.sort = this.sort;
  }

  checkForChanges(): void {
    this._apiService.getAirportFlights(this.selectedAirport).subscribe(res => { this.flightNumbers = res });
  }
  attachPaginator() {
    if (this.flights.length === 0) {
      setTimeout(() => {
        this.ngAfterViewInit();
      }, 1000);
    } else {
      this.dataSource.paginator = this.paginator;
    }
  }

  reset() {
    this.getFlights();
    this.getAirports();
    this.getDates();
    this.dataFound = false;
    this.selectedAirport = null;
    this.selectedFlight = null;
    this.selectedDate = null;
  }
  getFlights(): void {
    this._apiService.getFlightNumbers()
      .subscribe(res => this.flightNumbers = res);
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
    if (this.flights.length > 0) this.flights = [];
    let date = this.selectedDate ? this.selectedDate : new Date().toISOString().slice(0, 10).replace(/-/g, '');
    if (this.selectedFlight || this.selectedAirport) {
      if (this.selectedFlight) {
        this._apiService.getFlightRecords(this.selectedFlight).subscribe(val => {
          this.parseFlightRecords(val);
        });
        this._apiService.getFlightStatus(this.selectedFlight).subscribe(val => {
          this.createDataForStatusChart(val);
        });
        this._apiService.getFlightStatistics(this.selectedFlight).subscribe(val => {
          this.flightStatistics = this.parseFlightStatistics(val);
        });
        this._apiService.getFlightStatisticsOnDay(this.selectedFlight, date).subscribe(val =>
          this.flightStatistics = this.parseFlightStatistics(val)
        );
        this.dataFound = true;
      }
      if (this.selectedAirport && !this.selectedFlight) {
        this._apiService.getAirportStatus(this.selectedAirport).subscribe(val => {
          this.createDataForStatusChart(val);
        });
        this._apiService.getAirportFlights(this.selectedAirport).subscribe(val => this.flightNumbers = val);
        this._apiService.getAirportStatistics(this.selectedAirport).subscribe(val =>
          this.airportStatistics = this.parseAirportStatistics(val)
        );
        this._apiService.getAirportStatisticsOnDate(this.selectedAirport, new Date().toISOString().slice(0, 10).replace(/-/g, '')).subscribe(val => this.airportStatistics = this.parseAirportStatistics(val));
        this.dataFound = true;
      }
    } else {
      this.dataFound = false;
    }
  }
  createDataForStatusChart(statusArr: String[]): void {
    this.statusChartData = [];
    this.statusChartLabels = [];
    let status_dictionary = _.countBy(statusArr);
    let arrayOfStatusQuantity: number[] = [];
    for (var key in status_dictionary) {
      if (status_dictionary.hasOwnProperty(key)) {
        this.statusChartLabels.push(key);
        arrayOfStatusQuantity.push(Number(status_dictionary[key]));
      }
    }
    this.statusChartData = arrayOfStatusQuantity;
  }
  parseFlightRecords(flightRecordArray: any[]): void {
    flightRecordArray.forEach(element => {
      let scheduledTime: string;
      if (element.scheduledTimeOfArrival.length > 0) {
        scheduledTime = element.scheduledTimeOfArrival
      } else scheduledTime = element.scheduledTimeOfDeparture;
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
    if (this.selectedDate) {
      this.flights = this.flights.filter((f) => f.date === this.selectedDate)
    }

    this.flights = this.flights.reverse();
    if (this.dataSource) {
      this.dataSource = new MatTableDataSource(this.flights);
      this.attachPaginator();
    }

  }

  parseFlightStatistics(stats: any): FlightStatistics {
    console.log(this.simpleStats);
    this.simpleStats = [
      { unit: "Average of ratio array for disruption-indicating statuses to all statuses per day (%) for selected flight", value: stats.disruptionAvg },
      { unit: "Standart deviation for ratio array containing ratios of disruption-indicating statuses to all statuses during days recorded (%) for selected flight", value: stats.disruptionStdDeviation }
    ];
    if (this.selectedDate && this.selectedDate.length > 0) {
      this.simpleStats.push({ unit: "Average of ratio for disruption-indicating statuses to all statuses per selected day (%) selected flight", value: stats.disruptionAvg });
      this.simpleStats.push({ unit: "Standart deviation for ratio array containing ratios of disruption-indicating statuses to all statuses during selected day(%) selected flight", value: stats.disruptionStdDeviation });
    }
    return {
      disruptionAvg: stats.disruptionAvg,
      disruptionStdDeviation: stats.disruptionStdDeviation,
      numberOfDisruptedFlights: stats.numberOfDisruptedFlightsOnRecords,
      numberOfFlights: stats.numberOfFlightsonRecord,
      numberOfDisruptedFlightsOnDate: stats.numberOfDisruptedFlightsOnDateOnRecord,
      numberOfFlightsOnDate: stats.numberOfFlightsOnDateOnRecord,
      linkedFlights: stats.linkedFlights
    } as FlightStatistics;
  }
  parseAirportStatistics(stats: any): AirportStatistics {
    console.log(this.simpleStats);
    this.simpleStats = [
      { unit: "Average of ratio for disruption-indicating statuses to all statuses per day (%) for selected airport", value: stats.airportMean * 100 },
      { unit: "Standart deviation for ratio array of disruption-indicating statuses to all statuses during days recorded (%) for selected airport", value: stats.airportStandartDeviation * 100 }
    ];
    if (this.selectedDate && this.selectedDate.length > 0) {
      this.simpleStats.push({ unit: "Average of records for disruption-indicating statuses to all statuses per selected day (%) for selected airport", value: stats.airportByDate * 100 });
    }
    console.log('after',this.simpleStats);
    return {
      disruptionAvg: stats.airportMean * 100,
      disruptionStdDeviation: stats.airportStandartDeviation * 100,
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

