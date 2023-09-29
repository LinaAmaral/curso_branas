import Cpf from "./Cpf";
import Item from "./Item";
import Product from "./Product";

export default class Order {
    cpf: Cpf;
    items: Item[];
    constructor(readonly idOrder: string, cpf: string) {
        this.cpf = new Cpf(cpf);
        this.items = [];
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
        this.items.push(new Item(product.idProduct, product.price, quantity))
    }
}

//entidades não carrega só dados, senão ela é anemica
//*** muitas vezes a gente usa uma linguagem orientado a objeto, mas não usa um desing orientado a objeto