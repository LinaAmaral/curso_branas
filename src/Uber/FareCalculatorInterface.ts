import Segment from "./Segment";

//é uma interface, um contrato
//esse é ponto de extensão que estou buscando
//Multiplas implementações para um único contrato. (Strategy)
export default interface FareCalculatorInterface {
    calculate(segment: Segment): number;
}