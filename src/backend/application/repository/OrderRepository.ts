import Order from "../../domain/entity/Order";

export default interface OrderRepository {
    get(uuid: string): Promise<any>;
    save(order: Order): Promise<void>;
    clear(): Promise<void>;
    count(): Promise<number>;
}

//Aqui tb temos um Boundary