import pgp from "pg-promise";
import CouponRepository from "./CouponRepository";

export default class CouponRepositoryDatabase implements CouponRepository {

    async get(code: string) {
        const connection = pgp()("postgres://postgres:12345@localhost:5433/app");
        const [couponData] = await connection.query("select * from cccat11.coupon where code = $1", [code]);
        await connection.$pool.end();
        return couponData;
    }
}