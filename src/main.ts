import express, { Request, Response } from "express";
import { validate } from "./Validate";
import pgp from 'pg-promise';
const app = express();
app.listen(3000);
console.log("Rodando na porta", 3000)
app.use(express.json());
app.post("/checkout", async function (req: Request, res: Response) {
    if (validate(req.body.cpf)) {
        const connection = pgp()("postgres://postgres:12345@localhost:5433/app");
        const output = {
            total: 0
        };
        if (req.body.items) {

            req.body.items.map(function (item: any) {
                if (item.quantity <= 0) res.json({
                    message: "Invalid quantity"
                });
            })

            for (const item of req.body.items) {
                const [productData] = await connection.query("select * from cccat11.product where id_product = $1", [item.idProduct]);
                const price = parseFloat(productData.price);
                output.total += price * item.quantity;
            }
        }
        if (req.body.coupon) {
            const [couponData] = await connection.query("select * from cccat11.coupon where code = $1", [req.body.coupon]);
            console.log("Resultado:", couponData.expiration <= new Date())
            if (couponData.expiration <= new Date()) res.json({
                message: "Invalid coupon"
            });
            output.total -= (output.total * parseFloat(couponData.percentage)) / 100;
        }
        res.json(output);
    } else {
        res.json({
            message: "Invalid cpf"
        });
    }
})