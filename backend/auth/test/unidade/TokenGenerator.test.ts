import TokenGenerator from "../../src/domain/entity/Token";
import User from "../../src/domain/entity/User";

test("Deve assinar um token", function () {
    const tokenGenerator = new TokenGenerator("secret");
    const user = User.create('joao@gmail.com', 'abc123');
    const token = tokenGenerator.sign(user, new Date("2022-03-01T10:00:00"));
    expect(token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvYW9AZ21haWwuY29tIiwiaWF0IjoxNjQ2MTM5NjAwMDAwLCJleHBpcmVzSW4iOjEwMDAwMDB9.aHf1geyFbypi_-xreacJmHo8Fhh7c2hBdok_KCkEsG4')
})

test("Deve verificar um token", function () {
    const tokenGenerator = new TokenGenerator("secret");
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvYW9AZ21haWwuY29tIiwiaWF0IjoxNjQ2MTM5NjAwMDAwLCJleHBpcmVzSW4iOjEwMDAwMDB9.aHf1geyFbypi_-xreacJmHo8Fhh7c2hBdok_KCkEsG4';
    const output = tokenGenerator.verify(token)
    expect(output.email).toBe('joao@gmail.com')
})

//em algum momento esse token vai expirar!!