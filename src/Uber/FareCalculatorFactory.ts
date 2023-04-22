//uma fábrica simples

import FareCalculatorInterface from "./FareCalculatorInterface";
import NormalFareCalculator from "./NormalFareCalculator";
import OvernightFareCalculator from "./OvernightFareCalculator";
import OvernightSundayFareCalculator from "./OvernightSundayFareCalculator";
import Segment from "./Segment";
import SundayFareCalculator from "./SundayFareCalculator";

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