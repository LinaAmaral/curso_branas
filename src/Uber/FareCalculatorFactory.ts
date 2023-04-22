//uma fábrica simples

import FareCalculatorInterface from "./FareCalculatorInterface";
import NormalFareCalculator from "./FaresCalculators/NormalFareCalculator";
import OvernightFareCalculator from "./FaresCalculators/OvernightFareCalculator";
import OvernightSundayFareCalculator from "./FaresCalculators/OvernightSundayFareCalculator";
import SundayFareCalculator from "./FaresCalculators/SundayFareCalculator";
import Segment from "./Segment";

//ela tem o papel de criar instancias. Só retorno a classe
//Simple Factory: Criar instancias com base em algum critério
export default class FareCalculatorFactory {
    static create(segment: Segment): FareCalculatorInterface {
        if (segment.isOvernight() && !segment.isSunday()) return new OvernightFareCalculator()
        if (segment.isOvernight() && segment.isSunday()) return new OvernightSundayFareCalculator()
        if (!segment.isOvernight() && segment.isSunday()) return new SundayFareCalculator()
        if (!segment.isOvernight() && !segment.isSunday()) return new NormalFareCalculator()
        throw new Error("Invalid segment");
    }
}