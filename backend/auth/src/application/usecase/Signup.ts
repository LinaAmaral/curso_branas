import { pbkdf2Sync, randomBytes } from "crypto";
import UserRepository from "../repository/UserRepository";
import User from "../../domain/User";

export default class Signup {
    constructor(readonly userRepository: UserRepository) { }

    async execute(input: Input): Promise<void> {
        if (this.isValid(input.email)) {
            const salt = randomBytes(20).toString("hex");
            const passaword = pbkdf2Sync(input.password, salt, 64, 100, 'sha512').toString("hex")
            const user = new User(input.email, passaword, salt)
            await this.userRepository.save(user);
        }

    }

    isValid(email: string) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }
}

type Input = {
    email: string,
    password: string
}