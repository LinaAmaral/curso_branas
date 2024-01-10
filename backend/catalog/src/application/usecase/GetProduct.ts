import ProductRepository from "../repository/ProductRepository";
import RepositoryFactory from "../factory/RepositoryFactory";

export default class GetProduct {
    productRepository: ProductRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.productRepository = repositoryFactory.createProductRepository();
    }

    async execute(idProduct: number): Promise<Output> {
        const product = await this.productRepository.get(idProduct);
        return Object.assign(product, {
            volume: product.getVolume(),
            density: product.getDensity()
        });
    }

}

type Output = {
    idProduct: number,
    description: string,
    price: number,
    width: number,
    height: number,
    length: number,
    weight: number,
    volume: number,
    density: number
}