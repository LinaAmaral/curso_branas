import Cpf from "./Cpf";
import Item from "./Item";
import Product from "./Product";

export default class Order {
    cpf: Cpf;
    items: Item[];
    code: string;
    constructor(readonly idOrder: string, cpf: string, date: Date = new Date(), sequence: number = 1) {
        this.cpf = new Cpf(cpf);
        this.items = [];
        this.code = `${date.getFullYear()}${new String(sequence).padStart(8, "0")}`
    }

    getTotal() {
        let total = 0;
        for (const item of this.items) {
            //total += item.price * item.quantity ***
            total += item.getTotal();
        }
        return total;
    }

    addItem(product: Product, quantity: number) {
        if (this.items.some(item => item.idProduct === product.idProduct)) throw new Error("Duplicated item")
        this.items.push(new Item(product.idProduct, product.price, quantity))
    }
}

//entidades não carrega só dados, senão ela é anemica
//*** muitas vezes a gente usa uma linguagem orientado a objeto, mas não usa um desing orientado a objeto