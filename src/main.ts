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
            total: 0,
            freight: 0
        };
        if (req.body.items) {

            //test
            req.body.items.map(function (item: any) {
                if (item.quantity <= 0) res.json({
                    message: "Invalid quantity"
                });
            })

            //test
            let checkedItems = new Set();
            for (const item of req.body.items) {
                checkedItems.has(item.idProduct) ? res.json({
                    message: "Invalid list items"
                }) : checkedItems.add(item.idProduct)
            }

            for (const item of req.body.items) {
                const [productData] = await connection.query("select * from cccat11.product where id_product = $1", [item.idProduct]);
                //test
                if (!isValidDimension(productData)) { res.json({ message: "Invalid dimension" }) };
                if (!isValidWeight(productData)) { res.json({ message: "Invalid weight" }) };
                const price = parseFloat(productData.price);
                output.total += price * item.quantity;
                output.freight += (calculateFreight(productData) * item.quantity);
            }
        }
        if (req.body.coupon) {
            const [couponData] = await connection.query("select * from cccat11.coupon where code = $1", [req.body.coupon]);
            //test
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

    function isValidDimension(productData: any): boolean {
        return (productData.width < 0 || productData.height < 0 || productData.length < 0) ? false : true;
    }
    function isValidWeight(productData: any): boolean {
        return (productData.weight < 0) ? false : true;
    }
    function calculateFreight(productData: any): number {
        const DISTANCE = 1000;
        const volume = productData.width * productData.height * productData.length;
        const density = productData.weight / volume;
        const freight = (DISTANCE * volume * (density / 100))
        return freight < 10 ? 10 : Math.trunc(freight);
    }
})

