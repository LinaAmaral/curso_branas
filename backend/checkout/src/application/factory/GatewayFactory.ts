//repository factory pq são famílias de repositórios
//esse padrão é muito bom para ser usado com usecases

//é a factory que a aplication conhece de repository

import CatalogGateway from "../gateway/CatalogGateway";
import FreightGateway from "../gateway/FreightGateway";


export default interface GatewayFactory {
    createCatalogGateway(): CatalogGateway;
    createFreightGateway(): FreightGateway;

}