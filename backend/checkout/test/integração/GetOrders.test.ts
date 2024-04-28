import GetOrders from "../../src/application/usecase/GetOrders";
import GetOrdersQuery from "../../src/application/query/GetOrders";
import OrderDAODatabase from "../../src/infra/dao/OrderDAODatabase";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import DatabaseRepositoryFactory from "../../src/infra/factory/DatabaseRepositoryFactory";
import AxiosAdapter from "../../src/infra/http/AxiosAdapter";
import GatewayHttpClient from "../../src/infra/factory/GatewayHttpClient";

test("Deve retornar os pedidos Command Model", async function () {
	const connection = new PgPromiseAdapter();
	await connection.connect();
	const repositoryFactory = new DatabaseRepositoryFactory(connection);
	const httpClient = new AxiosAdapter();
	const gatewayFactory = new GatewayHttpClient(httpClient);
	const getOrders = new GetOrders(repositoryFactory, gatewayFactory);
	const output = await getOrders.execute();
	for (const orderOutput of output) {
		console.log(orderOutput.items);
	}
	await connection.close();
});

test("Deve retornar os pedidos Query Model", async function () {
	const connection = new PgPromiseAdapter();
	await connection.connect();
	const orderDAO = new OrderDAODatabase(connection);
	const getOrders = new GetOrdersQuery(orderDAO);
	const output = await getOrders.execute();
	console.log(output);
	await connection.close();
});