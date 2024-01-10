import Product from "./Product";

//É uma entidade (regra de negócio independente)


export default class FreightCalculator {
    static calculate(product: Product) {
        //isso não é responsabilidade de Calcular frete, isso é coisa de produto. É uma regra de negócio independente
        // const volume = product.width / 100 * product.height / 100 * product.length / 100;
        // const density = product.weight / volume;
        let freight = product.getVolume() * 1000 * (product.getDensity() / 100);
        return Math.max(10, freight);
    }
}