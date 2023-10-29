import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import GetProducts from "../src/GetProducts";
import PgPromiseAdapter from "../src/PgPromiseAdapter";

test("Deve listar todos os produtos", async function () {
    //framework and driver
    const connection = new PgPromiseAdapter();
    await connection.connect();
    //interface adapter
    const repositoryFactory = new DatabaseRepositoryFactory(connection)
    //use case - aplication
    const getProducts = new GetProducts(repositoryFactory);
    const output = await getProducts.execute();
    expect(output).toHaveLength(3)

    await connection.close()
})