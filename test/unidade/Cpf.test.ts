import Cpf from "../../src/backend/domain/entity/Cpf";


const CPF_VALIDO = ["09397879626", "20129841005", "025.787.610-35"];
const CPF_INVALIDO = ["09397879625", "111.111.111-11", "", "0939785479865", "093.978"];
test.each(CPF_VALIDO)("Deve criar um cpf válido", function (cpf: string) {
    expect(new Cpf(cpf)).toBeDefined();
})

test.each(CPF_INVALIDO)("Não deve criar cpf inválido", function (cpf: string) {
    expect(() => new Cpf(cpf)).toThrow(new Error("Invalid cpf"));
})