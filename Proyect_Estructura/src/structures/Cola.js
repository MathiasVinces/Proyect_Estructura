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

    eliminarPorId(id) {
        this.pedidos = this.pedidos.filter(p => p.id !== id);
    }

    obtenerCola() {
        return [...this.pedidos];
    }
}