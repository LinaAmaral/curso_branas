import Produto from "./Produto";

export default class Pedido {
    private itensPedido: { produto: Produto, quantidade: number }[];
    private total: number;

    constructor() {
        this.itensPedido = [];
        this.total = 0;
    }

    criaPedido(pedido: { produto: Produto, quantidade: number }[]) {
        this.itensPedido = pedido
    }

    calculaTotal() {
        for (const item of this.itensPedido) {
            this.total += item.produto.preco * item.quantidade;
        }
    }

    getTotal() {
        return this.total;
    }
}