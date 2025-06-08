
const productos = [
  { nombre: 'Marquise', precio: 1200, imagen: 'css/img/marquise.jpg' },
  { nombre: 'Lemon Pie', precio: 1350, imagen: 'css/img/cheeseCakeFrutos Rojos.jpg' },
  { nombre: 'Pavlova', precio: 1400, imagen: 'css/img/pavlova.jpg' },
  { nombre: 'Selva Negra', precio: 1500, imagen: 'css/img/selvaNegra.jpg' },
  { nombre: 'Tarta de Frutillas', precio: 1150, imagen: 'css/img/tartaFrutosRojos.jpeg' },
  { nombre: 'Rogel', precio: 1000, imagen: 'css/img/rogel.jpg' },
  { nombre: 'Queso y Naranja', precio: 1200, imagen: 'css/img/quesoNaranja.jpg' },
  { nombre: 'Limón y Arándanos', precio: 1300, imagen: 'css/img/tartaLimonArandanos.jpg' },
  { nombre: 'Tiramisú', precio: 1250, imagen: 'css/img/tiramisu.jpg' }
];



const contenedor = document.getElementById('productos');
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
  carrito.push(producto);
  crearElementoEnCarrito(producto);
  total += producto.precio;
  actualizarTotal();
  guardarCarrito();
}

function crearElementoEnCarrito(producto) {
  const item = document.createElement('li');
  item.textContent = `${producto.nombre} - $${producto.precio}`;

  item.addEventListener('click', () => {
    const confirmar = confirm('¿Eliminar este producto del carrito?');
    if (confirmar) {
      listaCarrito.removeChild(item);
      total -= producto.precio;
      carrito = carrito.filter(p => p !== producto);
      actualizarTotal();
      guardarCarrito();
    }
  });

  listaCarrito.appendChild(item);
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


btnVaciar.addEventListener('click', () => {
  const confirmar = confirm('¿Vaciar todo el carrito?');
  if (confirmar) {
    carrito = [];
    listaCarrito.innerHTML = '';
    total = 0;
    actualizarTotal();
    guardarCarrito();
  }
});


