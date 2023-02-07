const valorImpuesto = 0.3;
const valorRetencion = 0.45;
const SALIR = "ESC";
let productos = JSON.parse(localStorage.getItem("producto")) || [];
// let productos = [];
let totales = parseFloat(0);
let totalSuma = parseFloat(0);
console.log(productos);

class Producto {
  constructor(id, descripcion, precio, precioConversion, retencion) {
    this.id = id;
    this.descripcion = descripcion;
    this.precio = parseFloat(precio);
    this.precioConversion = parseFloat(precioConversion);
    this.retencion = parseFloat(retencion);
    this.impuesto = parseFloat(this.impuesto);
    this.totalImpuesto = parseFloat(this.totalImpuesto);
  }
  retenciones() {
    this.retencion = this.precioConversion * valorRetencion;
    return this.retencion;
  }
  impuestoPais() {
    this.impuesto = this.precioConversion * valorImpuesto;
    return this.impuesto;
  }
  valorConImpuestos() {
    this.totalImpuesto = this.precioConversion + this.retencion + this.impuesto;
    return this.totalImpuesto;
  }
  sumaTotal() {
    precioTotalProducto += this.precio;
  }
}

let editando = false;
const formulario = document.querySelector("#formulario");
const descripcionInput = document.querySelector("#descripcion");
const precioInput = document.querySelector("#precio");
const btnAgregar = document.querySelector("#btnAgregar");
const dolarOficial = document.querySelector("#precioDolar");

mostrarProductos();

formulario.addEventListener("submit", cargarCompra);

function cargarCompra(e) {
  // para que no se ejecute de forma automatica
  e.preventDefault();

  if (descripcionInput.value === "" || precioInput.value === "") {
    alert("Todos los campos se deben llenar");
    return;
  }

  if (editando) {
    editarProducto();
    editando = false;
  } else {
    idP = Date.now();
    nombreProducto = descripcionInput.value;
    precioProducto = precioInput.value;
    precioConversion = precioProducto * dolarOficial.value;
    agregarProducto();
  }
}

function agregarProducto() {
  // productos.push({...Producto});

  productos.push(
    new Producto(idP, nombreProducto, precioProducto, precioConversion)
  );
  for (const producto of productos) {
    producto.retenciones();
    producto.impuestoPais();
    producto.valorConImpuestos();
  }


  mostrarProductos();

  formulario.reset();
  limpiarObjeto();
}

function limpiarObjeto() {
  Producto.id = "";
  Producto.descripcion = "";
  Producto.precio = 0;
  Producto.precioConversion = 0;
  productos.retencion = 0;
  totalSuma = 0;
}

function mostrarProductos() {
  //funcion para limpiar el listado y que no se repita con lo creado
  limpiarHTML();
  const divProductos = document.querySelector(".div-productos");
  
  productos.forEach((producto) => {
    const { id, descripcion, precio, precioConversion, retencion, impuesto } =
      producto;

    

    const parrafo = document.createElement("p");
    parrafo.innerHTML = `Descripción ${descripcion} u$d ${precio} $ ${precioConversion} ars 
                         Retención: $ ${retencion}ars  impuesto: ${impuesto} ars`;

    parrafo.dataset.id = id;
    totalSuma = calcularTotal(productos);

    totales = document.querySelector("#total");
    totales.innerHTML = totalSuma;

    //localstorage
    const productoJSON = JSON.stringify(productos);
    localStorage.setItem("producto", productoJSON);

    const editarBoton = document.createElement("button");
    editarBoton.onclick = () => cargarProducto(producto);
    editarBoton.textContent = "Editar";
    editarBoton.classList.add("btn", "btn-editar");
    parrafo.append(editarBoton);

    const eliminarBoton = document.createElement("button");
    eliminarBoton.onclick = () => eliminarProducto(id);
    eliminarBoton.textContent = "Eliminar";
    eliminarBoton.classList.add("btn", "btn-eliminar");
    parrafo.append(eliminarBoton);

    const hr = document.createElement("hr");

    divProductos.appendChild(parrafo);
    divProductos.appendChild(hr);
  });
}

function cargarProducto(producto) {
  const { id, descripcion, precio } = producto;

  Producto.id = id;
  descripcionInput.value = descripcion;
  precioInput.value = precio;

  formulario.querySelector('button[type="submit"]').textContent = "Actualizar";
  editando = true;
}

function editarProducto() {
  Producto.descripcion = descripcionInput.value;
  Producto.precio = precioInput.value;
  Producto.precioConversion = precioInput.value * dolarOficial.value;
  Producto.retencion = Producto.precioConversion * valorRetencion;
  Producto.impuesto = Producto.precioConversion * valorImpuesto;

  productos.map((producto) => {
    if (producto.id === Producto.id) {
      producto.id = Producto.id;
      producto.descripcion = Producto.descripcion;
      producto.precio = Producto.precio;
      producto.precioConversion = Producto.precioConversion;
      producto.retencion = Producto.retencion;
      producto.impuesto = Producto.impuesto;
    }
  });

  limpiarHTML();
  mostrarProductos();

  formulario.reset();
  formulario.querySelector("button[type=submit]").textContent = "Agregar";
  editando = false;
}

function eliminarProducto(id) {
  productos = productos.filter((producto) => producto.id !== id);
 
  limpiarHTML();
  mostrarProductos();
}

function calcularTotal(items) {
  let totalValor = 0;
  for (const item of items) {
    totalValor = parseFloat(totalValor) + parseFloat(item.precio);
  }
  return parseFloat(totalValor);
}

function limpiarHTML() {
  //elementos hijos del divproductos
  const divProductos = document.querySelector(".div-productos");

  //mientras divProd tenga hijos,se eliminaran
  while (divProductos.firstChild) {
    divProductos.removeChild(divProductos.firstChild);
  
    localStorage.clear();
    
  }
}
