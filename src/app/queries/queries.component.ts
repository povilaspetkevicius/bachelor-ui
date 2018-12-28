import { Component, OnInit } from '@angular/core';
import { Queries } from './queries-list';

const QUERY_MOCK: Queries[] = [
  {id: "ascsfgds1", flights: "RY1234, WZ3241, SK1234",dateFrom: "20160812", dateTo:"20170312", stateOfFlight:"delayed", user: "das123"},
  {id: "52csfdsa5", flights: "SK1234",dateFrom: "20160809", dateTo:"20101012", stateOfFlight:"ok", user: "p998ppc"},
  {id: "ddggsf2s1", flights: "AA1234, AA8525",dateFrom: "20101013", dateTo:"20160812", stateOfFlight:"cancelled", user: "das123"},
  {id: "e8524gds1", flights: "AA*",dateFrom: "20001012", dateTo:"20100809", stateOfFlight:"unknown", user: "das123"},
  {id: "52csfdsa5", flights: "SK1234",dateFrom: "20160809", dateTo:"20101012", stateOfFlight:"canceled", user: "das123"},
];

@Component({
  selector: 'queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss']
})

export class QueriesComponent implements OnInit {
  displayedColumns: string[] = ["id", "flights", "dateFrom", "dateTo", "stateOfFlight", "user"];
  queryArray: Queries[] = QUERY_MOCK;
  constructor() { }
  ngOnInit() {
  }

}
