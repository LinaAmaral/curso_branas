export default interface CheckoutGateway {
    getProducts(): Promise<any>
    checkout(order: any): Promise<any>
}