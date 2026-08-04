import { Cliente }             from './models/Cliente.js';
import { Paquete }              from './models/Paquete.js';
import { ListaEnlazada }        from './structures/ListaEnlazada.js';
import { TablaTarifas }         from './structures/TablaTarifas.js';
import { Pila }                 from './structures/Pila.js';
import { Cola }                 from './structures/Cola.js';
import { ArbolBinarioBusqueda } from './structures/ArbolBinarioBusqueda.js';
import { Grafo }                from './structures/Grafo.js';

const listaClientes = new ListaEnlazada();
const listaPaquetes = new ListaEnlazada();
const tabla = new TablaTarifas();
const pila  = new Pila();
const cola  = new Cola();
const bst   = new ArbolBinarioBusqueda();
const grafo = new Grafo();
let nextId  = 1;

const $ = id => document.getElementById(id);

// Tabs
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $('tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'rutas') renderSVG();
  };
});

// Toast
function toast(msg, tipo = 'success') {
  const ic = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `${ic[tipo]} ${msg}`;
  $('toasts').appendChild(t);
  setTimeout(() => { t.classList.add('out'); t.addEventListener('animationend', () => t.remove()); }, 3000);
}

function badgeEstado(e) {
  const m = { REGISTRADO:'b-gray', EN_TRANSITO:'b-blue', ENTREGADO:'b-green' };
  return `<span class="badge ${m[e] ?? 'b-gray'}">${e}</span>`;
}

function stats() {
  $('s-pkg').textContent  = listaPaquetes.obtenerTodos().length;
  $('s-cli').textContent  = listaClientes.obtenerTodos().length;
  $('s-cola').textContent = cola.obtenerCola().length;
  let r = 0;
  for (const v of grafo.ciudades.values()) r += v.length;
  $('s-rut').textContent = r / 2;
}

// Clientes
function renderClientes() {
  const data = listaClientes.obtenerTodos();
  $('cli-empty').style.display = data.length ? 'none' : 'block';
  $('tbody-clientes').innerHTML = data.map(c => `
    <tr>
      <td><span class="badge b-gray">#${c.id}</span></td>
      <td style="font-weight:500">${c.nombre}</td>
      <td style="color:var(--muted)">${c.telefono}</td>
      <td>${c.direccion}</td>
      <td style="display:flex;gap:6px;">
        <button class="btn btn-icon" onclick="editarCliente(${c.id})">✏️</button>
        <button class="btn btn-icon btn-danger" onclick="eliminarCliente(${c.id})">🗑</button>
      </td>
    </tr>`).join('');
}

function renderPaquetes() {
  const data = listaPaquetes.obtenerTodos();
  $('pkg-empty').style.display = data.length ? 'none' : 'block';
  $('tbody-paquetes').innerHTML = data.map(p => `
    <tr>
      <td><span class="badge b-blue">#${p.id}</span></td>
      <td style="color:var(--muted)">#${p.clienteId}</td>
      <td>${p.destino}</td>
      <td>${p.peso} kg</td>
      <td>$${p.costo.toFixed(2)}</td>
      <td>${badgeEstado(p.estado)}</td>
    </tr>`).join('');
}

window.editarCliente = id => {
  const c = listaClientes.buscar(id);
  if (!c) return;
  $('modal-title').textContent = 'Editar Cliente';
  $('m-id').value = c.id; $('m-nombre').value = c.nombre;
  $('m-tel').value = c.telefono; $('m-ciudad').value = c.direccion;
  $('modal').classList.add('open');
};

window.eliminarCliente = id => {
  const c = listaClientes.buscar(id);
  listaClientes.eliminar(id);
  pila.apilar(`Eliminó cliente: ${c.nombre}`);
  renderClientes(); renderHistorial(); stats();
  toast(`Cliente "${c.nombre}" eliminado`, 'info');
};

$('btn-add-cliente').onclick = () => {
  $('modal-title').textContent = 'Agregar Cliente';
  $('form-cliente').reset(); $('m-id').value = '';
  $('modal').classList.add('open');
};

$('form-cliente').onsubmit = e => {
  e.preventDefault();
  const nombre = $('m-nombre').value.trim();
  const tel    = $('m-tel').value.trim();
  const ciudad = $('m-ciudad').value.trim() || 'N/A';
  if (!nombre || !tel) return toast('Nombre y teléfono son requeridos', 'warning');
  const id = $('m-id').value;
  if (!id) {
    listaClientes.insertar(new Cliente(nextId++, nombre, tel, ciudad));
    pila.apilar(`Registró cliente: ${nombre}`);
    toast(`Cliente "${nombre}" agregado`);
  } else {
    listaClientes.modificar(Number(id), { nombre, telefono: tel, direccion: ciudad });
    pila.apilar(`Modificó cliente: ${nombre}`);
    toast(`Cliente "${nombre}" actualizado`);
  }
  $('modal').classList.remove('open');
  renderClientes(); renderHistorial(); stats();
};

['btn-close','btn-cancel'].forEach(id => $(id).onclick = () => $('modal').classList.remove('open'));
$('modal').onclick = e => { if (e.target === $('modal')) $('modal').classList.remove('open'); };

// Paquetes
$('form-pkg').onsubmit = e => {
  e.preventDefault();
  const id   = parseInt($('pkg-id').value);
  const cli  = parseInt($('pkg-cli').value);
  const peso = parseFloat($('pkg-peso').value);
  const dest = $('pkg-dest').value.trim();
  if (!id || !cli || !peso || !dest) return toast('Todos los campos son requeridos', 'warning');
  if (bst.buscar(id)) return toast(`Tracking ID #${id} ya existe`, 'error');
  const tarifa = tabla.calcularTarifa(peso);
  const pkg = new Paquete(id, cli, peso, dest, tarifa.precio);
  listaPaquetes.insertar(pkg); bst.insertar(pkg); cola.encolar(pkg);
  pila.apilar(`Registró paquete #${id} → ${dest} (${peso}kg)`);
  $('form-pkg').reset();
  renderCola(); renderHistorial(); renderPaquetes(); stats();
  toast(`Paquete #${id} registrado y encolado`);
};

// BST
$('btn-buscar').onclick = () => {
  const id = parseInt($('bst-input').value);
  if (!id) return toast('Ingresa un ID válido', 'warning');
  const p = bst.buscar(id);
  $('bst-result').classList.add('show');
  if (!p) {
    $('r-id').textContent = `#${id}`;
    ['r-estado','r-destino','r-peso','r-costo','r-cliente'].forEach(f => $(f).textContent = '—');
    return toast(`Paquete #${id} no encontrado`, 'error');
  }
  $('r-id').textContent      = `#${p.id}`;
  $('r-estado').innerHTML    = badgeEstado(p.estado);
  $('r-destino').textContent = p.destino;
  $('r-peso').textContent    = `${p.peso} kg`;
  $('r-costo').textContent   = `$${p.costo.toFixed(2)}`;
  $('r-cliente').textContent = `#${p.clienteId}`;
  toast(`Paquete #${id} localizado 🔍`);
};

// Tarifas
function renderTarifas() {
  $('tariff-list').innerHTML = tabla.tarifas.map((t, i) => `
    <div class="tariff-row" data-i="${i}">
      <div><div class="t-name">${t.categoria}</div><div class="t-range">${t.min}–${t.max === Infinity ? '∞' : t.max} kg</div></div>
      <div class="t-price">$${t.precio.toFixed(2)}</div>
    </div>`).join('');
}

$('btn-calc').onclick = () => {
  const peso = parseFloat($('calc-input').value);
  if (!peso || peso <= 0) return toast('Ingresa un peso válido', 'warning');
  const t = tabla.calcularTarifa(peso);
  $('calc-cat').textContent = t.categoria;
  $('calc-val').textContent = t.precio.toFixed(2);
  $('calc-box').classList.add('show');
  document.querySelectorAll('.tariff-row').forEach(r => r.classList.remove('hl'));
  document.querySelector(`.tariff-row[data-i="${tabla.tarifas.indexOf(t)}"]`)?.classList.add('hl');
};

// Cola
function renderCola() {
  const items = cola.obtenerCola();
  $('queue-track').querySelectorAll('.q-item').forEach(el => el.remove());
  $('q-empty').style.display = items.length ? 'none' : 'block';
  items.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = `q-item${i === 0 ? ' first' : ''}`;
    el.innerHTML = `<div class="q-id">PKG #${p.id}</div><div class="q-dest">📍 ${p.destino}</div><div class="q-peso">⚖️ ${p.peso}kg · $${p.costo.toFixed(2)}</div>`;
    const track = $('queue-track');
    track.appendChild(el);
  });
}

$('btn-despachar').onclick = () => {
  const p = cola.desencolar();
  if (!p) return toast('La cola está vacía', 'warning');
  listaPaquetes.modificar(p.id, { estado: 'EN_TRANSITO' });
  pila.apilar(`Despachó paquete #${p.id} → ${p.destino}`);
  renderCola(); renderHistorial(); renderPaquetes(); stats();
  toast(`Paquete #${p.id} despachado → ${p.destino}`);
};

// Pila / Historial
function renderHistorial() {
  const acciones = pila.obtenerHistorial();
  $('h-list').querySelectorAll('.h-item').forEach(el => el.remove());
  $('h-empty').style.display = acciones.length ? 'none' : 'block';
  acciones.forEach((a, i) => {
    const el = document.createElement('div');
    el.className = 'h-item';
    el.innerHTML = `<div class="h-num">${i + 1}</div><span>${a}</span>`;
    $('h-list').appendChild(el);
  });
}

$('btn-undo').onclick = () => {
  const u = pila.desapilar();
  if (!u) return toast('No hay acciones para deshacer', 'warning');
  renderHistorial();
  toast(`↩ Deshecho: "${u}"`, 'info');
};

// Grafo / SVG
const POSICIONES = {
  'Quito':      { x:420, y:75  },
  'Guayaquil':  { x:140, y:285 },
  'Cuenca':     { x:470, y:255 },
  'Ambato':     { x:310, y:175 },
  'Manta':      { x:65,  y:195 },
  'Loja':       { x:540, y:315 },
  'Esmeraldas': { x:210, y:50  },
  'Portoviejo': { x:80,  y:245 },
};

function getPos(ciudad, idx) {
  if (POSICIONES[ciudad]) return POSICIONES[ciudad];
  const col = idx % 4;
  const row = Math.floor(idx / 4);
  return { x: 80 + col * 160, y: 50 + row * 110 };
}

function svg(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function renderSVG() {
  const eg = $('svg-edges'), ng = $('svg-nodes');
  eg.innerHTML = ng.innerHTML = '';
  if (!grafo.ciudades.size) return;

  const ciudades = [...grafo.ciudades.keys()];
  const vistas   = new Set();

  ciudades.forEach((c, i) => {
    const po = getPos(c, i);
    grafo.ciudades.get(c).forEach(({ destino, distancia }) => {
      const key = [c, destino].sort().join('|');
      if (vistas.has(key)) return;
      vistas.add(key);
      const pd = getPos(destino, ciudades.indexOf(destino));
      const mx = (po.x + pd.x) / 2, my = (po.y + pd.y) / 2;
      const dx = pd.x - po.x, dy = pd.y - po.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const ox = (-dy / len) * 13, oy = (dx / len) * 13;

      eg.appendChild(svg('line', { class:'r-line', x1:po.x, y1:po.y, x2:pd.x, y2:pd.y }));
      eg.appendChild(svg('rect', { x:mx+ox-21, y:my+oy-13, width:42, height:16, rx:4, fill:'white', opacity:.88 }));
      const lbl = svg('text', { class:'r-lbl', x:mx+ox, y:my+oy, 'text-anchor':'middle', 'dominant-baseline':'central' });
      lbl.textContent = `${distancia}km`;
      eg.appendChild(lbl);
    });
  });

  ciudades.forEach((c, i) => {
    const p = getPos(c, i);
    const g = svg('g', { class:'c-node' });
    const tx = svg('text', { class:'c-lbl', x:p.x, y:p.y, 'text-anchor':'middle', 'dominant-baseline':'central' });
    tx.textContent = c.length > 8 ? c.slice(0, 6) + '…' : c;
    g.appendChild(svg('circle', { class:'c-circle', cx:p.x, cy:p.y, r:28 }));
    g.appendChild(tx);
    ng.appendChild(g);
  });
}

function renderRoutes() {
  const cont   = $('route-cards');
  const vistas = new Set();
  cont.innerHTML = '';
  for (const [c, rutas] of grafo.ciudades) {
    rutas.forEach(({ destino, distancia }) => {
      const k = [c, destino].sort().join('|');
      if (vistas.has(k)) return;
      vistas.add(k);
      cont.innerHTML += `<div class="route-card"><div class="rc-cities">${c} ↔ ${destino}</div><div class="rc-km">${distancia}km</div></div>`;
    });
  }
  if (!cont.innerHTML) cont.innerHTML = '<p class="empty">Sin rutas registradas</p>';
  stats();
}

$('form-ruta').onsubmit = e => {
  e.preventDefault();
  const o    = $('ruta-orig').value.trim();
  const d    = $('ruta-dest').value.trim();
  const dist = parseInt($('ruta-km').value);
  if (!o || !d || !dist) return toast('Completa todos los campos', 'warning');
  if (o === d) return toast('Origen y destino no pueden ser iguales', 'warning');
  grafo.agregarRuta(o, d, dist);
  pila.apilar(`Agregó ruta: ${o} ↔ ${d} (${dist}km)`);
  $('form-ruta').reset();
  renderRoutes(); renderSVG(); renderHistorial();
  toast(`Ruta ${o} ↔ ${d} agregada`);
};

// Init
function init() {
  [
    new Cliente(nextId++, 'Carlos Mendoza', '0991234567', 'Quito'),
    new Cliente(nextId++, 'Ana Lucía Ríos', '0987654321', 'Guayaquil'),
    new Cliente(nextId++, 'Beatriz Gómez',  '0955554433', 'Cuenca'),
  ].forEach(c => listaClientes.insertar(c));

  [
    new Paquete(101, 1, 0.8,  'Quito',     tabla.calcularTarifa(0.8).precio),
    new Paquete(105, 2, 12.5, 'Guayaquil', tabla.calcularTarifa(12.5).precio),
    new Paquete(110, 1, 35.0, 'Cuenca',    tabla.calcularTarifa(35.0).precio),
  ].forEach(p => { listaPaquetes.insertar(p); bst.insertar(p); cola.encolar(p); });

  grafo.agregarRuta('Quito',     'Guayaquil', 420);
  grafo.agregarRuta('Quito',     'Cuenca',    460);
  grafo.agregarRuta('Quito',     'Ambato',    138);
  grafo.agregarRuta('Guayaquil', 'Cuenca',    195);
  grafo.agregarRuta('Guayaquil', 'Manta',     190);
  grafo.agregarRuta('Cuenca',    'Loja',      210);

  pila.apilar('Sistema iniciado');
  renderTarifas(); renderClientes(); renderPaquetes();
  renderCola(); renderHistorial(); renderRoutes(); renderSVG(); stats();
}

init();
