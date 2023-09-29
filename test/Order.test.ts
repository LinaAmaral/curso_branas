import Order from "../src/Order";
import crypto from "crypto";
import Product from "../src/Product";

test("Deve criar um pedido vazio", function () {
    const idOrder = crypto.randomUUID()
    const cpf = '407.302.170-27'
    const order = new Order(idOrder, cpf)
    expect(order.getTotal()).toBe(0)
})

test("Não deve criar pedido com cpf inválido", function () {
    const idOrder = crypto.randomUUID()
    const cpf = '407.302.170-26'
    expect(() => new Order(idOrder, cpf)).toThrow(new Error("Invalid cpf"))
})

test("Deve criar um pedido com 3 itens", function () {
    const idOrder = crypto.randomUUID()
    const cpf = '407.302.170-27'
    const order = new Order(idOrder, cpf)
    order.addItem(new Product(1, "A", 1000, 100, 30, 10, 3), 1)
    order.addItem(new Product(2, "B", 5000, 50, 50, 50, 22), 1)
    order.addItem(new Product(3, "C", 30, 10, 10, 10, 0.9), 3)
    expect(order.getTotal()).toBe(6090)
})