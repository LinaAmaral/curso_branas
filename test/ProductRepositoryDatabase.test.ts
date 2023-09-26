import ProductRepositoryDatabase from "../src/ProductRepositoryDataBase"

test("Deve obter um produto do banco de dados", async function () {
    const productRepository = new ProductRepositoryDatabase();
    const product = await productRepository.get(1);
    expect(product.price).toBe(1000)
})