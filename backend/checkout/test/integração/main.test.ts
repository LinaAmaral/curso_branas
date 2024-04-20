import axios from "axios";
import crypto from 'crypto';

axios.defaults.validateStatus = function () {
    return true;
}

async function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
};

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
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(6090);
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
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
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
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
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
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.total).toBe(6090);
});

test("Não deve fazer um pedido com quantidade negativa de item", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: -1 }
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(response.status).toBe(422);
    expect(output.message).toBe("Invalid quantity");
});

test("Não deve fazer um pedido com item duplicado", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 1, quantity: 1 }
        ]
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(response.status).toBe(422);
    expect(output.message).toBe("Duplicated item");
});

test("Deve fazer um pedido com 3 itens calculando o frete", async function () {
    const input = {
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 }
        ],
        from: "88015600",
        to: "22060030"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.freight).toBe(187.05544450204079);
    expect(output.total).toBe(6187.055444502041);
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
        to: "22060030"
    };
    const response = await axios.post("http://localhost:3000/checkout", input);
    const output = response.data;
    expect(output.freight).toBe(217.05544450204079);
    expect(output.total).toBe(6307.055444502041);
});

test("Deve listar os produtos em json", async function () {
    const response = await axios({
        url: "http://localhost:3000/products",
        headers: {
            "content-type": "application/json"
        }
    });
    const output = response.data;
    expect(output).toHaveLength(3);
    expect(output.at(0)?.idProduct).toBe(1);
    expect(output.at(1)?.idProduct).toBe(2);
    expect(output.at(2)?.idProduct).toBe(3);
});

test("Deve listar os produtos em csv", async function () {
    const response = await axios({
        url: "http://localhost:3000/products",
        headers: {
            "content-type": "text/csv"
        }
    });
    const output = response.data;
    expect(output).toBe("1;A;1000\n2;B;5000\n3;C;30");
});

test("Deve fazer um pedido com 3 itens e validar a autenticação", async function () {
    const idOrder = crypto.randomUUID()
    const input = {
        idOrder,
        cpf: "407.302.170-27",
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ],
    };
    await axios.post("http://localhost:3000/checkout", input, {
        headers: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvYW9AZ21haWwuY29tIiwiaWF0IjoxNjQ2MTM5NjAwMDAwLCJleHBpcmVzSW4iOjEwMDAwMDB9.aHf1geyFbypi_-xreacJmHo8Fhh7c2hBdok_KCkEsG4'
        }
    });
    // await sleep(200);
    const response = await axios.get(`http://localhost:3000/orders/${idOrder}`);
    const output = response.data;
    expect(output.total).toBe(6090);
});