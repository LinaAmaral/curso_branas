import FareCalculatorInterface from "./FareCalculatorInterface";
import Segment from "./Segment";

export default class SundayFareCalculator implements FareCalculatorInterface {
    FARE = 2.9;
    calculate(segment: Segment): number {
        return segment.distance * this.FARE;
    }
}