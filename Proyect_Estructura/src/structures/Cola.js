export class Cola {
    constructor() {
        this.pedidos = [];
    }

    encolar(paquete) {
        this.pedidos.push(paquete);
    }

    desencolar() {
        if (this.estaVacia()) return null;
        return this.pedidos.shift();
    }

    frente() {
        if (this.estaVacia()) return null;
        return this.pedidos[0];
    }

    estaVacia() {
        return this.pedidos.length === 0;
    }

    obtenerCola() {
        return [...this.pedidos];
    }
}