import Presenter from "../../infra/presenter/Presenter";
import ProductRepository from "../../application/repository/ProductRepository";
import RepositoryFactory from "../../application/factory/RepositoryFactory";

export default class GetProducts {
    productRepository: ProductRepository

    constructor(repositoryFactory: RepositoryFactory, readonly presenter: Presenter) {
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
        return this.presenter.present(output);
    }
}

type Output = {
    idProduct: number,
    description: string,
    price: number
}