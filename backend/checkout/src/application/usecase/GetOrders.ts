import OrderRepository from "../repository/OrderRepository";
import RepositoryFactory from "../factory/RepositoryFactory";
import GatewayFactory from "../factory/GatewayFactory";
import CatalogGateway from "../gateway/CatalogGateway";


//Esse é um exemplo de como não fazer.
//Esse é o modelo command, preciso ficar indo em um monte de repositório pegar dados e montar 
//o modelo de domínio. Não fica performático. O melhor nesse caso é usar o modelo query e voltar um dao


export default class GetOrders {
    orderRepository: OrderRepository;
    catalogGateway: CatalogGateway;

    constructor(repositoryFactory: RepositoryFactory, gatewayFactory: GatewayFactory) {
        this.orderRepository = repositoryFactory.createOrderRepository();
        this.catalogGateway = gatewayFactory.createCatalogGateway();
    }

    async execute(): Promise<Output[]> {
        const output: Output[] = [];
        const orders = await this.orderRepository.list();
        for (const order of orders) {
            const orderOutput: any = {
                idOrder: order.idOrder,
                items: [],
                date: order.date
            };
            for (const item of order.items) {
                const product = await this.catalogGateway.getProduct(item.idProduct);
                orderOutput.items.push({
                    description: product.description,
                    price: item.price,
                    quantity: item.quantity
                });
            }
            output.push(orderOutput);
        }
        return output;
    }
}

type Output = {
    idOrder: string,
    items: { description: string, price: number, quantity: number }[],
    date: Date
};