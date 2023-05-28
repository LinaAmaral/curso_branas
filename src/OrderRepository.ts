export default interface OrderRepository {
    get(uuid: string): Promise<any>;
    save(order: any): Promise<void>;
    clean(): Promise<void>;
    count(): Promise<number>;
}