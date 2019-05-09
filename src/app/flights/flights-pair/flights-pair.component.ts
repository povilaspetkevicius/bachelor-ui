import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { FlightPair } from '../stat-flight-pair.interface';

@Component({
  selector: 'flights-pair',
  templateUrl: './flights-pair.component.html',
  styleUrls: ['./flights-pair.component.scss']
})
export class FlightsPairComponent implements OnInit, OnChanges {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [];
  @Input() flightPairs: FlightPair[];
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('hello from ngOnChanges',this.flightPairs);
    this.remapData();
  }

  remapData(): void{
    this.cleanDatasets();
    let labels: String[] = [];
    let correlationValues: number[] = [];
    let covarianceValues: number[] = [];
    this.flightPairs.forEach((fp) => {
      labels.push(fp.flightNumber1 + " " + fp.flightNumber2);
      correlationValues.push(fp.correlationOfFlightDisruptions);
      covarianceValues.push(fp.covarianceOfFlightDisruptions);
    })
    this.barChartLabels = labels as Label[];
    this.barChartData = [
      { data: correlationValues, label: 'Correlation' },
      { data: covarianceValues, label: 'Covariance' }
    ]
    
  }

  cleanDatasets(){
    this.barChartData = [];
    this.barChartLabels = []
  }

}
