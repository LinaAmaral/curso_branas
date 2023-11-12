import axios from 'axios';
import CheckoutGateway from './CheckoutGateway'
import Product from '../entity/Product';

export default class HttpCheckoutGateway implements CheckoutGateway {
    async getProducts(): Promise<any> {
        const response = await axios.get("http://localhost:3000/products");
        const productsData = response.data;
        const products: Product[] = []
        for (const product of productsData) {
            products.push(new Product(product.idProduct, product.description, product.price))
        }
        return products;

    }
    async checkout(order: Order): Promise<any> {
        const response = await axios.post("http://localhost:3000/checkout", order)
        return response.data
    }

}