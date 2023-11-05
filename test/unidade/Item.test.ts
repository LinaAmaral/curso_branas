import Item from "../../src/backend/domain/entity/Item"
import Product from "../../src/backend/domain/entity/Product"

test("Não deve criar um item com quantidade inválida", function () {
    const product = new Product(1, "A", 1000, 100, 30, 10, 3);
    expect(() => new Item(product.idProduct, product.price, 0)).toThrow(new Error("Invalid quantity"))
})

//eu não preciso ir na Order e dizer que não posso teste com quantidade inválida, pq já testei isso em Item