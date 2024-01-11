import ZipCodeRepository from "../repository/ProductRepository";

//interface da fábrica, tudo que ela cria, que são repositórios no caso
export default interface RepositoryFactory {
    createZipCodeRepository(): ZipCodeRepository
}