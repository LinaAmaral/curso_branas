//value object
export default class Coord {
    constructor(readonly lat: number, readonly long: number) { }
}

//a mudança desses valores significa uma nova instancia, por isso é um vo