export enum Cupons {
    BlackFriday = 0.1,
    DiaDasMaes = 0.2,
    Natal = 0.3
}

// const Cupons = {
//     BlackFriday: 0.1,
//     DiaDasMaes: 0.2,
//     Natal: 0.3
// }

export default class Desconto {
    private valorDoDesconto: number;
    constructor() {
        this.valorDoDesconto = 0;
    }

    calcularDesconto(cupom: Cupons, valorTotal: number) {
        this.valorDoDesconto = cupom * valorTotal
    }

    getValorDoDesconto() {
        return this.valorDoDesconto
    }

}