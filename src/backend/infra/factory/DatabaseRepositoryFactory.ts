import CouponRepository from "../../application/repository/CouponRepository";
import CouponRepositoryDatabase from "../repository/CouponRepositoryDatabase";
import DatabaseConnection from "../database/DatabaseConnection";
import OrderRepository from "../../OrderRepository";
import OrderRepositoryDatabase from "../../OrderRepositoryDatabase";
import ProductRepository from "../../ProductRepository";
import ProductRepositoryDatabase from "../../ProductRepositoryDataBase";
import RepositoryFactory from "../../RepositoryFactory";

export default class DatabaseRepositoryFactory implements RepositoryFactory {

    constructor(readonly connection: DatabaseConnection) { }

    createOrderRepository(): OrderRepository {
        return new OrderRepositoryDatabase(this.connection)
    }
    createProductRepository(): ProductRepository {
        return new ProductRepositoryDatabase(this.connection)
    }
    createCouponRepository(): CouponRepository {
        return new CouponRepositoryDatabase(this.connection)
    }

}