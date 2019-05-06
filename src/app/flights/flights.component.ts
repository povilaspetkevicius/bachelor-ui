import { Component, OnInit } from '@angular/core';
import { Flight } from './flight-data';
import { BackendApiService} from '../service/backend-api.service'
const FLIGHT_DATA: Flight[] = [
  {airline: "SAS", flightNumber: "SK174", date: 20151027, passengers: 10},
  {airline: "SAS", flightNumber: "SK1740", date: 20181227, passengers: 101},
  {airline: "Wizzair", flightNumber: "WZ8174", date: 20181227, passengers: 214},
];

@Component({
  selector: 'flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss'],
  providers: [BackendApiService]
})
export class FlightsComponent implements OnInit {

  displayedColumns: string[] = ["airline", "flightNumber", "date", "passengers"];
  flightArray: Flight[] = FLIGHT_DATA;
  flights: any;
  constructor(private apiService: BackendApiService) { }

  ngOnInit() {
    this.flights = this.apiService.getFlightNumbers().subscribe(val => console.log(val));
    
  }

}

