import Checkout from "../../application/usecase/Checkout";
import CsvPresenter from "../presenter/CsvPresenter";
import GetProducts from "../../application/usecase/GetProducts";
import JsonPresenter from "../presenter/JsonPresenter";
import RepositoryFactory from "../../application/factory/RepositoryFactory";
import GatewayFactory from "../../application/factory/GatewayFactory";
import GetOrder from "../../application/usecase/GetOrder";
import Queue from "../queue/Queue";
import AuthDecorator from "../../application/decorator/AuthDecorator";

export default class UsecaseFactory {
    constructor(
        readonly repositoryFactory: RepositoryFactory,
        readonly gatewayFactory: GatewayFactory,
        readonly queue: Queue
    ) { }

    createCheckout() {
        return new AuthDecorator(new Checkout(this.repositoryFactory, this.gatewayFactory, this.queue), this.gatewayFactory)
    }

    //Poderia fazer um LogDecorator, que só dá um console log no input e envolver a linha 17
    //O objetivo do decorator é extenter funcionalidades
    //Aqui estou aperto para extenção e checkout está fechado para alteração

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