export default class Coupon {
    constructor(
        readonly code: string, readonly percentage: number, readonly expireDate: Date
    ) { }

    isValid(today: Date) {
        return this.expireDate.getTime() >= today.getTime();
    }

    calculateDiscont(amount: number) {
        return (amount * this.percentage) / 100
    }
}