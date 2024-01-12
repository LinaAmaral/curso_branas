import UserRepository from "../../application/repository/UserRepository";
import User from "../../domain/entity/User";
import DatabaseConnection from "../database/DatabaseConnection";

export default class UserRepositoryDatabase implements UserRepository {

    constructor(readonly connection: DatabaseConnection) { }

    async save(user: User): Promise<void> {
        await this.connection.query("insert into cccat11.user (email, password, salt) values ($1, $2, $3)", [user.email.value, user.password.value, user.password.salt])
    }
    async get(email: string): Promise<User> {
        const [userData] = await this.connection.query("select * from cccat11.user where email = $1", [email]);
        return User.restore(userData.email, userData.password, userData.salt);
    }
    async update(user: User): Promise<void> {
        await this.connection.query("update * from cccat11.user set email = $1, password = $2, salt = $3 where email = $1", [user.email, user.password.value, user.password.salt]);
    }

}