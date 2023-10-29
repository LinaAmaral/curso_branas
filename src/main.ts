import express, { Request, Response } from "express";
import Checkout from "./Checkout";
import DatabaseRepositoryFactory from "./DatabaseRepositoryFactory";
import PgPromiseAdapter from "./PgPromiseAdapter";
const app = express();
app.use(express.json());

const connection = new PgPromiseAdapter();
connection.connect();
const repositoryFactory = new DatabaseRepositoryFactory(connection)

app.post("/checkout", async function (req: Request, res: Response) {
    const checkout = new Checkout(repositoryFactory);
    try {
        const output = await checkout.execute(req.body);
        res.json(output);
    } catch (e: any) {
        res.status(422).json({
            message: e.message
        });
    }
});
app.listen(3000);

//Aqui temos uma Boundary: permite a interação do usuário com o sistema

//cada um dos drives conhece Checkout
//aqui eu faria esse pra rest, um pra fila e um pra CLI, todos esses drivers enxergando a camada de aplicação que é o Checkout

