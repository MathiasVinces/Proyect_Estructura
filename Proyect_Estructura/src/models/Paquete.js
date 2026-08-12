export class Paquete {
  constructor(id, clienteId, peso, destino, costo = 0, fecha = null) {
    this.id = id;
    this.clienteId = clienteId;
    this.peso = peso;
    this.destino = destino;
    this.costo = costo;
    this.estado = "REGISTRADO";
    // store ISO timestamp for date-based metrics (e.g., 30-day window)
    this.fecha = fecha || new Date().toISOString();
  }
}
