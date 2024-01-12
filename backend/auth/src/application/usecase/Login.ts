import { pbkdf2Sync, randomBytes } from "crypto";
import UserRepository from "../repository/UserRepository";
import { sign } from 'jsonwebtoken'
import TokenGenerator from "../../domain/entity/Token";

export default class Login {
    constructor(readonly userRepository: UserRepository) { }

    async execute(input: Input): Promise<Output> {
        const user = await this.userRepository.get(input.email)

        if (user.validatePassword(input.password)) {
            const tokenGenerator = new TokenGenerator("secret")
            return { token: tokenGenerator.sign(user, input.date) }

        } else {
            throw new Error("Authentication failed");
        }

    }


}

type Input = {
    email: string,
    password: string
    date: Date
}
type Output = {
    token: string
}