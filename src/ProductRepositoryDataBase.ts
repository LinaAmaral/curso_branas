import pgp from "pg-promise";
import ProductRepository from "./ProductRepository";
import Product from "./Product";
import DatabaseConnection from "./DatabaseConnection";

export default class ProductRepositoryDatabase implements ProductRepository {

    constructor(readonly connection: DatabaseConnection) {
    }

    async get(idProduct: number) {
        const [productData] = await this.connection.query("select * from cccat11.product where id_product = $1", [idProduct]);
        return new Product(
            productData.id_product,
            productData.description,
            parseFloat(productData.price),
            productData.width,
            productData.height,
            productData.length,
            parseFloat(productData.weight)
        )
    }

}

//o papel desse repositório é me devolver a entidade, por isso eu faço esse retorno, pra fazer a conversão do banco para algo de domínio