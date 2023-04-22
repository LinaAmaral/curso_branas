import FareCalculatorInterface from "../FareCalculatorInterface";
import Segment from "../Segment";

export default class OvernightFareCalculator implements FareCalculatorInterface {
    FARE = 3.9;
    calculate(segment: Segment): number {
        return segment.distance * this.FARE;
    }
}