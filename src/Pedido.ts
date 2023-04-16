import Desconto, { Cupons } from "./Desconto";
import Produto from "./Produto";
import ValidaCpf from "./ValidaCpf";

export default class Pedido {
    private itensPedido: { produto: Produto, quantidade: number }[];
    private total: number;
    private desconto: Desconto;

    constructor(cpf: string) {
        new ValidaCpf(cpf)
        this.itensPedido = [];
        this.total = 0;
        this.desconto = new Desconto();
    }

    adicionarProdutos(pedido: { produto: Produto, quantidade: number }[]) {
        this.itensPedido = pedido
    }

    aplicarDesconto(cupom: Cupons) {
        this.calcularTotal()
        this.desconto.calcularDesconto(cupom, this.getTotal());
        this.total = - this.desconto.getValorDoDesconto();
    }

    calcularTotal() {
        for (const item of this.itensPedido) {
            this.total += item.produto.preco * item.quantidade;
        }
    }

    getTotal() {
        return this.total;
    }
}