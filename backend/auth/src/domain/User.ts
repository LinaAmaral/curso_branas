import Email from "./Email";
import { pbkdf2Sync, randomBytes } from "crypto";

export default class User {
    email: Email
    password: string
    salt: string

    private constructor(email: string, password: string, salt: string) {
        this.email = new Email(email)
        this.password = password
        this.salt = salt

    }

    static create(email: string, password: string) {
        const salt = randomBytes(20).toString("hex");
        const hash = pbkdf2Sync(password, salt, 64, 100, 'sha512').toString("hex")
        return new User(email, hash, salt)
    }

    static restore(email: string, hash: string, salt: string) {
        return new User(email, hash, salt)
    }
}