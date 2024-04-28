
//Aqui é o exemplo do que é ideal fazer, vou apenas uma vez ao banco, faço a query e volto o que preciso
//Nesse caso não trabalho com as entidades de domínio

import OrderDAO from "../dao/OrderDao";


export default class GetOrders {

    constructor(readonly orderDAO: OrderDAO) {
    }

    async execute(): Promise<Output[]> {
        const ordersData = await this.orderDAO.list();
        return ordersData;
    }
}

type Output = {
    idOrder: string,
    items: { description: string, price: number, quantity: number }[],
    date: Date
};