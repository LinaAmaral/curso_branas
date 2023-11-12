import CheckoutGateway from './CheckoutGateway'
import Product from '../entity/Product';
import Order from '../entity/Order';
import HttpClient from '../http/HttpClient';

export default class HttpCheckoutGateway implements CheckoutGateway {

    constructor(readonly httpClient: HttpClient) { }

    async getProducts(): Promise<any> {
        const productsData = await this.httpClient.get("http://localhost:3000/products");
        const products: Product[] = []
        for (const product of productsData) {
            products.push(new Product(product.idProduct, product.description, product.price))
        }
        return products;

    }
    async checkout(order: Order): Promise<any> {
        return this.httpClient.post("http://localhost:3000/checkout", order)
    }

}