import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import PgPromiseAdapter from "../src/PgPromiseAdapter";
import ProductRepositoryDatabase from "../src/ProductRepositoryDataBase"
import SimulateFreight from "../src/SimulateFreight";

test("Deve simular o frete", async function () {
    const input = {
        items: [
            { idProduct: 1, quantity: 1 },
            { idProduct: 2, quantity: 1 },
            { idProduct: 3, quantity: 3 }
        ],
        from: "88015600",
        to: "22030060"
    }
    const connection = new PgPromiseAdapter();
    connection.connect();
    const repositoryFactory = new DatabaseRepositoryFactory(connection)
    const simulateFreight = new SimulateFreight(repositoryFactory)
    const output = await simulateFreight.execute(input);
    expect(output.freight).toBe(280)
    await connection.close()
})