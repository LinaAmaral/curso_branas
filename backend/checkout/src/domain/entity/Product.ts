//é uma entidade. é uma combinação de dados, mas tb de comportamento

export default class Product {

    constructor(
        readonly idProduct: number,
        readonly description: string,
        readonly price: number,
        readonly width: number,
        readonly height: number,
        readonly length: number,
        readonly weight: number,
        readonly density = 0,
        readonly volume = 0


    ) {
    }

}