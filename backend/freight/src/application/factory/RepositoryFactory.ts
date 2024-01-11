import ZipCodeRepository from "../repository/ProductRepository";


export default interface RepositoryFactory {
    createZipCodeRepository(): ZipCodeRepository
}