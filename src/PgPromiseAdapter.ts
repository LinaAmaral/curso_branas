import DatabaseConnection from "./DatabaseConnection";
import pgp from "pg-promise";

//Além de ser um framework and driver é um adapter
//PgPromiseAdapter abstrai uma conexão com o banco de dados

export default class PgPromiseAdapter implements DatabaseConnection {
    connection: any;

    async connect(): Promise<void> {
        this.connection = pgp()("postgres://postgres:12345@localhost:5433/app");
    }
    async query(statement: string, params: any): Promise<any> {
        return this.connection.query(statement, params);

    }
    async close(): Promise<void> {
        await this.connection.$pool.end();
    }

}