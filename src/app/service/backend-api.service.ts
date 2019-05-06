import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';



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
  getFlightNumbers() {
    return this.http.get(`${this.uri}/flight`);
  }
  getAirports() {
    return this.http.get(`${this.uri}/airport`);
  }
  getFlightStatus(flightNumber: String){
    return this.http.get(`${this.uri}/flight/` + flightNumber + '/status');
  }
  getFlightRecords(flightNumber: String){
    return this.http.get(`${this.uri}/flight/` + flightNumber + '/records');
  }
  getFlightStatistics(flightNumber: String){
    return this.http.get(`${this.uri}/flight/` + flightNumber + '/stats');
  }
  getFlightStatisticsOnDay(flightNumber: String, date: String){
    return this.http.get(`${this.uri}/flight/` + flightNumber + '/' + date + '/stats');
  }
  getAirportFlights(iata: String) {
    return this.http.get(`${this.uri}/airport/` + iata + '/flight');
  }
  getAirportStatus(iata: String) {
    return this.http.get(`${this.uri}/airport/` + iata + '/status');
  }
  getAirportStatistics(iata: String){
    return this.http.get(`${this.uri}/airport/` + iata + '/stats');
  }
  getAirportStatisticsOnDate(iata: String, date: String){
    return this.http.get(`${this.uri}/airport/` + iata + '/' + date +  '/stats');
  }
}
