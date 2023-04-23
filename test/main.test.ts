import axios from "axios";
import { Cupons } from "../src/Desconto";
import Pedido from "../src/Pedido";
import Produto from "../src/Produto";
import { validate } from "../src/Validate";

// const ITENS_DO_PEDIDO = [{
//     produto: new Produto("arroz", 10),
//     quantidade: 1
// },
// {
//     produto: new Produto("feijao", 5),
//     quantidade: 2
// },
// {
//     produto: new Produto("farinha", 20),
//     quantidade: 1
// },
// ]

// const CPF_VALIDO = ["09397879626", "20129841005", "025.787.610-35"];
// const CPF_INVALIDO = ["09397879625", "111.111.111-11", "", "0939785479865", "093.978"];

test("Não deve criar pedido com cpf inválido", async function () {
    const input = {
        cpf: "406.302.170-27"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.message).toBe("Invalid cpf");
});

test("Deve fazer um pedido com 3 itens", async function () {
    const input = {
        cpf: "407.302..170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 },
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(6090);
});
test("Deve fazer um pedido com 3 itens com cupom de desconto", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 },
        ],
        coupon: "VALE20"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(4872);
});
test("A quantidade de um item não pode ser negativa", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 0 },
        ],
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.message).toBe("Invalid quantity");
});

