import Pedido from "../src/Pedido";
import Produto from "../src/Produto";

test("Deve criar um pedido com 3 produtos (com descrição, preço e quantidade) e calcular o valor total", function () {
    const input = [{
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
    const pedido = new Pedido();
    pedido.criaPedido(input);
    pedido.calculaTotal();
    expect(pedido.getTotal()).toBe(40);
});