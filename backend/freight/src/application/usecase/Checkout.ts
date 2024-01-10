import CouponRepository from "../repository/CouponRepository";
import FreightCalculator from "../../domain/entity/FreightCalculator";
import Order from "../../domain/entity/Order";
import OrderRepository from "../../application/repository/OrderRepository";
import ProductRepository from "../../application/repository/ProductRepository";
import RepositoryFactory from "../../application/factory/RepositoryFactory";


//Aqui temos um Control:Controla o fluxo de negócio. O comportamento não deve estar aqui e sim nas entidades

//camada de aplicação (regras de negócio, aquilo que é reusável) Aqui eu exponho o comportamento
//sempre que eu dou um new eu perco a oportunidade de controlar a dependencia. Então se eu der um new ProductRepositoryDataBase() para acessar o banco na lina 23 eu vou precisar acessar um banco para testar mesmo teste.
//a minha classe Checkout não tem a menor ideia de quem seja CouponRepository, então tanto faz se eu passo um mock ou se eu vou acessar o banco. Dessa forma consigo testar.
export default class Checkout {

    orderRepository: OrderRepository;
    productRepository: ProductRepository;
    couponRepository: CouponRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.orderRepository = repositoryFactory.createOrderRepository();
        this.productRepository = repositoryFactory.createProductRepository();
        this.couponRepository = repositoryFactory.createCouponRepository();
    }

    async execute(input: Input): Promise<Output> {
        const sequence = await this.orderRepository.count()
        const order = new Order(input.idOrder, input.cpf, input.date, sequence + 1)
        for (const item of input.items) {
            const product = await this.productRepository.get(item.idProduct);
            order.addItem(product, item.quantity)
            if (input.from && input.to) {
                order.freight += FreightCalculator.calculate(product) * item.quantity;
            }
        }
        if (input.coupon) {
            const coupon = await this.couponRepository.get(input.coupon);
            if (coupon && coupon.isValid(input.date || new Date())) {
                order.addCoupon(coupon);
            }
        }
        await this.orderRepository.save(order);
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
    to?: string
}

type Output = {
    freight: number,
    total: number
}
