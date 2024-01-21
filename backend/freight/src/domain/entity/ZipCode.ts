import Coord from "./Coord";

export default class ZipCode {
    coord: Coord

    constructor(readonly code: string, readonly lat: number, readonly long: number) {
        this.coord = new Coord(lat, long)
    }
}

//zipcode é uma entidade pq é unico, tem uma identidade, o cep é único.
//é um aggregate root