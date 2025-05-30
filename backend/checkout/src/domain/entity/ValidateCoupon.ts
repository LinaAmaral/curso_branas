import CouponRepository from "../../application/repository/CouponRepository";
import RepositoryFactory from "../../application/factory/RepositoryFactory";

export default class ValidateCoupon {
    couponRepository: CouponRepository

    constructor(repositoryFactory: RepositoryFactory) {
        this.couponRepository = repositoryFactory.createCouponRepository();
    }

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