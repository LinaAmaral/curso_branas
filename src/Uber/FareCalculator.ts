import Segment from "./Segment";

//é uma interface, um contrato
//esse é ponto de extensão que estou buscando
export default interface FareCalculator {
    calculate(segment: Segment): number;
}