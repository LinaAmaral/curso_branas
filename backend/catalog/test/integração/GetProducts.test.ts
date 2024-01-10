import DatabaseRepositoryFactory from "../../src/infra/factory/DatabaseRepositoryFactory";
import GetProducts from "../../src/application/usecase/GetProducts";
import JsonPresenter from "../../src/infra/presenter/JsonPresenter";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";

test("Deve listar os produtos", async function () {
    //framework and driver
    const connection = new PgPromiseAdapter();
    await connection.connect();
    //interface adapter
    const repositoryFactory = new DatabaseRepositoryFactory(connection)
    //use case - aplication
    const getProduct = new GetProducts(repositoryFactory, new JsonPresenter());
    const output = await getProduct.execute();
    expect(output).toHaveLength(3);

    await connection.close()
})