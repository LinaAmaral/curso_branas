import UsecaseFactory from "../factory/UsecaseFactory";
import Queue from "./Queue";

export default class QueueController {

    constructor(readonly queue: Queue, readonly usecaseFactory: UsecaseFactory) {
        const checkout = usecaseFactory.createCheckout();
        // handler
        //recebe um pedido da fila e manda para a aplicação
        queue.on("checkout", async function (input: any) {
            await checkout.execute(input);
        });
    }
}

