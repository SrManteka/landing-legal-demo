/*
 * nav.js — Menú desplegable para pantallas pequeñas.
 * El botón (hamburguesa) alterna la clase "open" en la barra de navegación.
 * Se cierra al elegir un enlace o al presionar Escape.
 */
(function () {
    const navbar = document.getElementById('navbar');
    const boton = document.getElementById('nav-toggle');
    const enlaces = document.getElementById('nav-links');
    if (!navbar || !boton || !enlaces) return;

    function establecer(abierto) {
        navbar.classList.toggle('open', abierto);
        boton.setAttribute('aria-expanded', String(abierto));
        boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    }

    boton.addEventListener('click', () => establecer(!navbar.classList.contains('open')));
    enlaces.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') establecer(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') establecer(false);
    });
})();
