// ==========================================
// 1. UTILIDADES GLOBALES (Se ejecutan en todas las páginas)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Resaltar automáticamente la página actual en la barra de navegación principal
    const rutaActual = window.location.pathname.split('/').pop() || 'index.html';
    const enlacesNav = document.querySelectorAll('.cabecera nav a');

    enlacesNav.forEach(enlace => {
        const hrefEnlace = enlace.getAttribute('href');
        if (hrefEnlace === rutaActual) {
            enlace.style.fontWeight = 'bold';
            enlace.style.color = '#db5a36'; // Destaca el enlace de la página en la que estás
        }
    });
});
// ==========================================
// 2. LÓGICA DEL LOGIN / REGISTRO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Buscamos los elementos clave de la pantalla de login
    const botonRegistro = document.querySelector('.Boton-Registro');
    const botonIngreso = document.querySelector('.Boton-Ingreso');
    
    const textoRegistro = document.getElementById('Info-Registro');
    const textoIngreso = document.getElementById('Info-Ingreso');
    
    const forms = document.querySelectorAll('.Registro form');
    
    // 2. Verificamos que estamos en login.html (si existen los botones y hay al menos 2 forms)
    if (botonRegistro && botonIngreso && forms.length >= 2) {
        
        const formRegistro = forms[0];
        const formIngreso = forms[1];

        // --- A. LÓGICA DE INTERFAZ (Cambiar pestañas) ---
        
        botonIngreso.addEventListener('click', () => {
            botonRegistro.classList.remove('activo');
            botonIngreso.classList.add('activo');

            textoRegistro.style.display = 'none';
            formRegistro.style.display = 'none';

            textoIngreso.style.display = 'block';
            formIngreso.style.display = 'block';
        });

        botonRegistro.addEventListener('click', () => {
            botonIngreso.classList.remove('activo');
            botonRegistro.classList.add('activo');

            textoIngreso.style.display = 'none';
            formIngreso.style.display = 'none';

            textoRegistro.style.display = 'block';
            formRegistro.style.display = 'block';
        });

        // --- B. LÓGICA DE REDIRECCIÓN (Rutas) ---
        
        // Cuando envían el formulario de "Crear mi cuenta"
        formRegistro.addEventListener('submit', (evento) => {
            evento.preventDefault(); 

            // Averiguamos cuál de los 3 radios (Cliente, Producto, Servicio) está marcado
            const opcionSeleccionada = document.querySelector('input[name="Tipo-Usuario"]:checked');
            
            if (opcionSeleccionada) {
                const tipoUsuario = opcionSeleccionada.value;

                // Redirigimos al perfil correspondiente
                if (tipoUsuario === 'Cliente') {
                    window.location.href = 'perfil-consumidor.html';
                } else if (tipoUsuario === 'Producto') {
                    window.location.href = 'perfil-producto.html';
                } else if (tipoUsuario === 'Servicio') {
                    window.location.href = 'perfil-servicio.html';
                }
            }
        });

        // Cuando envían el formulario de "Ingresar"
        formIngreso.addEventListener('submit', (evento) => {
            evento.preventDefault();
            
            // Al no tener base de datos conectada aún, por defecto lo mandamos al perfil de consumidor para testear.
            window.location.href = 'perfil-consumidor.html';
        });
    }
});
// ==========================================
// 3. LÓGICA DEL CATÁLOGO Y FILTROS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Verificamos si estamos en la página del catálogo
    const contenedorCatalogo = document.getElementById('comercios-disponibles');
    
    if (contenedorCatalogo) {
        const botonesFiltrado = document.querySelectorAll('.boton-filtrado'); // Botones: Todos, Productos, Servicios
        const botonesCategoria = document.querySelectorAll('.boton-categoria'); // Botones: Restaurantes, Farmacia, etc.
        const tarjetas = document.querySelectorAll('.tarjeta-comercio-catalogo');

        // Función maestra que revisa qué botones están activos y oculta/muestra las tarjetas
        function aplicarFiltros() {
            // 1. Averiguamos qué filtros están activos actualmente leyendo nuestra etiqueta secreta
            const tipoActivo = document.querySelector('.boton-filtrado.activo').getAttribute('data-filtro');
            const categoriaActiva = document.querySelector('.boton-categoria.activo').getAttribute('data-filtro');

            // 2. Recorremos cada tarjeta del catálogo una por una
            tarjetas.forEach(tarjeta => {
                const tipoTarjeta = tarjeta.getAttribute('data-tipo');
                const categoriaTarjeta = tarjeta.getAttribute('data-categoria');

                // 3. Evaluamos si la tarjeta coincide con los botones presionados
                const cumpleTipo = (tipoActivo === 'todos') || (tipoActivo === tipoTarjeta);
                const cumpleCategoria = (categoriaActiva === 'todas-categorias') || (categoriaActiva === categoriaTarjeta);

                // 4. Si cumple ambas condiciones, la mostramos. Si no, la ocultamos.
                if (cumpleTipo && cumpleCategoria) {
                    tarjeta.style.display = 'flex'; // La mostramos manteniendo su diseño CSS
                } else {
                    tarjeta.style.display = 'none'; // La ocultamos
                }
            });
        }

        // Le agregamos a cada botón superior la capacidad de hacer clic
        botonesFiltrado.forEach(boton => {
            boton.addEventListener('click', function() {
                // Le quitamos la clase 'activo' a los demás y se la ponemos al presionado
                botonesFiltrado.forEach(b => b.classList.remove('activo'));
                this.classList.add('activo');
                // Llamamos a la función maestra
                aplicarFiltros();
            });
        });

        // Le agregamos a cada botón inferior la capacidad de hacer clic
        botonesCategoria.forEach(boton => {
            boton.addEventListener('click', function() {
                botonesCategoria.forEach(b => b.classList.remove('activo'));
                this.classList.add('activo');
                aplicarFiltros();
            });
        });
    }
});
// ==========================================
// 4. LÓGICA DE PRODUCTOS Y CARRITO (CONTADORES Y TOTALES)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    const controlesCantidad = document.querySelectorAll('.cantidad');
    const botonesBorrar = document.querySelectorAll('.borrar');
    const botonVaciar = document.getElementById('btn-vaciar-todo');
    const seccionCarritoLleno = document.getElementById('Carrito-Lleno');
    const seccionCarritoVacio = document.getElementById('Carrito-Vacio');

    // 0. Inicialización: Si el carrito tiene productos, ocultamos el cartel de "vacío"
    if (seccionCarritoLleno && seccionCarritoVacio) {
        const productosIniciales = document.querySelectorAll('.caja-comercio').length;
        if (productosIniciales > 0) {
            seccionCarritoVacio.style.display = 'none';
        } else {
            seccionCarritoLleno.style.display = 'none';
        }
    }

    // --- 1. Lógica de Sumar y Restar ---
    if (controlesCantidad.length > 0) {
        controlesCantidad.forEach(control => {
            const btnRestar = control.querySelector('.restar');
            const btnSumar = control.querySelector('.sumar');
            const spanNumero = control.querySelector('.numero');

            if (!btnRestar || !btnSumar || !spanNumero) return;

            btnSumar.addEventListener('click', (evento) => {
                evento.preventDefault(); 
                let cantidadActual = parseInt(spanNumero.textContent);
                cantidadActual++; 
                spanNumero.textContent = cantidadActual; 
                
                actualizarPrecioFila(control, cantidadActual);
                actualizarTotalCarrito(); // Recalcula el total general
            });

            btnRestar.addEventListener('click', (evento) => {
                evento.preventDefault();
                let cantidadActual = parseInt(spanNumero.textContent);
                
                if (cantidadActual > 1) {
                    cantidadActual--; 
                    spanNumero.textContent = cantidadActual;
                    
                    actualizarPrecioFila(control, cantidadActual);
                    actualizarTotalCarrito(); // Recalcula el total general
                }
            });
        });
    }

    // --- 2. Lógica para Borrar 1 producto (Tacho de basura) ---
    if (botonesBorrar.length > 0) {
        botonesBorrar.forEach(boton => {
            boton.addEventListener('click', (evento) => {
                evento.preventDefault();
                
                const filaProducto = boton.closest('.producto');
                const cajaComercio = boton.closest('.caja-comercio');
                
                if (filaProducto) {
                    filaProducto.remove(); // Borra el producto de la pantalla
                    
                    // Si eliminaste el último producto de la Parrillada, borramos la caja entera del comercio
                    const productosRestantes = cajaComercio.querySelectorAll('.producto');
                    if (productosRestantes.length === 0) {
                        cajaComercio.remove();
                    }
                    
                    actualizarTotalCarrito();
                    verificarCarritoVacio();
                }
            });
        });
    }

    // --- 3. Lógica para Vaciar TODO el carrito ---
    if (botonVaciar) {
        botonVaciar.addEventListener('click', (evento) => {
            evento.preventDefault();
            const comercios = document.querySelectorAll('.caja-comercio');
            comercios.forEach(comercio => comercio.remove()); // Borra todos
            
            actualizarTotalCarrito();
            verificarCarritoVacio();
        });
    }

    // ==========================================
    // FUNCIONES MAESTRAS DE CÁLCULO
    // ==========================================
    
    function actualizarPrecioFila(controlCantidad, nuevaCantidad) {
        const filaProducto = controlCantidad.closest('.producto');
        if (!filaProducto) return; 

        const textoPrecioUnitario = filaProducto.querySelector('.detalle p'); 
        const elementoPrecioTotal = filaProducto.querySelector('.precio strong');

        if (textoPrecioUnitario && elementoPrecioTotal) {
            let precioLimpio = textoPrecioUnitario.textContent.replace(/[^0-9]/g, ''); 
            let precioUnitario = parseInt(precioLimpio);
            let total = precioUnitario * nuevaCantidad;
            elementoPrecioTotal.textContent = '$ ' + total.toLocaleString('es-AR');
        }
    }

    function actualizarTotalCarrito() {
        // Busca todos los "totales" de los productos que queden vivos en la pantalla
        const preciosProductos = document.querySelectorAll('.producto .precio strong');
        let sumaTotal = 0;

        preciosProductos.forEach(precioTexto => {
            let precioLimpio = precioTexto.textContent.replace(/[^0-9]/g, '');
            sumaTotal += parseInt(precioLimpio || 0); 
        });

        // Actualiza el Resumen de la columna derecha
        const elementoSubtotal = document.querySelector('.columna-derecha .fila:nth-of-type(1) span:nth-of-type(2)');
        const elementoTotal = document.querySelector('.columna-derecha .total strong:nth-of-type(2)');

        if (elementoSubtotal && elementoTotal) {
            const totalFormateado = '$ ' + sumaTotal.toLocaleString('es-AR');
            elementoSubtotal.textContent = totalFormateado;
            elementoTotal.textContent = totalFormateado;
        }
    }

    function verificarCarritoVacio() {
        const cajasComercio = document.querySelectorAll('.caja-comercio');
        // Si ya no quedan comercios, oculta el diseño del carrito y muestra el estado vacío
        if (cajasComercio.length === 0 && seccionCarritoLleno && seccionCarritoVacio) {
            seccionCarritoLleno.style.display = 'none';
            seccionCarritoVacio.style.display = 'flex';
        }
    }
});
// ==========================================
// 5. LÓGICA DEL CHECKOUT (CONFIRMAR PAGO)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Verificamos si estamos en la pantalla de Confirmación
    const seccionConfirmacion = document.getElementById('Confirmacion');
    
    if (seccionConfirmacion) {
        const radioDelivery = document.getElementById('delivery');
        const radioRetiro = document.getElementById('retiro');
        const inputDireccion = document.getElementById('direccion');
        
        // Elementos del Ticket / Resumen
        const filasResumen = document.querySelectorAll('.fila-resumen');
        
        // Nos aseguramos de que las filas existan antes de manipularlas
        if (filasResumen.length >= 2) {
            // El segundo span de la primera fila es el Subtotal ($9.400)
            const spanSubtotal = filasResumen[0].querySelectorAll('span')[1];
            // El segundo span de la segunda fila es el Envío ($1.000)
            const spanEnvio = filasResumen[1].querySelectorAll('span')[1];
            // El total destacado
            const spanTotal = document.querySelector('.precio-destacado');
            
            // Función matemática para actualizar el ticket
            function actualizarTicket(costoEnvio) {
                // Extraemos el subtotal limpiando los símbolos (igual que en el carrito)
                let subtotalLimpio = spanSubtotal.textContent.replace(/[^0-9]/g, '');
                let subtotal = parseInt(subtotalLimpio) || 0;
                
                // Calculamos el nuevo total
                let total = subtotal + costoEnvio;
                
                // Actualizamos la pantalla con formato de moneda
                spanEnvio.textContent = costoEnvio === 0 ? '$ 0' : '$ ' + costoEnvio.toLocaleString('es-AR');
                spanTotal.textContent = '$ ' + total.toLocaleString('es-AR');
            }

            // --- Escuchamos cuándo el usuario cambia el método de entrega ---
            
            radioDelivery.addEventListener('change', () => {
                // 1. Volvemos a hacer obligatoria la dirección
                inputDireccion.setAttribute('required', 'true'); 
                // 2. Sumamos $1.000 de costo de envío
                actualizarTicket(1000); 
            });

            radioRetiro.addEventListener('change', () => {
                // 1. TRUCO VITAL: Quitamos la obligación de la dirección para que el form no se trabe
                inputDireccion.removeAttribute('required'); 
                // 2. El costo de envío pasa a ser cero
                actualizarTicket(0); 
            });
        }
    }
});
// ==========================================
// 6. LÓGICA DE PANELES DE COMERCIO (KANBAN Y CATÁLOGO)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DEL INTERRUPTOR (ACTIVO/PAUSADO) ---
    // Seleccionamos todos los checkboxes de la sección catálogo (aplica para productos y servicios)
    const interruptoresCatalogo = document.querySelectorAll('.estado input[type="checkbox"]');
    
    if (interruptoresCatalogo.length > 0) {
        interruptoresCatalogo.forEach(interruptor => {
            
            // Evaluamos el estado inicial al cargar la página
            const etiqueta = interruptor.nextElementSibling; // El <label> que está al lado
            if (interruptor.checked) {
                etiqueta.textContent = 'ACTIVO';
            } else {
                etiqueta.textContent = 'PAUSADO';
            }

            // Escuchamos cada vez que el comerciante hace clic
            interruptor.addEventListener('change', function() {
                if (this.checked) {
                    etiqueta.textContent = 'ACTIVO';
                } else {
                    etiqueta.textContent = 'PAUSADO';
                }
            });
        });
    }

    // --- 2. LÓGICA DEL TABLERO KANBAN (PEDIDOS / CITAS) ---
    // Buscamos si existe el tablero de pedidos o el de citas
    const tablero = document.querySelector('.tablero-pedidos') || document.querySelector('.tablero-citas');

    if (tablero) {
        // Seleccionamos las 3 columnas: [0]=Pendientes, [1]=Proceso/Camino, [2]=Finalizados
        const columnas = tablero.querySelectorAll('.trabajos');

        // Aplicamos "Delegación de Eventos": Escuchamos los clics en todo el tablero
        tablero.addEventListener('click', (evento) => {
            
            // Verificamos si el clic fue exactamente en un botón de acción
            if (evento.target.classList.contains('accionar')) {
                const boton = evento.target;
                
                // Buscamos la tarjeta completa (.tarjeta-pedidos o .tarjeta-cita) y su columna actual
                const tarjeta = boton.closest('article');
                const columnaActual = tarjeta.closest('.trabajos');

                // Si la tarjeta está en la Columna 0 (Pendientes)
                if (columnaActual === columnas[0]) {
                    // La movemos a la Columna 1 usando appendChild
                    columnas[1].appendChild(tarjeta);
                    // Le cambiamos el texto al botón
                    boton.textContent = 'Finalizar';
                } 
                // Si la tarjeta está en la Columna 1 (En Camino / En Proceso)
                else if (columnaActual === columnas[1]) {
                    // La movemos a la Columna 2 (Entregados / Finalizados)
                    columnas[2].appendChild(tarjeta);
                    // Como ya terminó el ciclo, eliminamos el botón
                    boton.remove(); 
                }
            }
        });
    }
});
