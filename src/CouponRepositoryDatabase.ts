import pgp from "pg-promise";
import CouponRepository from "./CouponRepository";
import Coupon from "./Coupon";
import DatabaseConnection from "./DatabaseConnection";

export default class CouponRepositoryDatabase implements CouponRepository {

    constructor(readonly connection: DatabaseConnection) {
    }

    async get(code: string) {
        const [couponData] = await this.connection.query("select * from cccat11.coupon where code = $1", [code]);
        if (!couponData) return undefined;
        return new Coupon(couponData.code, parseFloat(couponData.percentage), couponData.expire_date);
    }
}