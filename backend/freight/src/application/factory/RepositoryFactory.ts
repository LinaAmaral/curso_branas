//repository factory pq são famílias de repositórios
//esse padrão é muito bom para ser usado com usecases

//é a factory que a aplication conhece de repository

import CouponRepository from "../repository/CouponRepository";
import OrderRepository from "../repository/OrderRepository";
import ProductRepository from "../repository/ProductRepository";

export default interface RepositoryFactory {
    createOrderRepository(): OrderRepository;
    createProductRepository(): ProductRepository;
    createCouponRepository(): CouponRepository;
}