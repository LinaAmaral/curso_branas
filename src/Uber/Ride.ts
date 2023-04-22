import NormalFareCalculator from "./NormalFareCalculator";
import OvernightFareCalculator from "./OvernightFareCalculator";
import OvernightSundayFareCalculator from "./OvernightSundayFareCalculator";
import Segment from "./Segment";
import SundayFareCalculator from "./SundayFareCalculator";

export default class Ride {
    private segments: Segment[];
    MIN_FARE = 10;
    NORMAL_FARE = 2.1;
    SUNDAY_FARE = 2.9;
    OVERNIGHT_FARE = 3.9;
    OVERNIGHT_SUNDAY_FARE = 5;

    constructor() {
        this.segments = [];
    }

    addSegment(distance: number, date: Date) {
        this.segments.push(new Segment(distance, date));
    }

    calculateFare() {
        let fare = 0;
        for (const segment of this.segments) {
            if (segment.isOvernight() && !segment.isSunday()) {
                const fareCalculator = new OvernightFareCalculator()
                fare += fareCalculator.calculate(segment);
            }
            if (segment.isOvernight() && segment.isSunday()) {
                const fareCalculator = new OvernightSundayFareCalculator()
                fare += fareCalculator.calculate(segment);
            }
            if (!segment.isOvernight() && segment.isSunday()) {
                const fareCalculator = new SundayFareCalculator()
                fare += fareCalculator.calculate(segment);
            }
            if (!segment.isOvernight() && !segment.isSunday()) {
                const fareCalculator = new NormalFareCalculator()
                fare += fareCalculator.calculate(segment);
            }
        }
        return (fare < this.MIN_FARE) ? this.MIN_FARE : fare;
    }
}