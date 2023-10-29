import DatabaseRepositoryFactory from "../src/DatabaseRepositoryFactory";
import PgPromiseAdapter from "../src/PgPromiseAdapter";
import ValidateCoupon from "../src/ValidateCoupon";

let validateCoupon: ValidateCoupon
const connection = new PgPromiseAdapter();

beforeEach(async () => {
    connection.connect();
    const repositoryFactory = new DatabaseRepositoryFactory(connection)
    validateCoupon = new ValidateCoupon(repositoryFactory);

})

afterEach(async () => {
    await connection.close();
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