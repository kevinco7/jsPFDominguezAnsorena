const valorImpuesto = 0.3;
const valorRetencion = 0.45;
const valorBienesPersonales = 0.25;
const SALIR = "ESC";
let productos = JSON.parse(localStorage.getItem("producto")) || [];
let precioCompra = parseFloat(0).toFixed(2);
let valorDolar = parseFloat(0).toFixed(2);
let totalSuma = parseFloat(0).toFixed(2);
let totalSI = parseFloat(0).toFixed(2);
let bienesPersonales = parseFloat(0).toFixed(2);

let conversion = parseFloat(0).toFixed(2);

let editando = false;
const formulario = document.querySelector("#formulario");
const descripcionInput = document.querySelector("#descripcion");
const selectMonedaInput = document.querySelector("#moneda-uno");
const btnAgregar = document.querySelector("#btnAgregar");
const precioInput = document.querySelector("#precio");

let conversionProducto = parseFloat(0).toFixed(2);

async function cargarConversion() {
  // let amount = parseFloat(0).toFixed(2);
  let rate = parseFloat(0).toFixed(2);
  let base = document.querySelector("#moneda-uno").value;
  let precio = document.querySelector("#precio").value;
  try {
    const response = await fetch(
      `https://api.exchangerate.host/latest?/source=ecb&base=${base}`
    );
    const data = await response.json();
    console.log(data);
    // amount = precio;
    rate = data.rates["USD"];
    conversionProducto = parseFloat(precio * rate).toFixed(2);
  } catch (error) {
    console.log("Error: ", error);
  }
}

const valorDolarOficial = async () => {
  try {
    const resp = await fetch("https://api.bluelytics.com.ar/json/last_price");
    const jsonResp = await resp.json();

    jsonResp.forEach((element) => {
      valorDolar = element.value_sell;

      console.log(valorDolar);
    });

    conversion = parseFloat(valorDolar).toFixed(2);
    console.log("valor conversion" + conversion);
  } catch (error) {}
};

class Producto {
  constructor(
    id,
    descripcion,
    precio,
    monedaCompra,
    precioTarjeta,
    precioDolar,
    precioConversion,
    retencion,
    impuesto,
    totalImpuesto
  ) {
    this.id = id;
    this.descripcion = descripcion;
    this.precio = parseFloat(precio).toFixed(2);
    this.monedaCompra = monedaCompra;
    this.precioTarjeta = parseFloat(precioTarjeta).toFixed(2);
    this.precioDolar = parseFloat(precioDolar).toFixed(2);
    this.precioConversion = parseFloat(precioConversion).toFixed(2);
    this.retencion = parseFloat(retencion).toFixed(2);
    this.impuesto = parseFloat(impuesto).toFixed(2);
    this.totalImpuesto = parseFloat(totalImpuesto).toFixed(2);
  }
  sumaTotal() {
    precioTotalProducto += this.precio;
  }
}

formulario.reset();
limpiarObjeto();
mostrarProductos();

valorDolarOficial();
formulario.addEventListener("submit", cargarCompra);

function cargarCompra(e) {
  cargarConversion();
  // para que no se ejecute de forma automatica
  e.preventDefault();

  return new Promise((resolve) => {
    setTimeout(() => {
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
        precioProducto = precio.value;
        moneda = selectMonedaInput.value;
        precioTarjeta = conversionProducto;
        precioDolar = conversion;
        precioConversion = conversion * conversionProducto;
        retencion = precioConversion * valorRetencion;
        impuesto = precioConversion * valorImpuesto;
        totalImpuesto = precioConversion + retencion + impuesto;

        agregarProducto();
      }
      resolve();
    }, 5000);
  });
}

function agregarProducto() {
  productos.push(
    new Producto(
      idP,
      nombreProducto,
      precioProducto,
      moneda,
      precioTarjeta,
      precioDolar,
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

function mostrarProductos() {
  //funcion para limpiar el listado y que no se repita con lo creado
  limpiarHTML();
  const $cuerpoTabla = document.querySelector("#cuerpoTabla");
  productos.forEach((producto) => {
    const {
      id,
      descripcion,
      precio,
      monedaCompra,
      precioTarjeta,
      precioDolar,
      precioConversion,
      retencion,
      impuesto,
      totalImpuesto,
    } = producto;

    const parrafo = document.createElement("p");
    parrafo.innerHTML = `Descripción ${descripcion} ${precio} ${monedaCompra} ${precioDolar} ${precioTarjeta} $ ${precioConversion} ars
                         Retención: $ ${retencion} ars impuesto: $ ${impuesto} ars total: $ ${totalImpuesto} ars `;
    parrafo.dataset.id = id;

    //localstorage
    const productoJSON = JSON.stringify(productos);
    localStorage.setItem("producto", productoJSON);

    //tabla de productos
    const $tr = document.createElement("tr");
    let tdNombre = document.createElement("td");
    tdNombre.textContent = `${producto.descripcion}`;
    $tr.appendChild(tdNombre);
    let tdPrecio = document.createElement("td");
    tdPrecio.innerHTML = `${producto.monedaCompra} ${producto.precio} <br>
                          U$D ${producto.precioTarjeta}`;

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

function Totales() {
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
  totalDeGasto.innerHTML = ` $ ${gastoTotal}`;
}

function cargarProducto(producto) {
  const { id, descripcion, precio, monedaCompra } = producto;

  Producto.id = id;
  descripcionInput.value = descripcion;
  selectMonedaInput.value = monedaCompra;
  precioInput.value = precio;

  formulario.querySelector('button[type="submit"]').textContent = "Actualizar";
  editando = true;
}

function limpiarObjeto() {
  Producto.id = "";
  Producto.descripcion = "";
  Producto.precio = 0;
  Producto.precioTarjeta = 0;
  Producto.precioDolar = 0;
  Producto.precioConversion = 0;
  productos.retencion = 0;
  totalSuma = 0;
}

function editarProducto() {
  Producto.descripcion = descripcionInput.value;
  Producto.precio = precioInput.value;
  Producto.precioTarjeta = parseFloat(conversionProducto).toFixed(2);
  Producto.precioConversion = parseFloat(
    conversion * conversionProducto
  ).toFixed(2);
  Producto.retencion = parseFloat(
    Producto.precioConversion * valorRetencion
  ).toFixed(2);
  Producto.impuesto = parseFloat(
    Producto.precioConversion * valorImpuesto
  ).toFixed(2);
  Producto.totalImpuesto = parseFloat(
    Producto.precioConversion + Producto.retencion + Producto.impuesto
  ).toFixed(2);

  productos.map((producto) => {
    if (producto.id === Producto.id) {
      producto.id = Producto.id;
      producto.descripcion = Producto.descripcion;
      producto.precio = Producto.precio;
      producto.precioTarjeta = Producto.precioTarjeta;
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
    totalValor = parseFloat(totalValor) + parseFloat(item.precioTarjeta);
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
    totalValorRetenciones =
      parseFloat(totalValorRetenciones) + parseFloat(item.retencion);
  }
  return parseFloat(totalValorRetenciones);
}

function calcularTotalImpuestoPais(items) {
  let totalValorimpuesto = 0;
  for (const item of items) {
    totalValorimpuesto =
      parseFloat(totalValorimpuesto) + parseFloat(item.impuesto);
  }
  return parseFloat(totalValorimpuesto);
}

function calcularImpuesto25(items) {
  bienesPersonales = 0;
  let total;

  for (const item of items) {
    total = parseFloat(calcularTotal(items));
    let totalSI = parseFloat(calcularTotalSinImpuesto(items));
    if (total >= 300) {
      bienesPersonales = totalSI * valorBienesPersonales;
    }
  }
  return parseFloat(bienesPersonales);
}

function calcularGastoTotal(items) {
  let precioFinal = 0;
  let bienesP = 0;
  for (const item of items) {
    bienesP = parseFloat(calcularImpuesto25(items));
    precioFinal += parseFloat(item.totalImpuesto);
  }
  precioFinal = precioFinal + parseFloat(bienesP);
  return parseFloat(precioFinal);
}

function limpiarHTML() {
  const $cuerpoTabla = document.querySelector("#cuerpoTabla");
  while ($cuerpoTabla.firstChild) {
    $cuerpoTabla.removeChild($cuerpoTabla.firstChild);
    localStorage.clear();
    Totales();
  }
}
