import DatabaseConnection from "../database/DatabaseConnection";
import RepositoryFactory from "../../application/factory/RepositoryFactory";
import ZipCodeRepository from "../../application/repository/ProductRepository";
import ZipCodeRepositoryDatabase from "../repository/ZipCodeRepositoryDatabase";

export default class DatabaseRepositoryFactory implements RepositoryFactory {

    constructor(readonly connection: DatabaseConnection) { }
    createZipCodeRepository(): ZipCodeRepository {
        return new ZipCodeRepositoryDatabase(this.connection)
    }



}