import { FlightPair } from './stat-flight-pair.interface';

export interface FlightStatistics {
    disruptionAvg: number,
    disruptionStdDeviation: number,
    numberOfDisruptedFlights: number,
    numberOfFlights: number,
    numberOfDisruptedFlightsOnDate: number,
    numberOfFlightsOnDate: number,
    linkedFlights: FlightPair[]
}

export interface AirportStatistics {
    disruptionAvg: number,
    disruptionStdDeviation: number,
    numberOfDisruptedFlights: number,
    numberOfFlights: number,
    grouped_statistics: {
        cor: FlightPair[],
        cor_i: FlightPair[],
        cov: FlightPair[],
        cov_i: FlightPair[]
    }
}