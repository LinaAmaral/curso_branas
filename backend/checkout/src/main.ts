import DatabaseRepositoryFactory from "./infra/factory/DatabaseRepositoryFactory";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import HttpController from "./infra/http/HttpController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import UseCaseFactory from "./infra/factory/UsecaseFactory";
import AxiosAdapter from "./infra/http/AxiosAdapter";
import GatewayHttpClient from "./infra/factory/GatewayHttpClient";

const connection = new PgPromiseAdapter();
connection.connect();

const repositoryFactory = new DatabaseRepositoryFactory(connection)
const httpClient = new AxiosAdapter()
const gatewayFactory = new GatewayHttpClient(httpClient)
const usecaseFactory = new UseCaseFactory(repositoryFactory, gatewayFactory)

const httpServer = new ExpressAdapter();
new HttpController(httpServer, usecaseFactory)
httpServer.listen(3000)


