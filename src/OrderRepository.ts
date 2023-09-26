export default interface OrderRepository {
    get(uuid: string): Promise<any>;
    save(order: any): Promise<void>;
    clear(): Promise<void>;
    count(): Promise<number>;
}

//Aqui tb temos um Boundary