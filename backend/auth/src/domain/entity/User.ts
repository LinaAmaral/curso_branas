import Email from "./Email";
import Password from "./Password";

//Aggregate root
export default class User {


    private constructor(public email: Email, public password: Password) {
    }

    static create(email: string, password: string) {
        return new User(new Email(email), Password.create(password))
    }

    static restore(email: string, hash: string, salt: string) {
        return new User(new Email(email), Password.restore(hash, salt))
    }

    validatePassword(password: string) {
        return this.password.validate(password);
    }

    //eu recrio o Value Object de senha
    updatePassword(password: string) {
        this.password = Password.create(password)
    }
}