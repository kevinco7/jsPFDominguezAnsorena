const botonUsd = document.getElementById('usd');
const valorImpuesto = 0.30;
const valorRetencion = 0.45;
const SALIR = "ESC";

class Producto{
    constructor(descripcion, precio, precioConversion)
    {
        this.descripcion = descripcion.toUpperCase();
        this.precio = parseFloat(precio);
        this.precioConversion = precioConversion;
        this.retencion = 0;
        this.impuesto = 0;
        this.totalImpuesto = 0;
    }
     retenciones(){
        this.retencion = this.precioConversion * valorRetencion;
     }
     impuestoPais(){
        this.impuesto = this.precioConversion * valorImpuesto;
     }
     valorConImpuestos(){
        this.totalImpuesto = this.precioConversion + this.retencion + this.impuesto ;
     }
}

function convertirUsd(){
let total =0;
let totalRetencion = 0;
let totalImpuesto = 0;
let gastoFinal = 0;
let cantidadProductos=0;
const productos = [];

    let valorDia = Number(prompt("Ingrese el valor del dolar oficial Banco Nacion"));
    while(valorDia ==""){
    alert("Ingrese un valor");
    valorDia = Number(prompt("Ingrese el valor del dolar oficial Banco Nacion"));
    }    
    do{
        cantidadProductos = Number(prompt("Ingrese la cantidad de productos que compraste"));
        if(cantidadProductos <=0){
          alert("Ingrese una cantidad valida");
        }
    }while(cantidadProductos <=0);

    for (let i = 1; i <= cantidadProductos; i++) {
        
        let nombre = prompt(`Ingrese el nombre producto o ${SALIR} para salir`);
        if(escondicionSalida(nombre)){
            alert("MUCHAS GRACIAS!")
            break
        }
        // numero_producto = i;
        let precioProducto = prompt("Ingrese el precio en u$d de "+ nombre );
        while(precioProducto <= 0)
        {
          alert("Ingrese un precio valido");
          precioProducto = prompt("Ingrese el precio en u$d de "+ nombre );
        }

        
        let totalConversion = precioProducto * valorDia;
                      
        productos.push(new Producto(nombre, precioProducto,totalConversion,));   
         total = calcularTotal(productos);
         
         for(const producto of  productos )
         {
             producto.impuestoPais();
             
             producto.retenciones();
             
             producto.valorConImpuestos();
             
             
            }
        totalRetencion = calcularTotalRetencion(productos);
        totalImpuesto = calcularTotalImpuestoPais(productos);
        gastoFinal = calcularGastoTotal(productos);
        console.log(productos);

        

        }
        console.log(`Impuesto Pais total $ ${total} ars`);
        console.log(`Impuesto Pais total $ ${totalImpuesto} ars`);
        console.log(`retenciones totales $ ${totalRetencion} ars`);
        console.log(`gasto total con impuesto $ ${gastoFinal} ars`);
        
        alert(`    El gasto total de tus compras es de:    
    -------------------------------------------------------- 
    precio sin impuesto: $ ${total} ars
    Retencion:                 $ ${totalRetencion} ars
    Impuesto Pais:          $ ${totalImpuesto} ars
    --------------------------------------------------------
    Precio total:            $ ${gastoFinal} ars`)


        function calcularTotal(items) {
            let totalValorSinImpuesto = 0
            for (const item of items) {
                totalValorSinImpuesto = totalValorSinImpuesto + item.precioConversion
            }
            return totalValorSinImpuesto
        }

        function calcularTotalRetencion(items) {
            let totalValorRetenciones = 0
            for (const item of items) {
                totalValorRetenciones = totalValorRetenciones + item.retencion
            }
            return totalValorRetenciones
        }

        function calcularTotalImpuestoPais(items) {
            let totalValorimpuesto = 0
            for (const item of items) {
                totalValorimpuesto = totalValorimpuesto + item.impuesto
            }
            return totalValorimpuesto
        }

        function calcularGastoTotal(items) {
            let precioFinal = 0
            for (const item of items) {
                precioFinal = precioFinal + item.totalImpuesto
            }
            return precioFinal
        }

    function escondicionSalida(texto){
        if(texto==SALIR){
           return true
        }
        return false
    }
    
let buscar = prompt("Escribe el nombre del producto que desea visualizar!, si quiere cancelar ingrese ESC")

if (buscar != SALIR) {
    const resultado = productos.find((producto) => producto.descripcion === buscar.toUpperCase())
    alert(`    Producto ${productos.indexOf(resultado)+1}: 
    En tu compra ${resultado.descripcion}, Gastaste u$d ${resultado.precio}
    -------------------------------------------------------- 
    precio sin impuesto: $ ${resultado.precioConversion} ars
    Retencion:                 $ ${resultado.retencion} ars
    Impuesto Pais:          $ ${resultado.impuesto} ars
    --------------------------------------------------------
    Precio total:            $ ${resultado.totalImpuesto} ars`)
}

};
botonUsd.onclick = convertirUsd;
