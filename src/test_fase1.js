import { Cliente } from './models/Cliente.js';
import { Paquete } from './models/Paquete.js';
import { ListaEnlazada } from './structures/ListaEnlazada.js';
import { TablaTarifas } from './structures/TablaTarifas.js';

console.log("=== PRUEBA FASE 1 (VERSIÓN SIMPLE) ===\n");

// 1. ARREGLO ESTÁTICO DE TARIFAS
console.log("1. TABLA DE TARIFAS (ARREGLO ESTÁTICO)");
const tabla = new TablaTarifas();
console.log("Categoría para 3.5kg:", tabla.calcularTarifa(3.5));

// 2. CRUD DE CLIENTES (LISTA ENLAZADA)
console.log("\n2. CRUD CLIENTES (LISTA ENLAZADA)");
const listaClientes = new ListaEnlazada();
listaClientes.insertar(new Cliente(1, "Carlos Mendoza", "0991234567", "Quito"));
listaClientes.insertar(new Cliente(2, "Ana Ríos", "0987654321", "Guayaquil"));

console.log("Lista inicial:", listaClientes.obtenerTodos());

listaClientes.modificar(1, { telefono: "0999999999" });
console.log("Cliente 1 modificado:", listaClientes.buscar(1));

listaClientes.eliminar(2);
console.log("Lista tras eliminar ID 2:", listaClientes.obtenerTodos());

// 3. REGISTRO DE PAQUETES (LISTA ENLAZADA)
console.log("\n3. REGISTRO DE PAQUETES");
const listaPaquetes = new ListaEnlazada();
const tarifa1 = tabla.calcularTarifa(0.8);
listaPaquetes.insertar(new Paquete(101, 1, 0.8, "Quito", tarifa1.precio));

console.log("Paquetes:", listaPaquetes.obtenerTodos());
console.log("\n=== FASE 1 OK ===");
