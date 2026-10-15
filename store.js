/*
 * store.js — Capa de datos del Filtro Legal.
 *
 * El formulario (encuesta.html) y el panel (admin.html) NO tocan el
 * almacenamiento directamente: solo usan estas funciones.
 *
 * VERSIÓN DEMO: guarda en el navegador (localStorage). Nada sale del equipo
 * de quien usa la página. La primera vez se cargan solicitudes ficticias para
 * que el panel se vea con contenido (ver DEMO_SOLICITUDES).
 *
 * VERSIÓN REAL (pendiente): reescribir solo enviarSolicitud() y
 * listarSolicitudes() para que hagan fetch() a un servidor con base de datos
 * y envío por correo. El formulario y el panel no necesitan cambiar.
 */
const FiltroStore = (() => {
    const CLAVE = 'demo_filtro_solicitudes';
    const CLAVE_SEMILLA = 'demo_filtro_semilla';
    const DIA = 24 * 60 * 60 * 1000;

    // Solicitudes ficticias (nombres y teléfonos inventados; 555-01xx son números de ejemplo).
    // "hace" = cuántos días atrás, para que las fechas siempre se vean recientes.
    const DEMO_SOLICITUDES = [
        { hace: 0.1, estado: 'Nuevo', nombre: 'Carolina Reyes Duarte', whatsapp: '555-010-0111', correo: 'carolina@ejemplo.com',
          area: 'Derecho familiar', descripcion: 'Quiero iniciar el divorcio. Llevamos separados un año y tenemos dos hijos pequeños.',
          etapa: ['Solo tengo dudas / quiero orientación.'], objetivo: 'Saber qué pasos seguir y cuánto tiempo puede tardar.',
          preguntas: '¿Cómo se define la pensión alimenticia?', modalidad: 'Llamada / Videollamada', horario: 'Tarde (16:00 a 18:00)' },
        { hace: 0.9, estado: 'Nuevo', nombre: 'Rodrigo Palacios Ibarra', whatsapp: '555-010-0122', correo: '',
          area: 'Derecho civil', descripcion: 'Mi arrendador quiere desalojarme sin previo aviso, aunque estoy al corriente en los pagos.',
          etapa: ['Existe conflicto con otra persona.'], objetivo: 'Entender mis derechos como inquilino.',
          preguntas: '', modalidad: 'Presencial', horario: 'Mañana (9:00 a 12:00)' },
        { hace: 2, estado: 'Pendiente', nombre: 'Marisol Quintero Vega', whatsapp: '555-010-0133', correo: 'marisol@ejemplo.com',
          area: 'Derecho familiar', descripcion: 'Necesito modificar el convenio de convivencia con mi hijo por un cambio de ciudad.',
          etapa: ['Ya hay proceso legal iniciado.'], objetivo: 'Revisar opciones para ajustar el convenio actual.',
          preguntas: '¿Necesito autorización del juez?', modalidad: 'Indistinto', horario: 'Mediodía (12:00 a 16:00)' },
        { hace: 3, estado: 'Atendido', nombre: 'Héctor Salinas Mora', whatsapp: '555-010-0144', correo: 'hector@ejemplo.com',
          area: 'Derecho civil', descripcion: 'Una persona me debe una cantidad por un préstamo y tengo un pagaré firmado.',
          etapa: ['Existe conflicto con otra persona.', 'No estoy seguro/a.'], objetivo: 'Saber si conviene demandar y cuánto costaría.',
          preguntas: '', modalidad: 'Llamada / Videollamada', horario: 'Tarde (16:00 a 18:00)' },
        { hace: 5, estado: 'Atendido', nombre: 'Daniela Fuentes Ortega', whatsapp: '555-010-0155', correo: '',
          area: 'Otro: Sucesiones', descripcion: 'Falleció mi padre y no hay testamento. Queremos saber cómo se reparte la herencia.',
          etapa: ['Solo tengo dudas / quiero orientación.'], objetivo: 'Conocer el procedimiento y los documentos necesarios.',
          preguntas: '¿Es mejor un trámite notarial o judicial?', modalidad: 'Presencial', horario: 'Mañana (9:00 a 12:00)' },
        { hace: 8, estado: 'Pendiente', nombre: 'Iván Barrera Solís', whatsapp: '555-010-0166', correo: 'ivan@ejemplo.com',
          area: 'Derecho familiar', descripcion: 'Busco reconocer la paternidad de mi hija y establecer un régimen de visitas.',
          etapa: ['Existe conflicto con otra persona.'], objetivo: 'Iniciar el proceso de reconocimiento.',
          preguntas: '', modalidad: 'Indistinto', horario: 'Mediodía (12:00 a 16:00)' }
    ];

    function construirDemo() {
        const ahora = Date.now();
        return DEMO_SOLICITUDES.map(({ hace, ...resto }, i) => ({
            id: 'demo' + i,
            fecha: new Date(ahora - hace * DIA).toISOString(),
            ...resto
        }));
    }

    function leer() {
        try {
            // Primera visita: se cargan las solicitudes de ejemplo.
            if (!localStorage.getItem(CLAVE_SEMILLA)) {
                localStorage.setItem(CLAVE, JSON.stringify(construirDemo()));
                localStorage.setItem(CLAVE_SEMILLA, '1');
            }
            return JSON.parse(localStorage.getItem(CLAVE)) || [];
        } catch (e) {
            return [];
        }
    }

    function nuevoId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    // Guarda una solicitud nueva. Devuelve la solicitud ya con id, fecha y estado.
    async function enviarSolicitud(datos) {
        const solicitud = {
            id: nuevoId(),
            fecha: new Date().toISOString(),
            estado: 'Nuevo',
            ...datos
        };
        const todas = leer();
        todas.unshift(solicitud); // la más reciente primero
        localStorage.setItem(CLAVE, JSON.stringify(todas));
        return solicitud;
    }

    // Devuelve todas las solicitudes, la más reciente primero.
    async function listarSolicitudes() {
        return leer();
    }

    // Solo demo: vuelve a dejar únicamente las solicitudes ficticias de ejemplo.
    async function restablecerDemo() {
        localStorage.setItem(CLAVE, JSON.stringify(construirDemo()));
        localStorage.setItem(CLAVE_SEMILLA, '1');
    }

    return { enviarSolicitud, listarSolicitudes, restablecerDemo };
})();
