import OrderDAO from "../../application/dao/OrderDao";
import DatabaseConnection from "../database/DatabaseConnection";


//caso simples, query model. Não instancio nos objetos de domínio, vou uma vez só ao banco
export default class OrderDAODatabase implements OrderDAO {

    constructor(readonly connection: DatabaseConnection) {
    }

    async list(): Promise<any> {
        return this.connection.query("select * from cccat11.item join cccat11.product using (id_product)", []);
    }

}