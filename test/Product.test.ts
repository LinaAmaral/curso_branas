import Product from "../src/Product"


//Testa a unidade
test("Deve calcular o volume", function () {
    const product = new Product(1, 'A', 1000, 100, 30, 10, 3)
    expect(product.getVolume()).toBe(0.03)

})

test("Deve calcular a densidade", function () {
    const product = new Product(1, 'A', 1000, 100, 30, 10, 3)
    expect(product.getDensity()).toBe(100)

})