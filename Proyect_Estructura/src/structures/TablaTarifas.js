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

  // ACCESO POR INDÍCE 
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
}
