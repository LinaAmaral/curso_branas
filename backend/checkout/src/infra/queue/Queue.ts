export default interface Queue {
    connect(): Promise<void>;
    on(queueName: string, callBack: Function): Promise<void>;
    publish(queueName: string, data: any): Promise<void>;
}