import HttpServer from "./HttpServer";
import UseCaseFactory from "../factory/UsecaseFactory";

export default class HttpController {
    constructor(httpServer: HttpServer, usecaseFactory: UseCaseFactory) {

        httpServer.on("post", "/simulateFreight", async function (params: any, body: any) {
            const simulateFreigt = usecaseFactory.createSimulateFreight()
            return await simulateFreigt.execute(body)
        })

    }
}

