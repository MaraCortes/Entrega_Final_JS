
let productos = [];

fetch(`assets/json/productos.json`)
  .then(response => response.json())
  .then(data => {
    productos = data.productos;
    inicializarPagina();
  })

  .catch(error => console.error('Error al cargar los productos', error));

function inicializarPagina() {
  const contenedor = document.getElementById('productos');
  const listaCarrito = document.getElementById('listaCarrito');
  const totalElemento = document.getElementById('total');
  const btnVaciar = document.getElementById('vaciarCarrito');
  const btnFinalizar = document.getElementById('finalizarCompra');
  const iconoCarrito = document.getElementById('iconoCarrito');
  const carritoElemento = document.getElementById('carrito');

  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  let total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
  actualizarTotal();

  const botonesAgregar = {};


  productos.forEach(producto => {
    const div = document.createElement('div');
    div.className = 'image-container fade-in';

    div.innerHTML = `
    <div>  
      <img class="imagenes" src="${producto.imagen}" alt="${producto.nombre}">
    </div>

    <div class="text-image">
      <h2>${producto.nombre}</h2>
      <p class="precio"><strong>$${producto.precio}</strong></p>
      <button class="btnComprar">AGREGAR AL CARRITO</button>
    </div>
  `;

    const boton = div.querySelector('.btnComprar');

    botonesAgregar[producto.nombre] = boton;

    if (carrito.find(p => p.nombre === producto.nombre)) {
      boton.disabled = true;
      boton.textContent = 'EN CARRITO';
    }


    boton.addEventListener('click', () => {
      agregarAlCarrito(producto);
      boton.disabled = true;
      boton.textContent = 'EN CARRITO';
    });

    contenedor.appendChild(div);
  });


  carrito.forEach(prod => crearElementoEnCarrito(prod));

  function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(p => p.nombre === producto.nombre);
    if (productoExistente) {

      return;

    } else {
      producto.cantidad = 1;
      carrito.push(producto);
      crearElementoEnCarrito(producto);
    }
    total += producto.precio;
    actualizarTotal();
    guardarCarrito();
  }

  function crearElementoEnCarrito(producto) {
    const item = document.createElement('li');
    item.dataset.nombre = producto.nombre;

    const nombreSpan = document.createElement('span');
    nombreSpan.textContent = `${producto.nombre} x ${producto.cantidad} - $${producto.precio * producto.cantidad}`;

    const btnMas = document.createElement('button');
    btnMas.textContent = '+';
    btnMas.className = 'btn-mas';

    const btnMenos = document.createElement('button');
    btnMenos.textContent = '-';
    btnMenos.className = 'btn-menos';

    btnMas.addEventListener('click', (e) => {
      e.stopPropagation();
      const productoEnCarrito = carrito.find(p => p.nombre === producto.nombre);
      if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
        nombreSpan.textContent = `${producto.nombre} x ${productoEnCarrito.cantidad} - $${producto.precio * productoEnCarrito.cantidad}`;
        total += producto.precio;
        actualizarTotal();
        guardarCarrito();
      }
    });

    btnMenos.addEventListener('click', (e) => {
      e.stopPropagation();
      const productoEnCarrito = carrito.find(p => p.nombre === producto.nombre);
      if (productoEnCarrito) {
        productoEnCarrito.cantidad--;
        total -= producto.precio;
        if (productoEnCarrito.cantidad === 0) {
          listaCarrito.removeChild(item);
          carrito = carrito.filter(p => p.nombre !== producto.nombre);

          if (botonesAgregar[producto.nombre]) {
            botonesAgregar[producto.nombre].disabled = false;
            botonesAgregar[producto.nombre].textContent = 'AGREGAR AL CARRITO';
          }
        } else {
          nombreSpan.textContent = `${producto.nombre} x ${productoEnCarrito.cantidad} - $${producto.precio * productoEnCarrito.cantidad}`;
        }
        actualizarTotal();
        guardarCarrito();
      }
    });

    item.appendChild(nombreSpan);
    item.appendChild(btnMas);
    item.appendChild(btnMenos);
    listaCarrito.appendChild(item);
  }


  function actualizarElementoCarrito(producto) {
    const item = listaCarrito.querySelector(`li[data-nombre="${producto.nombre}"]`);
    if (item) {
      item.textContent = `${producto.nombre} x${producto.cantidad} - $${producto.precio * producto.cantidad}`;

    }
  }


  function actualizarTotal() {
    totalElemento.textContent = `Total: $${total}`;
  }

  function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }



  iconoCarrito.addEventListener('click', () => {
    if (carritoElemento.style.display === 'block') {
      carritoElemento.style.display = 'none';
    } else {
      carritoElemento.style.display = 'block';
    }
  });


  document.addEventListener('click', () => {
    carritoElemento.style.display = 'none';
  });

  iconoCarrito.addEventListener('click', (event) => {
    event.stopPropagation();
  });


  btnVaciar.addEventListener('click', () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: 'Carrito vacío',
        text: 'El carrito ya está vacío',
        icon: 'info'
      });
      return;
    }


    Swal.fire({
      title: '¿Vaciar todo el carrito?',
      text: 'Esta acción eliminará todos los productos agregados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, vaciar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = [];
        listaCarrito.innerHTML = '';
        total = 0;
        actualizarTotal();
        guardarCarrito();

        Swal.fire(
          'Carrito vacío',
          'Tu carrito ahora no tiene productos.',
          'success'
        );
      }
    });
  });

  // const btnFinalizar = document.createElement('button');
  btnFinalizar.textContent = 'Finalizar Compra';
  btnFinalizar.className = 'btnFinalizar';
  carritoElemento.appendChild(btnFinalizar);


  btnFinalizar.addEventListener('click', () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: 'Carrito vacío',
        text: 'Por favor, agregue un producto para poder realizar una compra.',
        icon: 'info'
      });
      return;
    }


    // Swal.fire({
    //   title: '¿Finalizar compra?',
    //   text: '¿Desea confirmar su compra?',
    //   icon: 'question',
    //   showCancelButton: true,
    //   confirmButtonText: 'Sí, finalizar',
    //   cancelButtonText: 'Cancelar'
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     Swal.fire({
    //       title: '¡Gracias por su compra!',
    //       html: 'Tu pedido ha sido procesado con éxito. <br>Pronto recibirás un correo con los detalles de tu factura.',
    //       icon: 'success',
    //       confirmButtonText: 'Seguir comprando'

    //     });
    //     carrito = [];
    //     listaCarrito.innerHTML = '';
    //     total = 0;
    //     actualizarTotal();
    //     guardarCarrito();
    //     carritoElemento.style.display = 'none';
    //   }
    // });
  });
}


//Modal de checkout
const modalCheckout = document.getElementById('modalCheckout');
const cerrarModalCheckout = document.getElementById('cerrarModalCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const resumenCompra = document.getElementById('resumenCompra');
const totalCheckout = document.getElementById('totalCheckout');


//MOstrar Modal al finalizar Compra
document.getElementById('finalizarCompra').addEventListener('click', function (e){
  e.preventDefault();
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  if (carrito.length === 0) return;


  //COmpletar Resumen
  resumenCompra.innerHTML = '';
  let total = 0;
  carrito.forEach(item => {
    const li = document.createElement('li');
    // li.textContent =  `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}`;
    actualizarElementoCarrito();
    resumenCompra.appendChild(li);
    total += item.precio * item.cantidad;
  });
  totalCheckout.textContent = `Total: $${total}`;

  modalCheckout.style.display = 'block';
});


//Fin MOdal
cerrarModalCheckout.onclick = function() {
  modalCheckout.style.display = 'none';  
};

window.onclick = function(event) {
  if(event.target == modalCheckout) {
    modalCheckout.style.display = 'none';
  }
};

//Evento en el Formulario
checkoutForm.addEventListener('submit', function(e) {
  e.preventDefault();


  //Datos del usuario
  const nombre = document.getElementById('nombre').value;
  const direccion = document.getElementById('direccion').value;
  const email = document.getElementById('email').value;


  //Obtener los productos del carritio
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  let total = 0;

  //Completar el simil recibo
  document.getElementById('reciboNombre').textContent = nombre;
  document.getElementById('reciboDireccion').textContent = direccion;
  document.getElementById('reciboEmail').textContent = email;

  const reciboProductos = document.getElementById('reciboProductos');
  reciboProductos.innerHTML = '';
  carrito.forEach(item => {
    const li = document.createElement('li');

    //  li.textContent = `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad}`;

    actualizarElementoCarrito();

    reciboProductos.appendChild(li);
    total += item.precio * item.cantidad;
  });
  document.getElementById('reciboTotal').textContent = `Total: $${total}`;


  //ocultar el form y mostrar el recibo
  checkoutForm.style.display = 'none';
  document.getElementById('reciboCompra').style.display = 'block';

  //Vaciar el carrito de compras
  localStorage.removeItem('carrito');

  // modalCheckout.style.display = 'none';
  // location.reload(); //refresca para actualizar el carrito?
});

//Cerrar el recibo y el modal
const cerrarReciboBtn = document.getElementById('cerrarRecibo');
if(cerrarReciboBtn) {
  cerrarReciboBtn.addEventListener('click', function() {
    document.getElementById('modalCheckout').style.display = 'none';
    location.reload();
  })
}



      








