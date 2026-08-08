class NodoArbol {
    constructor(paquete) {
        this.paquete = paquete;
        this.izquierda = null;
        this.derecha = null;
    }
}

export class ArbolBinarioBusqueda {
    constructor() {
        this.raiz = null;
    }

    insertar(paquete) {
        const nuevoNodo = new NodoArbol(paquete);
        if (this.raiz === null) {
            this.raiz = nuevoNodo;
        } else {
            this._insertarNodo(this.raiz, nuevoNodo);
        }
    }

    _insertarNodo(nodo, nuevoNodo) {
        if (nuevoNodo.paquete.id < nodo.paquete.id) {
            if (nodo.izquierda === null) {
                nodo.izquierda = nuevoNodo;
            } else {
                this._insertarNodo(nodo.izquierda, nuevoNodo);
            }
        } else {
            if (nodo.derecha === null) {
                nodo.derecha = nuevoNodo;
            } else {
                this._insertarNodo(nodo.derecha, nuevoNodo);
            }
        }
    }

    buscar(id) {
        return this._buscarNodo(this.raiz, id);
    }

    _buscarNodo(nodo, id) {
        if (nodo === null) return null;
        if (id < nodo.paquete.id) {
            return this._buscarNodo(nodo.izquierda, id);
        } else if (id > nodo.paquete.id) {
            return this._buscarNodo(nodo.derecha, id);
        } else {
            return nodo.paquete;
        }
    }
}