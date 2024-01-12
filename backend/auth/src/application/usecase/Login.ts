import { pbkdf2Sync, randomBytes } from "crypto";
import UserRepository from "../repository/UserRepository";
import { sign } from 'jsonwebtoken'

export default class Login {
    constructor(readonly userRepository: UserRepository) { }

    async execute(input: Input): Promise<Output> {
        const user = await this.userRepository.get(input.email)
        const passaword = pbkdf2Sync(input.password, user.salt, 64, 100, 'sha512').toString("hex")
        if (user.password === passaword) {
            const expiresIn = 1000000;
            const token = sign({ email: user.email.value, iat: input.date.getTime(), expiresIn }, "secret")
            return { token }

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