export class Grafo {
    constructor() {
        this.ciudades = new Map();
    }

    agregarCiudad(ciudad) {
        if (!this.ciudades.has(ciudad)) {
            this.ciudades.set(ciudad, []);
        }
    }

    agregarRuta(origen, destino, distancia) {
        if (!this.ciudades.has(origen)) this.agregarCiudad(origen);
        if (!this.ciudades.has(destino)) this.agregarCiudad(destino);

        this.ciudades.get(origen).push({ destino, distancia });
        this.ciudades.get(destino).push({ destino: origen, distancia });
    }

    obtenerRutasDesde(ciudad) {
        return this.ciudades.get(ciudad) || [];
    }

    obtenerTodasLasRutas() {
        const reporte = [];
        for (let [ciudad, adyacencias] of this.ciudades) {
            const rutasStr = adyacencias.map(a => `${a.destino} (${a.distancia}km)`).join(', ');
            reporte.push(`De ${ciudad} puedes ir a: ${rutasStr}`);
        }
        return reporte;
    }
}