export default class Produto {

    constructor(readonly descricao: string, readonly preco: number) {
        if (!descricao || !preco) throw new Error("Dados inválidos para instanciar produto")
    }


}