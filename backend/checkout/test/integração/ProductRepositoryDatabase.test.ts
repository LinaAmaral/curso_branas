import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import ProductRepositoryDatabase from "../../src/infra/repository/ProductRepositoryDataBase"

test("Deve obter um produto do banco de dados", async function () {
    const connection = new PgPromiseAdapter();
    connection.connect();
    const productRepository = new ProductRepositoryDatabase(connection)
    const product = await productRepository.get(1);
    expect(product.price).toBe(1000)
    await connection.close()

})
