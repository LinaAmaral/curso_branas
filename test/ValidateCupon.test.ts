import CouponRepositoryDatabase from "../src/CouponRepositoryDatabase";
import ValidateCoupon from "../src/ValidateCoupon";

test("Deve validar o cupon de desconto", async function () {
    const input = "VALE20";
    const couponRepository = new CouponRepositoryDatabase()
    const validateCoupon = new ValidateCoupon(couponRepository);
    const output = await validateCoupon.execute(input)
    expect(output.isValid).toBe(true)

})
test("Deve validar o cupon de desconto expirado", async function () {
    const input = "VALE10";
    const couponRepository = new CouponRepositoryDatabase()
    const validateCoupon = new ValidateCoupon(couponRepository);
    const output = await validateCoupon.execute(input)
    expect(output.isValid).toBe(false)

})