import { pbkdf2Sync, randomBytes } from "crypto";

export default class Password {
    salt: string
    value: string

    private constructor(password: string, salt: string) {
        this.value = password
        this.salt = salt
    }

    static create(value: string) {
        const salt = randomBytes(20).toString("hex");
        const password = pbkdf2Sync(value, salt, 64, 100, 'sha512').toString("hex")
        return new Password(password, salt)

    }

    static restore(password: string, salt: string) {
        return new Password(password, salt)
    }

    validate(password: string) {
        const value = pbkdf2Sync(password, this.salt, 64, 100, 'sha512').toString("hex")
        return this.value === value
    }
}