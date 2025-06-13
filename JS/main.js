
let productos = [];

fetch(`../assets/json/productos.json`)
  .then(response => response.json())
  .then(data => {
    productos = data.productos;
    inicializarPagina();
  })

  .catch(error => console.error("Error al cargar los productos", error));

function inicializarPagina() {
  const contenedor = document.getElementById(`productos`);
  const listaCarrito = document.getElementById('listaCarrito');
  const totalElemento = document.getElementById('total');
  const btnVaciar = document.getElementById('vaciarCarrito');
  const iconoCarrito = document.getElementById('iconoCarrito');
  const carritoElemento = document.getElementById('carrito');

  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  let total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
  actualizarTotal();



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
      <button class="btnComprar">COMPRAR</button>
    </div>
  `;

    const boton = div.querySelector('.btnComprar');
    boton.addEventListener('click', () => {
      agregarAlCarrito(producto);
    });

    contenedor.appendChild(div);
  });


  carrito.forEach(prod => crearElementoEnCarrito(prod));

  function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(p => p.nombre == producto.nombre);
    if (productoExistente) {
      productoExistente.cantidad = (productoExistente.cantidad || 1) + 1;
      actualizarElementoCarrito(productoExistente);
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
    item.textContent = `${producto.nombre} x ${producto.cantidad} - $${producto.precio * producto.cantidad}`;
    item.dataset.nombre = producto.nombre;

    item.addEventListener('click', () => {
      const confirmar = confirm('¿Eliminar este producto del carrito?');
      if (confirmar) {
        const productoEnCarrito = carrito.find(p => p.nombre === producto.nombre);
        if (productoEnCarrito) {
          productoEnCarrito.cantidad--;

          if (productoEnCarrito.cantidad === 0) {
            listaCarrito.removeChild(item);
            carrito = carrito.filter(p => p.nombre !== producto.nombre);

          } else {
            item.textContent = `${producto.nombre} x${productoEnCarrito.cantidad} - $${producto.precio * productoEnCarrito.cantidad}`;
          }

          total -= producto.precio;
          actualizarTotal();
          guardarCarrito();
        }
      }
    });

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
    Swal.fire({
      title: '¿Vaciar todo el carrito?',
      text: `Esta acción eliminará todos los productos agregados`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Sí, vaciar`,
      cancelButtonText: `Cancelar`
    }).then((result) => {
      if (result.isConfirmed) {
        carrito = [];
        listaCarrito.innerHTML = '';
        total = 0;
        actualizarTotal();
        guardarCarrito();

        Swal.fire(
          `Carrito vaciado`,
          `Tu carrito ahora está vacío.`,
          `success`
        );
      }
    });
  });





  // const confirmar = confirm('¿Vaciar todo el carrito?');
  // if (confirmar) {



  const btnFinalizar = document.createElement(`button`);
  btnFinalizar.textContent = `Finalizar Compra`;

  carritoElemento.appendChild(btnFinalizar);

}




