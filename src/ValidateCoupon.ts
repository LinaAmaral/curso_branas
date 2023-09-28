import CouponRepository from "./CouponRepository";

export default class ValidateCoupon {

    constructor(readonly couponRepository: CouponRepository) { }

    async execute(code: string): Promise<Output> {
        let output = {
            isValid: false
        }
        const coupon = await this.couponRepository.get(code)
        const today = new Date();
        if (!coupon) return output;
        output.isValid = coupon.isValid(today)
        return output
    }
}

type Output = {
    isValid: boolean
}