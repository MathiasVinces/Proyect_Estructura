export class Paquete {
  constructor(id, clienteId, peso, destino, costo = 0) {
    this.id = id;
    this.clienteId = clienteId;
    this.peso = peso;
    this.destino = destino;
    this.costo = costo;
    this.estado = "REGISTRADO";
  }
}
