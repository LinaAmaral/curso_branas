import FareCalculatorFactory from "./FareCalculatorFactory";
import Segment from "./Segment";


export default class Ride {
    private segments: Segment[];
    MIN_FARE = 10;
    constructor() {
        this.segments = [];
    }

    addSegment(distance: number, date: Date) {
        this.segments.push(new Segment(distance, date));
    }

    calculateFare() {
        let fare = 0;
        for (const segment of this.segments) {
            const fareCalculator = FareCalculatorFactory.create(segment)
            fare += fareCalculator.calculate(segment);
        }
        return (fare < this.MIN_FARE) ? this.MIN_FARE : fare;
    }
}

//Agora o meu Ride não sabe mais quais são as possibilidades de cálculo de tarifa. Ela delegou essa responsabilidade para uma fabrica,