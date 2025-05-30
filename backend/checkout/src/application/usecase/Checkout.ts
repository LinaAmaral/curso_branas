import CouponRepository from "../repository/CouponRepository";
import Order from "../../domain/entity/Order";
import OrderRepository from "../../application/repository/OrderRepository";
import ProductRepository from "../../application/repository/ProductRepository";
import RepositoryFactory from "../../application/factory/RepositoryFactory";
import GatewayFactory from "../factory/GatewayFactory";
import CatalogGateway from "../gateway/CatalogGateway";
import FreightGateway from "../gateway/FreightGateway";
import Usecase from "./Usecase";
import Queue from "../../infra/queue/Queue";


//Aqui temos um Control:Controla o fluxo de negócio. O comportamento não deve estar aqui e sim nas entidades

//camada de aplicação (regras de negócio, aquilo que é reusável) Aqui eu exponho o comportamento
//sempre que eu dou um new eu perco a oportunidade de controlar a dependencia. Então se eu der um new ProductRepositoryDataBase() para acessar o banco na lina 23 eu vou precisar acessar um banco para testar mesmo teste.
//a minha classe Checkout não tem a menor ideia de quem seja CouponRepository, então tanto faz se eu passo um mock ou se eu vou acessar o banco. Dessa forma consigo testar.
export default class Checkout implements Usecase {

    orderRepository: OrderRepository;
    productRepository: ProductRepository;
    couponRepository: CouponRepository;
    catalogGateway: CatalogGateway;
    freightGateway: FreightGateway;

    constructor(repositoryFactory: RepositoryFactory, gatewayFactory: GatewayFactory, readonly queue?: Queue) {
        this.orderRepository = repositoryFactory.createOrderRepository();
        this.productRepository = repositoryFactory.createProductRepository();
        this.couponRepository = repositoryFactory.createCouponRepository();
        this.catalogGateway = gatewayFactory.createCatalogGateway();
        this.freightGateway = gatewayFactory.createFreightGateway();

    }

    async execute(input: Input): Promise<Output> {

        const sequence = await this.orderRepository.count()
        const order = new Order(input.idOrder, input.cpf, input.date, sequence + 1)
        const inputFreight: any = {
            items: [],
            from: input.from,
            to: input.to
        };
        for (const item of input.items) {
            const product = await this.catalogGateway.getProduct(item.idProduct)
            order.addItem(product, item.quantity)
            inputFreight.items.push({
                volume: product.volume,
                density: product.density,
                quantity: item.quantity
            })
        }
        if (input.from && input.to) {
            const output = await this.freightGateway.simulateFreight(inputFreight);
            order.freight = output.freight
        }
        if (input.coupon) {
            const coupon = await this.couponRepository.get(input.coupon);
            if (coupon && coupon.isValid(input.date || new Date())) {
                order.addCoupon(coupon);
            }
        }
        await this.orderRepository.save(order);

        if (this.queue) {
            await this.queue.publish("orderPlaced", order)
        }
        return {
            freight: order.freight,
            total: order.getTotal()
        }

    }
}

type Input = {
    idOrder?: string,
    date?: Date,
    cpf: string,
    email?: string,
    items: { idProduct: number, quantity: number }[],
    coupon?: string,
    from?: string,
    to?: string,
}

type Output = {
    freight: number,
    total: number
}
