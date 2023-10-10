import axios from "axios";
import Checkout from "../src/Checkout";
import ProductRepository from "../src/ProductRepository";
import CouponRepository from "../src/CouponRepository";
import GetOrder from "../src/GetOrder";
import OrderRepositoryDatabase from "../src/OrderRepositoryDatabase";
import crypto from "crypto"
import Clock from "../src/Clock";
import ProductRepositoryDatabase from "../src/ProductRepositoryDataBase";
import CouponRepositoryDatabase from "../src/CouponRepositoryDatabase";
import Product from "../src/Product";
import sinon from "sinon";
import EmailGatewayConsole from "../src/EmailGatewayConsole";
import Coupon from "../src/Coupon";

//isso é teste de integração porque me comunico com outra camada (banco), mesmo que "mock"

axios.defaults.validateStatus = function () {
    return true;
}

let checkout: Checkout;
let getOrder: GetOrder;
let orderRepository: OrderRepositoryDatabase;
let productRepository: ProductRepository;
let couponRepository: CouponRepository;


beforeEach(() => {
    const products: any = {
        1: new Product(1, "A", 1000, 100, 30, 10, 3),
        2: new Product(2, "B", 5000, 50, 50, 50, 22),
        3: new Product(3, "C", 30, 10, 10, 10, 0.9)
    }
    productRepository = {
        async get(idProduct: number): Promise<Product> {
            return products[idProduct];
        }
    };
    const coupons: any = {
        "VALE20": new Coupon("VALE20", 20, new Date("2024-10-01T10:00:00")),
        "VALE10": new Coupon("VALE10", 10, new Date("2022-10-01T10:00:00")),
    }
    //ou eu passo uma versão que acessa o banco ou eu passo uma versão que retorna algo parecido com o que vem do banco
    couponRepository = {
        async get(code: string): Promise<any> {
            return coupons[code];
        }
    };
    checkout = new Checkout(productRepository, couponRepository);
    orderRepository = new OrderRepositoryDatabase();
    getOrder = new GetOrder(orderRepository);
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
    await orderRepository.clear()
    checkout = new Checkout(productRepository, couponRepository, orderRepository);
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
    checkout = new Checkout();
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

// test("Deve verificar se o email foi enviado usando um spy", async function () {
//     const productRepositoryStub = sinon.stub(ProductRepositoryDatabase.prototype, "get").resolves(
//         new Product(1, 'A', 100, 1, 1, 1, 1));
//     const emailGatewaySpy = sinon.spy(EmailGatewayConsole.prototype, "send");
//     checkout = new Checkout();
//     const input = {
//         cpf: "407.302.170-27",
//         items: [
//             { idProduct: 1, quantity: 1 }
//         ],
//         email: "john.doe@gmail.com"
//     };
//     const output = await checkout.execute(input);
//     expect(output.total).toBe(100);
//     expect(emailGatewaySpy.calledOnce).toBe(true);
//     expect(emailGatewaySpy.calledWith("Purchase Success", "...", "john.doe@gmail.com", "lina@amaral@gmail")).toBe(true);
//     productRepositoryStub.restore();
//     emailGatewaySpy.restore();
// });

test("Deve verificar se o email foi enviado usando um mock", async function () {
    const productRepositoryMock = sinon.mock(ProductRepositoryDatabase.prototype);
    productRepositoryMock.expects("get").once().resolves(
        new Product(1, "A", 100, 1, 1, 1, 1)
    );
    const couponRepositorySpy = sinon.spy(CouponRepositoryDatabase.prototype, "get");
    checkout = new Checkout();
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