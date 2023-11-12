import axios from 'axios';
import CheckoutGateway from './CheckoutGateway'

export default class HttpCheckoutGateway implements CheckoutGateway {
    async getProducts(): Promise<any> {
        const response = await axios.get("http://localhost:3000/products");
        return response.data;
    }
    async checkout(order: any): Promise<any> {
        const response = await axios.post("http://localhost:3000/checkout", order)
        return response.data
    }

}