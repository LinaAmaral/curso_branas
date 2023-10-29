import Checkout from "./Checkout";
import HttpServer from "./HttpServer";

// é um interface adapter que disponibilizou um ponto de conexão
export default class HttpController {
    constructor(readonly httpServer: HttpServer, readonly checkout: Checkout) {
        httpServer.on("post", "/checkout", async function (params: any, body: any) {
            return await checkout.execute(body)
        })
    }
}

//Pq é um interface adapter? Pq que é a ponte entre um recusto exteno(httpService) e a aplicação (checkout)
//ele expos uma porta de conexão que é o httpserver que foi suprido pelo express adapter