import DatabaseRepositoryFactory from "../../src/infra/factory/DatabaseRepositoryFactory";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import ValidateCoupon from "../../src/domain/entity/ValidateCoupon";

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