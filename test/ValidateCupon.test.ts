import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import ValidateCoupon from "../src/ValidateCoupon";

let validateCoupon: ValidateCoupon

beforeEach(() => {
    const repositoryFactory = new DatabaseRepositoryFactory()
    validateCoupon = new ValidateCoupon(repositoryFactory);

})
test("Deve validar o cupon de desconto", async function () {
    const input = "VALE20";
    const output = await validateCoupon.execute(input)
    expect(output.isValid).toBe(true)

})
test("Deve validar o cupon de desconto expirado", async function () {
    const input = "VALE10";
    const output = await validateCoupon.execute(input)
    expect(output.isValid).toBe(false)

})