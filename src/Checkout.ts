import CouponRepository from "./CouponRepository";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import OrderRepository from "./OrderRepository";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import ProductRepository from "./ProductRepository";
import ProductRepositoryDatabase from "./ProductRepositoryDataBase";
import { validate } from "./Validate";


//camada de aplicação (regras de negócio, aquilo que é reusável) Aqui eu exponho o comportamento
//sempre que eu dou um new eu perco a oportunidade de controlar a dependencia. Então se eu der um new ProductRepositoryDataBase() para acessar o banco na lina 23 eu vou precisar acessar um banco para testar mesmo teste.
//a minha classe Checkout não tem a menor ideia de quem seja CouponRepository, então tanto faz se eu passo um mock ou se eu vou acessar o banco. Dessa forma consigo testar.
export default class Checkout {

    constructor(
        // readonly productRepository: ProductRepository, ou eu passo assim ou deixo igual a linha de baixo que seria um new do banco como default
        readonly productRepository: ProductRepository = new ProductRepositoryDatabase(),
        readonly couponRepository: CouponRepository = new CouponRepositoryDatabase(),
        readonly orderRepository: OrderRepository = new OrderRepositoryDatabase(),
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
                    const productData = await this.productRepository.get(item.idProduct);
                    if (productData.width <= 0 || productData.height <= 0 || productData.length <= 0) throw new Error("Invalid dimensions");
                    if (productData.weight <= 0) throw new Error("Invalid weight");
                    const price = parseFloat(productData.price);
                    output.subtotal += price * item.quantity;
                    if (input.from && input.to) {
                        const volume = productData.width / 100 * productData.height / 100 * productData.length / 100;
                        const density = parseFloat(productData.weight) / volume;
                        let freight = volume * 1000 * (density / 100);
                        freight = Math.max(10, freight);
                        output.freight += freight * item.quantity;
                    }
                }
            }
            output.total = output.subtotal;
            if (input.coupon) {
                const couponData = await this.couponRepository.get(input.coupon);
                const today = new Date();
                if (couponData && couponData.expire_date.getTime() >= today.getTime()) {
                    output.total -= (output.total * parseFloat(couponData.percentage)) / 100;
                }
            }
            output.total += output.freight;
            const order = {
                idOrder: input.idOrder,
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
