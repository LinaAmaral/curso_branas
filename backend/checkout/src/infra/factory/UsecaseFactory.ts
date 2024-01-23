import Checkout from "../../application/usecase/Checkout";
import CsvPresenter from "../presenter/CsvPresenter";
import GetProducts from "../../application/usecase/GetProducts";
import JsonPresenter from "../presenter/JsonPresenter";
import RepositoryFactory from "../../application/factory/RepositoryFactory";
import GatewayFactory from "../../application/factory/GatewayFactory";
import GetOrder from "../../application/usecase/GetOrder";

export default class UseCaseFactory {
    constructor(
        readonly repositoryFactory: RepositoryFactory,
        readonly gatewayFactory: GatewayFactory
    ) { }

    createCheckout() {
        return new Checkout(this.repositoryFactory, this.gatewayFactory)
    }

    createGetProducts(type: string) {
        let presenter;
        if (type === "application/json") {
            presenter = new JsonPresenter();
        }
        if (type === "text/csv") {
            presenter = new CsvPresenter();
        }
        if (!presenter) throw new Error("Invalid type");
        return new GetProducts(this.repositoryFactory, presenter);
    }

    createGetOrder() {
        return new GetOrder(this.repositoryFactory,
            this.gatewayFactory
        );
    }
}