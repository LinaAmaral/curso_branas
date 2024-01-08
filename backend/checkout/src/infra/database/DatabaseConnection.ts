//Framework and Driver
export default interface DatabaseConnection {
    connect(): Promise<void>;
    query(statement: string, params: any): Promise<any>;
    close(): Promise<void>
}
// O que é uma conexão para o sistemas? Connect, query e close
//Eu tenho uma interface bem definida: é essa interface que vou usar dentro do meu sistemas