import UserRepository from "../../application/repository/UserRepository";
import User from "../../domain/User";
import DatabaseConnection from "../database/DatabaseConnection";

export default class UserRepositoryDatabase implements UserRepository {

    constructor(readonly connection: DatabaseConnection) { }

    async save(user: User): Promise<void> {
        await this.connection.query("insert into cccat11.user (email, password, salt) values ($1, $2, $3)", [user.email, user.password, user.salt])
    }
    async get(email: string): Promise<User> {
        const [userData] = await this.connection.query("select * from cccat11.user where email = $1", [email]);
        return new User(userData.email, userData.password, userData.salt);
    }

}