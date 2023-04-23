import { validate } from "../src/Validate";

const CPF_VALIDO = ["09397879626", "20129841005", "025.787.610-35"];
const CPF_INVALIDO = ["09397879625", "111.111.111-11", "", "0939785479865", "093.978"];

test.each(CPF_INVALIDO)("Deve testar o cpf inválido %s", function (cpf: string) {
    const isValid = validate(cpf);
    expect(isValid).toBeFalsy();
});

test.each(CPF_VALIDO)("Deve testar o cpf válido %s", function (cpf: string) {
    const isValid = validate(cpf);
    expect(isValid).toBeTruthy();
});