import { Nodo } from './Nodo.js';

export class ListaEnlazada {
  constructor() {
    this.cabeza = null;
  }

  insertar(dato) {
    const nuevo = new Nodo(dato);
    if (!this.cabeza) {
      this.cabeza = nuevo;
      return;
    }
    let actual = this.cabeza;
    while (actual.siguiente) {
      actual = actual.siguiente;
    }
    actual.siguiente = nuevo;
  }

  buscar(id) {
    let actual = this.cabeza;
    while (actual) {
      if (actual.dato.id == id) return actual.dato;
      actual = actual.siguiente;
    }
    return null;
  }

  modificar(id, nuevosDatos) {
    const elemento = this.buscar(id);
    if (elemento) {
      Object.assign(elemento, nuevosDatos);
      return true;
    }
    return false;
  }

  eliminar(id) {
    if (!this.cabeza) return false;

    if (this.cabeza.dato.id == id) {
      this.cabeza = this.cabeza.siguiente;
      return true;
    }

    let actual = this.cabeza;
    while (actual.siguiente && actual.siguiente.dato.id != id) {
      actual = actual.siguiente;
    }

    if (actual.siguiente) {
      actual.siguiente = actual.siguiente.siguiente;
      return true;
    }
    return false;
  }

  obtenerTodos() {
    const elementos = [];
    let actual = this.cabeza;
    while (actual) {
      elementos.push(actual.dato);
      actual = actual.siguiente;
    }
    return elementos;
  }
}
