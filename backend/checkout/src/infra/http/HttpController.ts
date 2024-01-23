import HttpServer from "./HttpServer";
import UseCaseFactory from "../factory/UsecaseFactory";

// é um interface adapter que disponibilizou um ponto de conexão
export default class HttpController {
    constructor(httpServer: HttpServer, usecaseFactory: UseCaseFactory) {

        httpServer.on("post", "/checkout", async function (params: any, body: any) {
            const checkout = usecaseFactory.createCheckout()
            return await checkout.execute(body)
        })

        httpServer.on("get", "/products", async function (params: any, body: any, headers: any) {
            const contentType = headers["content-type"] || "application/json";
            const getProducts = usecaseFactory.createGetProducts(contentType);
            const output = await getProducts.execute();
            return output;
        });

        httpServer.on("get", "/orders/:idOrder", async function (params: any, body: any) {
            const getOrder = usecaseFactory.createGetOrder();
            const output = await getOrder.execute(params.req.params.idOrder);
            return output;
        });
    }
}

//Pq é um interface adapter? Pq que é a ponte entre um recusto exteno(httpService) e a aplicação (checkout)
//ele expos uma porta de conexão que é o httpserver que foi suprido pelo express adapter