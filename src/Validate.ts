function isInvalidLength(cpf: string) {
    return cpf.length !== 11
}
function isAllDigitsTheSame(cpf: string) {
    return cpf.split("").every(c => c === cpf[0])
}
function sanitaze(cpf: string) {
    return cpf.replace(/\D/g, "");
}
function calculateDigit(cpf: string, factor: number) {
    let total = 0;
    for (const digit of cpf) {
        if (factor > 1) total += parseInt(digit) * factor--;
    }
    const rest = total % 11;
    return (rest < 2) ? 0 : 11 - rest;
}
export function validate(cpf: string) {
    cpf = sanitaze(cpf);
    if (cpf !== null && cpf !== undefined) {
        if (isInvalidLength(cpf)) return false;
        if (isAllDigitsTheSame(cpf)) return false;
        const dg1 = calculateDigit(cpf, 10);
        const dg2 = calculateDigit(cpf, 11);
        let actualCheckDigital = cpf.slice(9);
        const calculatedCheckDigit = `${dg1}${dg2}`;
        return actualCheckDigital === calculatedCheckDigit;
    }
}