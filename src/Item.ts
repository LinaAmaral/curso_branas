export default class Item {
    constructor(
        readonly idProduct: number,
        readonly price: number,
        readonly quantity: number
    ) { }

    getTotal() {
        return this.price * this.quantity
    }
}