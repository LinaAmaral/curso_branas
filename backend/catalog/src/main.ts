import DatabaseRepositoryFactory from "./infra/factory/DatabaseRepositoryFactory";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import HttpController from "./infra/http/HttpController";
import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import UseCaseFactory from "./infra/factory/UsecaseFactory";

const connection = new PgPromiseAdapter();
connection.connect();

const repositoryFactory = new DatabaseRepositoryFactory(connection)
const usecaseFactory = new UseCaseFactory(repositoryFactory)

const httpServer = new ExpressAdapter();
new HttpController(httpServer, usecaseFactory)
httpServer.listen(3001)


