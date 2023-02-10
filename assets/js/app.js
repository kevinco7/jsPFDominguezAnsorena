const valorImpuesto = 0.3;
const valorRetencion = 0.45;
const valorBienesPersonales = 0.25;
const SALIR = "ESC";
let productos = JSON.parse(localStorage.getItem("producto")) || [];
// let productos = [];
let totalSuma = parseFloat(0).toFixed(2);
let totalSI = parseFloat(0).toFixed(2);
let bienesPersonales =  parseFloat(0).toFixed(2);
class Producto {
  constructor(
    id,
    descripcion,
    precio,
    precioConversion,
    retencion,
    impuesto,
    totalImpuesto
  ) {
    this.id = id;
    this.descripcion = descripcion;
    this.precio = parseFloat(precio).toFixed(2);
    this.precioConversion = parseFloat(precioConversion).toFixed(2);
    this.retencion = parseFloat(retencion).toFixed(2);
    this.impuesto = parseFloat(impuesto).toFixed(2);
    this.totalImpuesto = parseFloat(totalImpuesto).toFixed(2);
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
formulario.reset();
limpiarObjeto();
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
    retencion = precioConversion * valorRetencion;
    impuesto = precioConversion * valorImpuesto;
    totalImpuesto = precioConversion + retencion + impuesto;

    agregarProducto();
  }
}

function agregarProducto() {
  // productos.push({...Producto});

  productos.push(
    new Producto(
      idP,
      nombreProducto,
      precioProducto,
      precioConversion,
      retencion,
      impuesto,
      totalImpuesto
    )
  );
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
  const $cuerpoTabla = document.querySelector("#cuerpoTabla");
  const $cuerpoTotales = document.querySelector("#cuerpoTotales");
  productos.forEach((producto) => {
    const {
      id,
      descripcion,
      precio,
      precioConversion,
      retencion,
      impuesto,
      totalImpuesto,
    } = producto;

    const parrafo = document.createElement("p");
    parrafo.innerHTML = `Descripción ${descripcion} u$d ${precio} $ ${precioConversion} ars 
                         Retención: $ ${retencion} ars impuesto: $ ${impuesto} ars total: $ ${totalImpuesto} ars `;

    parrafo.dataset.id = id;

    // totalSuma = calcularTotal(productos);
    // totales = document.querySelector("#total");
    // totales.innerHTML = totalSuma;

    //localstorage
    const productoJSON = JSON.stringify(productos);
    localStorage.setItem("producto", productoJSON);



    
    // const editarBoton = document.createElement("button");
    // editarBoton.onclick = () => cargarProducto(producto);
    // editarBoton.textContent = "Editar";
    // editarBoton.classList.add("btn", "btn-editar");
    // parrafo.append(editarBoton);
    
    // const eliminarBoton = document.createElement("button");
    // eliminarBoton.onclick = () => eliminarProducto(id);
    // eliminarBoton.textContent = "Eliminar";
    // eliminarBoton.classList.add("btn", "btn-eliminar");
    // parrafo.append(eliminarBoton);
    
    // const hr = document.createElement("hr");
    
    // divProductos.appendChild(parrafo);
    // divProductos.appendChild(hr);
    
    //tabla de productos
    const $tr = document.createElement("tr");    
    let tdNombre = document.createElement("td");
    tdNombre.textContent = producto.descripcion; 
    $tr.appendChild(tdNombre);   
    let tdPrecio = document.createElement("td");
    tdPrecio.textContent =`u$d ${producto.precio}`;
    $tr.appendChild(tdPrecio);    
    let tdPrecioSI = document.createElement("td");
    tdPrecioSI.textContent = `$ ${producto.precioConversion}`;
    $tr.appendChild(tdPrecioSI); 
    let tdRetencion = document.createElement("td");
    tdRetencion.textContent = `$ ${producto.retencion}`;
    $tr.appendChild(tdRetencion); 
    let tdImpuestos = document.createElement("td");
    tdImpuestos.textContent = `$ ${producto.impuesto}`;
    $tr.appendChild(tdImpuestos); 
    let tdPrecioCI = document.createElement("td");
    tdPrecioCI.textContent = `$ ${producto.totalImpuesto}`;
    $tr.appendChild(tdPrecioCI); 
    
    let tdEditar = document.createElement("button");
    tdEditar.onclick = () => cargarProducto(producto);
    tdEditar.textContent = "Editar";
    tdEditar.classList.add("btn", "btn-editar");
    $tr.appendChild(tdEditar); 

    let tdEliminar = document.createElement("button");
    tdEliminar.onclick = () => eliminarProducto(id);
    tdEliminar.textContent = "Eliminar";
    tdEliminar.classList.add("btn", "btn-eliminar");
    $tr.appendChild(tdEliminar);
    
    $cuerpoTabla.appendChild($tr);
    
    //tabla de totales
    Totales();
    });
  }
  
function Totales(){
     totalSuma = calcularTotal(productos);
     let totales = document.querySelector("#PrecioTotal");
     totales.innerHTML = `u$d ${totalSuma}`;

     totalSI = calcularTotalSinImpuesto(productos);
     let totalesSI = document.querySelector("#TotalSinImpuestos");
     totalesSI.innerHTML = `$ ${totalSI}`;

     let impPais = parseFloat(calcularTotalImpuestoPais(productos)).toFixed(2);     
     let totalImpPais = document.querySelector("#totalImpuestos");
     totalImpPais.innerHTML = `$ ${impPais}`;
     let ImpRet = parseFloat(calcularTotalRetencion(productos)).toFixed(2);
     let totalRetenciones = document.querySelector("#totalRetenciones");
     totalRetenciones.innerHTML = `$ ${ImpRet}`; 

      let bienes = parseFloat(calcularImpuesto25(productos)).toFixed(2);
      let totalBienesPersonales = document.querySelector("#totalBienes");
      totalBienesPersonales.innerHTML = `$ ${bienes}`; 

     let gastoTotal = parseFloat(calcularGastoTotal(productos)).toFixed(2);
     let totalDeGasto = document.querySelector("#totalGasto");
     totalDeGasto.innerHTML = `$ ${gastoTotal}`; 
      

     
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
  Producto.totalImpuesto = Producto.precioConversion + Producto.retencion + Producto.impuesto;

  productos.map((producto) => {
    if (producto.id === Producto.id) {
      producto.id = Producto.id;
      producto.descripcion = Producto.descripcion;
      producto.precio = Producto.precio;
      producto.precioConversion = Producto.precioConversion;
      producto.retencion = Producto.retencion;
      producto.impuesto = Producto.impuesto;
      producto.totalImpuesto = Producto.totalImpuesto;
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

function calcularTotalSinImpuesto(items) {
  let totalValorSI = 0;
  for (const item of items) {
    totalValorSI = parseFloat(totalValorSI) + parseFloat(item.precioConversion);
  }
  return parseFloat(totalValorSI);
}

function calcularTotalRetencion(items) {
  let totalValorRetenciones = 0;
  for (const item of items) {
    totalValorRetenciones = parseFloat(totalValorRetenciones) + parseFloat(item.retencion);
  }
  return parseFloat(totalValorRetenciones);
}

function calcularTotalImpuestoPais(items) {
  let totalValorimpuesto = 0;
  for (const item of items) {
    totalValorimpuesto = parseFloat(totalValorimpuesto) + parseFloat(item.impuesto);
  }
  return parseFloat(totalValorimpuesto);
}


function calcularImpuesto25(items) {
  bienesPersonales = 0;
  let total;
  
  for (const item of items) { 
    total = parseFloat(calcularTotal(items));   
    let totalSI = parseFloat(calcularTotalSinImpuesto(items))
    if(total >= 300)
    {
      bienesPersonales = totalSI * valorBienesPersonales;
      
    } 
  }
  return parseFloat(bienesPersonales);
}

function calcularGastoTotal(items) {
  let precioFinal = 0;
  let bienesP;
  for (const item of items) {
     bienesP = parseFloat(calcularImpuesto25(items));
    precioFinal += parseFloat(item.totalImpuesto);
  }
  precioFinal = precioFinal + parseFloat(bienesP);
  return parseFloat(precioFinal);
}



function limpiarHTML() {
  //elementos hijos del divproductos
  // const divProductos = document.querySelector(".div-productos");
  const $cuerpoTabla = document.querySelector("#cuerpoTabla");
  while ($cuerpoTabla.firstChild) {
    $cuerpoTabla.removeChild($cuerpoTabla.firstChild);
    localStorage.clear();
     Totales();
  }
  
  //mientras divProd tenga hijos,se eliminaran
  // while (divProductos.firstChild) {
  //   divProductos.removeChild(divProductos.firstChild);
  //   localStorage.clear();
  //   totalSuma = calcularTotal(productos);
  //   totales.innerHTML = totalSuma;
  // }




}
