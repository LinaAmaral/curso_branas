//é entidade
// pro clean architecture é tudo entidade

export default class Cpf {
    value: string;
    constructor(readonly cpf: string) {
        if (!this.validate(cpf)) throw new Error("Invalid cpf");
        this.value = cpf;
    }

    isInvalidLength(cpf: string) {
        return cpf.length !== 11
    }
    isAllDigitsTheSame(cpf: string) {
        return cpf.split("").every(c => c === cpf[0])
    }
    sanitaze(cpf: string) {
        return cpf.replace(/\D/g, "");
    }
    calculateDigit(cpf: string, factor: number) {
        let total = 0;
        for (const digit of cpf) {
            if (factor > 1) total += parseInt(digit) * factor--;
        }
        const rest = total % 11;
        return (rest < 2) ? 0 : 11 - rest;
    }
    validate(cpf: string) {
        cpf = this.sanitaze(cpf);
        if (cpf !== null && cpf !== undefined) {
            if (this.isInvalidLength(cpf)) return false;
            if (this.isAllDigitsTheSame(cpf)) return false;
            const dg1 = this.calculateDigit(cpf, 10);
            const dg2 = this.calculateDigit(cpf, 11);
            let actualCheckDigital = cpf.slice(9);
            const calculatedCheckDigit = `${dg1}${dg2}`;
            return actualCheckDigital === calculatedCheckDigit;
        }
    }
}