//repository factory pq são famílias de repositórios
//esse padrão é muito bom para ser usado com usecases

import CouponRepository from "./CouponRepository";
import OrderRepository from "./OrderRepository";
import ProductRepository from "./ProductRepository";

export default interface RepositoryFactory {
    createOrderRepository(): OrderRepository;
    createProductRepository(): ProductRepository;
    createCouponRepository(): CouponRepository;
}