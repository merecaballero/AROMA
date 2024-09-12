document.addEventListener('DOMContentLoaded', function() { //Se indica que se comenzará a ejecutar el codigo una vez se inicializa la página
    //Si nos encontramos en una página donde hay un elemento con id 'noticias' quiere decir que estamos en 'index.html'
    //y se deben cargar las noticias que se encuentran en 'noticias.json' e insertarlas en el apartado correspondiente
    if(document.getElementById("noticias")){ 
        // Cargar noticias desde JSON
        fetch('data/noticias.json')
        .then(response => response.json())
        .then(data => {
            let noticias = document.getElementById('noticias');
            data.forEach(noticia => {
                console.log(noticia);
                //Inserta las noticias en el apartado creado para ello
                let noticiaElement = document.createElement('div');
                noticiaElement.classList.add('noticia');
                noticiaElement.innerHTML = `<h3>${noticia.titulo}</h3><p>${noticia.contenido}</p>`;
                noticias.appendChild(noticiaElement);
            });
        });
    }
    
    //Si nos encontramos en una página que tiene un elemento con id 'presupuestoForm' quiere decir que nos encontramos
    //en 'presupuesto.html' por lo que mediante JS vamos a calcular el precio para imprimirlo en el formulario (a tiempo real)
    //y se va a comprobar que se cumplen las condiciones establecidas para cada apartado del formulario
    if(document.getElementById("presupuestoForm")){
        //Cálculo del presupuesto:
        const form = document.getElementById('presupuestoForm');
        const totalElement = document.getElementById('total');

        form.addEventListener('input', function() {
            let total = 0;
            const producto = document.getElementById('producto').value;
            const plazo = parseInt(document.getElementById('plazo').value);
            const extras = document.querySelectorAll('input[name="extra"]:checked');
            const descuentos = 0.1; // 10% de descuento por cada mes

            switch (producto) {
                case 'no-select': total += 0; break;
                case 'producto1': total += 230; break;
                case 'producto2': total += 200; break;
                case 'producto3': total += 300; break;
                case 'producto4': total += 150; break;
                case 'producto5': total += 270; break;
            }

            extras.forEach(extra => {
                total += parseInt(extra.value);
            });

            if (plazo) {
                total -= total * (descuentos * plazo);
            }
            //Se imprime el precio al mismo tiempo que se realizan modificaciones en el formulario
            totalElement.textContent = `${total.toFixed(2)}€`;
        });

        //Validación de las condiciones una vez se pulsa el boton enviar ('submit')
        form.addEventListener('submit', function(event) {
            const nombre = document.getElementById('nombre').value;
            const apellidos = document.getElementById('apellidos').value;
            const telefono = document.getElementById('telefono').value;
            const email = document.getElementById('email').value;
            const condiciones = document.getElementById('condiciones').checked;

            const nombreValido = /^[a-zA-Z]{1,15}$/.test(nombre);
            const apellidosValidos = /^[a-zA-Z\s]{1,40}$/.test(apellidos);
            const telefonoValido = /^[0-9]{9}$/.test(telefono);
            const emailValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

            //Para indicar mediante un alert que alguna de las condiciones establecidas no se han cumplido
            if (!nombreValido || !apellidosValidos || !telefonoValido || !emailValido || !condiciones || producto=="no-select") {
                alert('Por favor, completa correctamente todos los campos.');
                event.preventDefault();
            }

            //Para indicar mediante un alert que condicion específica no se ha cumplido
            if(!nombreValido){
                alert("Nombre invalido")
            } else if (!apellidosValidos){
                alert("Apellidos invalidos")
            } else if (!telefonoValido){
                alert("Telefono invalido")
            } else if (!emailValido){
                alert("Correo electrónico invalido")
            } else if(!condiciones){
                alert("Para continuar debe aceptar la política de privacidad")
            } else if(producto == "no-select"){
                alert("Debe seleccionar un producto")
            }
        });

        //Para resetear el precio que se indica en el formulario cuando se presiona sobre el boton 'reset'
        form.addEventListener('reset',function(event){
            totalElement.textContent = "0€";
        })
    };
});

//Si nos encontramos en una página donde hay un elemento con id 'gallery' quiere decir que estamos en 'galeria.html'
//se utiliza el código JS para crear la galería dinámica
if(document.getElementById("gallery")){
    let currentIndex = 0;
    //Sentido en el que se van a mover las imágenes en función del botón que se presione
    document.querySelector('.prev-button').addEventListener('click', () => {
        navigate(-1);
    });

    document.querySelector('.next-button').addEventListener('click', () => {
        navigate(1);
    });

    //Función para marcar el desplzamiento de las imágenes, ajustado para una correcta visualización
    function navigate(direction) {
        const galleryContainer = document.querySelector('.gallery-container');
        const totalImages = document.querySelectorAll('.gallery-item').length;
    
        currentIndex = (currentIndex + direction + totalImages) % totalImages;
        const offset = -currentIndex * 105;
    
        galleryContainer.style.transform = `translateX(${offset}%)`;
    }

    //AUTOPLAY, las imágenes se van pasando solas hasta que el usuario presione uno de los botones de paso de imágen (flechas)
    let autoplayInterval = null;
    //Función para inicializar el autoplay
    function startAutoplay(interval) {
        stopAutoplay();  // Detiene cualquier autoplay anterior para evitar múltiples intervalos.
        autoplayInterval = setInterval(() => {
            navigate(1);  // Navega a la siguiente imagen cada intervalo de tiempo.
        }, interval);
    }
    //Función para cortar el autoplay
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // Iniciar autoplay con un intervalo de 3 segundos.
    startAutoplay(3000);

    // Detener autoplay cuando el usuario interactúa con los botones de navegación.
    document.querySelectorAll('.nav-button').forEach(button => {
        button.addEventListener('click', stopAutoplay);
    });
}

//Si nos encontramos en una página donde hay un elemento con id 'map' quiere decir que estamos en 'contacto.html'
//mediante estas funciones de JS se establece el mapa en la localización donde se encuentra el negocio y se genera
//la ruta desde la ubicación del usuario a la ubicación del negocio, realizado mediante OpenStreetMaps
if(document.getElementById("map")){

    // Inicializar el mapa
    const map = L.map('map').setView([38.344141, -0.48661], 13); // Coordenadas de Alicante

    // Agregar una capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Coordenadas del negocio
    const businessLocation = [38.344141, -0.48661]; // Calle Gerona, 27, Alicante

    // Marcar la ubicación del negocio
    L.marker(businessLocation).addTo(map)
        .bindPopup('Calle Gerona, 27, Alicante')
        .openPopup();

    // Configurar el plugin de enrutamiento
    const routingControl = L.Routing.control({
        waypoints: [],
        createMarker: function() { return null; }, // Ocultar marcador de ruta
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim() // Geocodificación para la ubicación del cliente
    }).addTo(map);

    // Función para obtener la ubicación del cliente y calcular la ruta
    function calculateRoute() {
        // Obtener la ubicación del cliente usando la API de geolocalización
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const customerLocation = [position.coords.latitude, position.coords.longitude];

                // Actualizar el control de enrutamiento con la nueva ruta
                routingControl.setWaypoints([
                    L.latLng(customerLocation[0], customerLocation[1]),
                    L.latLng(businessLocation[0], businessLocation[1])
                ]);

                // Centrar el mapa en la ubicación del cliente
                map.setView(customerLocation, 13);

                // Agregar un marcador para la ubicación del cliente
                L.marker(customerLocation).addTo(map)
                    .bindPopup('Tu ubicación')
                    .openPopup();
            }, () => {
                alert('No se pudo obtener la ubicación. Asegúrate de permitir la geolocalización.');
            });
        } else {
            alert('La geolocalización no está soportada por este navegador.');
        }
    }

    // Llamar a la función para calcular la ruta
    calculateRoute();
}