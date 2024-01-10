import Coupon from "../../src/domain/entity/Coupon";

test("Deve testar se o cupom de desconto é valido", function () {
    const coupon = new Coupon("VALE20", 20, new Date('2023-10-01T10:00:00'));
    expect(coupon.isValid(new Date("2023-03-01T10:00:00"))).toBe(true);
})
test("Deve testar se o cupom de desconto é invalido", function () {
    const coupon = new Coupon("VALE20", 20, new Date('2023-03-01T10:00:00'));
    expect(coupon.isValid(new Date("2023-04-01T10:00:00"))).toBe(false);
})

test("Deve calcular o desconto", function () {
    const coupon = new Coupon("VALE20", 20, new Date('2023-03-01T10:00:00'));
    expect(coupon.calculateDiscont(1000)).toBe(200);
})