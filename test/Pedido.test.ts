import { Cupons } from "../src/Desconto";
import Pedido from "../src/Pedido";
import Produto from "../src/Produto";

const ITENS_DO_PEDIDO = [{
    produto: new Produto("arroz", 10),
    quantidade: 1
},
{
    produto: new Produto("feijao", 5),
    quantidade: 2
},
{
    produto: new Produto("farinha", 20),
    quantidade: 1
},
]

const CPF_VALIDO = "09397879626";
const CPF_INVALIDO = "09397879625";

test("Deve criar um pedido com 3 produtos (com descrição, preço e quantidade) e calcular o valor total", function () {
    const pedido = new Pedido(CPF_VALIDO);
    pedido.adicionarProdutos(ITENS_DO_PEDIDO);
    pedido.calcularTotal();
    expect(pedido.getTotal()).toBe(40);
});
test("Deve criar um pedido com 3 produtos, associar um cupom de desconto e calcular o total (percentual sobre o total do pedido)", function () {
    const pedido = new Pedido(CPF_VALIDO);
    pedido.adicionarProdutos(ITENS_DO_PEDIDO);
    pedido.aplicarDesconto(Cupons.BlackFriday);
    pedido.calcularTotal();
    expect(pedido.getTotal()).toBe(36);
});

test("Não deve criar um pedido com cpf inválido (lançar algum tipo de erro)", function () {

    expect(() => new Pedido(CPF_INVALIDO)).toThrow(new Error("Cpf invalido"));


});