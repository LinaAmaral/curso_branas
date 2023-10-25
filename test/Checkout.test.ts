import axios from "axios";
import Checkout from "../src/Checkout";
import GetOrder from "../src/GetOrder";
import crypto from "crypto"
import ProductRepositoryDatabase from "../src/ProductRepositoryDataBase";
import CouponRepositoryDatabase from "../src/CouponRepositoryDatabase";
import Product from "../src/Product";
import sinon from "sinon";
import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import RepositoryFactory from "../src/RepositoryFactory";

axios.defaults.validateStatus = function () {
    return true;
}

let checkout: Checkout;
let getOrder: GetOrder;
let repositoryFactory: RepositoryFactory;

beforeEach(() => {
    repositoryFactory = new DatabaseRepositoryFactory();
    checkout = new Checkout(repositoryFactory);
    getOrder = new GetOrder(repositoryFactory);
});

//eu trago os testes da main pra cá, agora vou testar só a regra de negócio (Checkout), então minha api não precisar estar rodando.
//Ajusto o expect 
//quando faço isso eu desacoplo do driver (main)
test("Não deve criar pedido com cpf inválido", async function () {
    const input = {
        cpf: "406.302.170-27",
        items: []
    };
    expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Deve fazer um pedido com 3 itens e obter o pedido salvo", async function () {
    const idOrder = crypto.randomUUID()
    const input = {
        idOrder: idOrder,
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ],
        email: "john.doe@gmail.com"
    };
    await checkout.execute(input);
    const output = await getOrder.execute(idOrder);
    expect(output.total).toBe(6090);
});

//dessa forma eu passo essa data para o código e monto o code com ela, assim mesmo teste não não quebrar ao virar o ano
// é muito agressiva essa abordagem, melhor passar como parametro
// const clock: Clock = {
//     getDate(): Date {
//         return new Date("2023-01-01T10:00:00")
//     }
// }
// checkout = new Checkout(productRepository, cuponRepository, orderRepository, clock)
test("Deve fazer um pedido com 3 itens e gerar o código do pedido", async function () {
    const orderRepository = repositoryFactory.createOrderRepository();
    await orderRepository.clear()
    await checkout.execute({
        idOrder: crypto.randomUUID(),
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ],
        email: "john.doe@gmail.com",
        date: new Date("2023-01-01T10:00:00")
    });
    const idOrder = crypto.randomUUID()
    const input = {
        idOrder: idOrder,
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ],
        email: "john.doe@gmail.com",
        date: new Date("2023-01-01T10:00:00")
    };
    await checkout.execute(input);
    const output = await getOrder.execute(idOrder);
    expect(output.code).toBe("202300000002");
});

test("Deve fazer um pedido com 3 itens com cupom de desconto válido", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ],
        coupon: "VALE20"
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(4872);
});

test("Deve fazer um pedido com 3 itens com cupom de desconto expirado", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ],
        coupon: "VALE10"
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(6090);
});

test("Deve fazer um pedido com 3 itens com cupom de desconto que não existe", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ],
        coupon: "VALE0"
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(6090);
});

test("Não deve fazer um pedido com quantidade negativa de item", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: -1 }
        ]
    };
    expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid quantity"));
});

test("Não deve fazer um pedido com item duplicado", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 1, quantity: 1 }
        ]
    };
    expect(() => checkout.execute(input)).rejects.toThrow(new Error("Duplicated item"));
});

test("Deve fazer um pedido com 3 itens calculando o frete", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 }
        ],
        from: "88015600",
        to: "22030060"
    };
    const output = await checkout.execute(input);
    expect(output.freight).toBe(250);
    expect(output.total).toBe(6250);
});

test("Deve fazer um pedido com 3 itens calculando o frete com preço mínimo", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ],
        from: "88015600",
        to: "22030060"
    };
    const output = await checkout.execute(input);
    expect(output.freight).toBe(280);
    expect(output.total).toBe(6370);
});



//exemplo e teste com test patters -aula 3 último vídeo

test("Deve fazer um pedido com 1 item - ex. stub", async function () {
    const productRepositoryStub = sinon.stub(ProductRepositoryDatabase.prototype, "get").resolves(new Product(1, "A", 100, 1, 1, 1, 1));
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 }
        ]
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(100);
    productRepositoryStub.restore(); //volto ao estado original para não afetar outros testes
});

test("Deve verificar se o email foi enviado usando um mock", async function () {
    const productRepositoryMock = sinon.mock(ProductRepositoryDatabase.prototype);
    productRepositoryMock.expects("get").once().resolves(
        new Product(1, "A", 100, 1, 1, 1, 1)
    );
    const couponRepositorySpy = sinon.spy(CouponRepositoryDatabase.prototype, "get");
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 }
        ],
        coupon: "VALE20"
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(80);
    productRepositoryMock.verify();
    expect(couponRepositorySpy.calledOnce).toBe(true);
    expect(couponRepositorySpy.calledWith("VALE20")).toBe(true);
    couponRepositorySpy.restore();
    productRepositoryMock.restore();
});