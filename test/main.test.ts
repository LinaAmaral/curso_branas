import axios from "axios";
import { Cupons } from "../src/Desconto";
import Pedido from "../src/Pedido";
import Produto from "../src/Produto";
import { validate } from "../src/Validate";


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
test("Não deve aplicar um cupom de desconto expirado", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
        ],
        coupon: "VALE10"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.message).toBe("Invalid coupon");
});
test("Um mesmo item não pode ser informado mais de uma vez", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 1, quantity: 2 },
        ],
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.message).toBe("Invalid list items");
});

