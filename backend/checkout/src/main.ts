import DatabaseRepositoryFactory from "./infra/factory/DatabaseRepositoryFactory";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import HttpController from "./infra/http/HttpController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import UsecaseFactory from "./infra/factory/UsecaseFactory";
import AxiosAdapter from "./infra/http/AxiosAdapter";
import GatewayHttpClient from "./infra/factory/GatewayHttpClient";
import RabbitMQAdapter from "./infra/queue/RabbitMQAdapter";
import QueueController from "./infra/queue/QueueController";



async function main() {
    const connection = new PgPromiseAdapter();
    connection.connect();

    const repositoryFactory = new DatabaseRepositoryFactory(connection)
    const httpClient = new AxiosAdapter()
    const gatewayFactory = new GatewayHttpClient(httpClient)
    const queue = new RabbitMQAdapter();
    await queue.connect()

    const usecaseFactory = new UsecaseFactory(repositoryFactory, gatewayFactory, queue);
    const httpServer = new ExpressAdapter();
    new HttpController(httpServer, usecaseFactory, queue)
    new QueueController(queue, usecaseFactory);
    httpServer.listen(3000)

}



main();