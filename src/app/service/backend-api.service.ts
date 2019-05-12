import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Flight } from '../flights/flight-data';
import { FlightInfo } from '../flights/flights-info/flight-info.interface';



@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  uri = 'http://localhost:3000/api';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) {
  }
  getFlightNumbers(): Observable<String[]> {
    return this.http.get<String[]>(`${this.uri}/flight`);
  }
  getAirports() {
    return this.http.get<String[]>(`${this.uri}/airport`);
  }
  getDates() {
    return this.http.get<String[]>(`${this.uri}/util/date`);
  }
  getFlightStatus(flightNumber: String): Observable<any> {
    return this.http.get(`${this.uri}/flight/` + flightNumber + '/status');
  }
  getFlightRecords(flightNumber: String): Observable<any>{
    return this.http.get(`${this.uri}/flight/` + flightNumber + '/records');
  }
  getFlightStatistics(flightNumber: String){
    return this.http.get(`${this.uri}/flight/` + flightNumber + '/stats');
  }
  getFlightStatisticsOnDay(flightNumber: String, date: String){
    return this.http.get(`${this.uri}/flight/` + flightNumber + '/' + date + '/stats');
  }
  getFlightsInformation(){
    return this.http.get<FlightInfo[]>(`${this.uri}` + '/flight/info');
  }
  getAirportFlights(iata: String) {
    return this.http.get<String[]>(`${this.uri}/airport/` + iata + '/flight');
  }
  getAirportStatus(iata: String): Observable<String[]> {
    return this.http.get<String[]>(`${this.uri}/airport/` + iata + '/status');
  }
  getAirportStatistics(iata: String){
    return this.http.get(`${this.uri}/airport/` + iata + '/stats');
  }
  getAirportStatisticsOnDate(iata: String, date: String){
    return this.http.get(`${this.uri}/airport/` + iata + '/' + date +  '/stats');
  }
}
