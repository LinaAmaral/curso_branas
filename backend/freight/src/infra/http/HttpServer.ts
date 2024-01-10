//interface adapter com framework and driver
//essa interface é para rest, para um graphell não funcionaria
export default interface HttpServer {
    on(method: string, url: string, callback: Function): void;
    listen(port: number): void;
}