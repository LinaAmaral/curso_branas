import OrderRepository from "./OrderRepository";
import pgp from "pg-promise";

export default class OrderRepositoryDatabase implements OrderRepository {

    async get(idOrder: string): Promise<any> {
        const connection = pgp()("postgres://postgres:12345@localhost:5433/app");
        const [orderData] = await connection.query("select * from cccat11.order where id_order = $1", [idOrder]);
        await connection.$pool.end();
        return orderData
    }

    async save(order: any): Promise<void> {
        const connection = pgp()("postgres://postgres:12345@localhost:5433/app");
        await connection.query("insert into cccat11.order (id_order, code, cpf, total, freight) values ($1, $2, $3, $4, $5)",
            [order.idOrder, order.code, order.cpf, order.total, order.freight]);
        await connection.$pool.end();
    }

    async clear(): Promise<void> {
        const connection = pgp()("postgres://postgres:12345@localhost:5433/app");
        await connection.query("delete from cccat11.order", []);
        await connection.$pool.end();
    }

    async count(): Promise<number> {
        const connection = pgp()("postgres://postgres:12345@localhost:5433/app");
        const [data] = await connection.query("select count(*)::integer from cccat11.order");
        await connection.$pool.end();
        return data.count
    }



}