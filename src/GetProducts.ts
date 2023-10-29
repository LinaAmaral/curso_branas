import ProductRepository from "./ProductRepository";
import RepositoryFactory from "./RepositoryFactory";

export default class GetProducts {
    productRepository: ProductRepository

    constructor(repositoryFactory: RepositoryFactory) {
        this.productRepository = repositoryFactory.createProductRepository();
    }

    async execute(): Promise<Output[]> {
        const products = await this.productRepository.list()

        const output: Output[] = [];
        for (const product of products) {
            output.push({
                idProduct: product.idProduct,
                description: product.description,
                price: product.price
            });
        }
        return output;
    }
}

type Output = {
    idProduct: number,
    description: string,
    price: number
}