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
//no controller a fabrica fabrcia uma instancia de um use case

//esse meu controller trabalha com o método http, então preciso passar um servidor http, faço isso na instanciação