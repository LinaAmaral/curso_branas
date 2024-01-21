import HttpServer from "./HttpServer";
import UseCaseFactory from "../factory/UsecaseFactory";

export default class HttpController {
    constructor(httpServer: HttpServer, usecaseFactory: UseCaseFactory) {

        httpServer.on("post", "/verify", async function (params: any, body: any, headers: any) {
            // const verify = usecaseFactory.createVerify();
            // const output = await verify.execute(body.token);
            // return output;
        });


    }
}
