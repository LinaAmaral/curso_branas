//é uma entidade. é uma combinação de dados, mas tb de comportamento

export default class Product {
    constructor(
        readonly idProduct: number,
        readonly description: string,
        readonly price: number,
        readonly width: number,
        readonly height: number,
        readonly length: number,
        readonly weight: number
    ) { }


    getVolume() {
        const volume = this.width / 100 * this.height / 100 * this.length / 100;
        return volume
    }

    getDensity() {
        const density = this.weight / this.getVolume();
        return density
    }
}