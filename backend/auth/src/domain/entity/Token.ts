import { sign, verify } from 'jsonwebtoken'
import User from './User';

//Doman service: faz parte do domínio gerar um token, então ele é um serviço de domínio
export default class TokenGenerator {
    EXPIRES_IN = 1000000;

    constructor(readonly key: string) { }

    sign(user: User, date: Date) {
        const token = sign({ email: user.email.value, iat: date.getTime(), expiresIn: this.EXPIRES_IN }, this.key)
        return token
    }

    verify(token: string): any {
        return verify(token, this.key)
    }
}