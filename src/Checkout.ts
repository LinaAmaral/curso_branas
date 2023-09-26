import Clock from "./Clock";
import CouponRepository from "./CouponRepository";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import FreightCalculator from "./FreightCalculator";
import OrderRepository from "./OrderRepository";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import ProductRepository from "./ProductRepository";
import ProductRepositoryDatabase from "./ProductRepositoryDataBase";
import RealClock from "./RealClock";
import SimulateFreight from "./SimulateFreight";
import { validate } from "./Validate";

//Aqui temos um Control:Controla o fluxo de negócio. O comportamento não deve estar aqui e sim nas entidades

//camada de aplicação (regras de negócio, aquilo que é reusável) Aqui eu exponho o comportamento
//sempre que eu dou um new eu perco a oportunidade de controlar a dependencia. Então se eu der um new ProductRepositoryDataBase() para acessar o banco na lina 23 eu vou precisar acessar um banco para testar mesmo teste.
//a minha classe Checkout não tem a menor ideia de quem seja CouponRepository, então tanto faz se eu passo um mock ou se eu vou acessar o banco. Dessa forma consigo testar.
export default class Checkout {

    constructor(
        // readonly productRepository: ProductRepository, ou eu passo assim ou deixo igual a linha de baixo que seria um new do banco como default
        readonly productRepository: ProductRepository = new ProductRepositoryDatabase(),
        readonly couponRepository: CouponRepository = new CouponRepositoryDatabase(),
        readonly orderRepository: OrderRepository = new OrderRepositoryDatabase(),
        // readonly clock: Clock = new RealClock(), é um pouco de mais fazer esse caminho, passarial como parametro
    ) {
    }

    async execute(input: Input): Promise<Output> {
        const output = {
            subtotal: 0,
            freight: 0,
            total: 0
        };
        if (validate(input.cpf)) {
            if (input.items) {
                for (const item of input.items) {
                    if (item.quantity <= 0) throw new Error("Invalid quantity");
                    if (input.items.filter((i: any) => i.idProduct === item.idProduct).length > 1) throw new Error("Duplicated item");
                    const product = await this.productRepository.get(item.idProduct);
                    if (product.width <= 0 || product.height <= 0 || product.length <= 0) throw new Error("Invalid dimensions");
                    if (product.weight <= 0) throw new Error("Invalid weight");
                    output.subtotal += product.price * item.quantity;
                    if (input.from && input.to) {
                        const freight = FreightCalculator.calculate(product);
                        output.freight += freight * item.quantity;
                    }
                }
            }
            output.total = output.subtotal;
            const today = input.date || new Date();
            if (input.coupon) {
                const couponData = await this.couponRepository.get(input.coupon);
                if (couponData && couponData.expire_date.getTime() >= today.getTime()) {
                    output.total -= (output.total * parseFloat(couponData.percentage)) / 100;
                }
            }
            output.total += output.freight;
            let sequence = await this.orderRepository.count();
            sequence++;
            const code = `${today.getFullYear()}${new String(sequence).padStart(8, "0")}`
            const order = {
                idOrder: input.idOrder,
                code,
                cpf: input.cpf,
                total: output.total,
                freight: output.freight,
                items: input.items
            }
            await this.orderRepository.save(order);
            return output;
        } else {
            throw new Error("Invalid cpf");
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
    subtotal: number,
    freight: number,
    total: number
}
