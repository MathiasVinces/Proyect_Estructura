export class TablaTarifas {
  constructor() {
    this.tarifas = [
      { min: 0, max: 1, categoria: "Sobre", precio: 3.5 },
      { min: 1, max: 5, categoria: "Pequeño", precio: 5.5 },
      { min: 5, max: 15, categoria: "Mediano", precio: 12.0 },
      { min: 15, max: 30, categoria: "Grande", precio: 22.5 },
      { min: 30, max: Infinity, categoria: "Especial", precio: 45.0 }
    ];
  }

  obtenerPorIndice(i) {
    return this.tarifas[i] || null;
  }

  calcularTarifa(peso) {
    for (let t of this.tarifas) {
      if (peso >= t.min && peso <= t.max) {
        return t;
      }
    }
    return this.tarifas[4];
  }

  // (ALGORITMO BUBBLE SORT)(Ordena una lista de rutas o tarifas comparando pares adyacentes con complejidad O(n^2))
  bubbleSort(arreglo, clave = 'baseNum', ascendente = true) {
    const arr = [...arreglo];
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const valA = arr[j][clave];
        const valB = arr[j + 1][clave];
        const condicion = ascendente ? valA > valB : valA < valB;
        if (condicion) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;
  }
}
