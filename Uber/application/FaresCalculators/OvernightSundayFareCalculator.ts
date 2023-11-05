import FareCalculatorInterface from "./FareCalculatorInterface";
import Segment from "../Segment";

export default class OvernightSundayFareCalculator implements FareCalculatorInterface {
    FARE = 5;
    calculate(segment: Segment): number {
        return segment.distance * this.FARE;
    }
}