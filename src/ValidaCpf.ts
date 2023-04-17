export default class ValidaCpf {
    constructor(cpf: string) {
        if (!this.ehValido(cpf)) throw Error("Cpf invalido")
    }

    ehValido(cpf: string) {
        const cpfClean = cpf.replace(/[^a-zA-Z0-9 ]/g, "");
        if (cpfClean.length != 11) return false;
        const primeiroDigitoVerificador = this.calcularDigitoVerificador(cpf, 9)
        const segundoDigitoVerificador = this.calcularDigitoVerificador(cpf, 10)
        return (primeiroDigitoVerificador === cpf[9] && segundoDigitoVerificador === cpf[10]) ? true : false
    }

    calcularDigitoVerificador(cpf: any, posicao: number): string {
        let somatorioIndiceXDigito = 0;
        for (let index = 1; index <= posicao; index++) {
            somatorioIndiceXDigito += cpf[index - 1] * index
        }
        const restoDaDivisao = somatorioIndiceXDigito % 11;
        return (restoDaDivisao < 2 ? 0 : (11 - restoDaDivisao)).toString();
    }

}