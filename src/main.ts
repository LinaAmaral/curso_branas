import Checkout from "./Checkout";
import DatabaseRepositoryFactory from "./DatabaseRepositoryFactory";
import ExpressAdapter from "./ExpressAdapter";
import HttpController from "./HttpController";
import PgPromiseAdapter from "./PgPromiseAdapter";
import UseCaseFactory from "./UsecaseFactory";

const connection = new PgPromiseAdapter();
connection.connect();

const repositoryFactory = new DatabaseRepositoryFactory(connection)
const usecaseFactory = new UseCaseFactory(repositoryFactory)

const httpServer = new ExpressAdapter();
new HttpController(httpServer, usecaseFactory)
httpServer.listen(3000)


