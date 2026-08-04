export class Pila {
    constructor() {
        this.historial = [];
    }

    apilar(accion) {
        this.historial.push(accion);
    }

    desapilar() {
        if (this.estaVacia()) return null;
        return this.historial.pop();
    }

    verTope() {
        if (this.estaVacia()) return null;
        return this.historial[this.historial.length - 1];
    }

    estaVacia() {
        return this.historial.length === 0;
    }

    obtenerHistorial() {
        return [...this.historial].reverse();
    }
}