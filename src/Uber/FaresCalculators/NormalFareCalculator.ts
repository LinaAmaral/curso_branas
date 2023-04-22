import FareCalculatorInterface from "./FareCalculatorInterface";
import Segment from "../Segment";

export default class NormalFareCalculator implements FareCalculatorInterface {
    FARE = 2.1;
    calculate(segment: Segment): number {
        return segment.distance * this.FARE;
    }
}