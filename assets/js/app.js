const botonUsd = document.getElementById('usd');
const impuestoPais = 0.30;
const retencion = 0.45;
const salir = "ESC";
let total =0;
let totalRet = 0;
let totalImpPais = 0;
let valorDia = 0;
let cantidadProductos=0;
let valorProducto = 0;
let numero_producto = 0;

function convertirUsd(){

    valorDia = Number(prompt("Ingrese el valor del dolar oficial Banco Nacion"));
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
        
        let nombre = prompt("Ingrese el nombre producto o ESC para salir");
        if(escondicionSalida(nombre)){
            alert("MUCHAS GRACIAS!")
            break
        }
        numero_producto = i;
        valorProducto = prompt("Ingrese el precio en u$d de "+ nombre );
        while(valorProducto <= 0)
        {
          alert("Ingrese un precio valido");
          valorProducto = prompt("Ingrese el precio en u$d de "+ nombre );
        }
        let totalConversion = valorProducto * valorDia;
        let ret = totalConversion * retencion;
        let imp = totalConversion * impuestoPais;
        total = total + totalConversion;
        totalRet = totalRet + ret;
        totalImpPais = totalImpPais + imp;
             
        alert( `Producto ${numero_producto} con nombre ${nombre} y monto total $ ${totalConversion}.Impuesto PAIS $ ${imp} Percepcion Ganancias $ ${ret}`);
        // console.log( `Producto ${numero_producto} con nombre ${nombre} y monto total $ ${totalConversion}.Impuesto PAIS $ ${imp} Percepcion Ganancias $ ${ret}`);
    }
    alert(`El valor total de tus ${numero_producto} compras es de:\n Total: ${total}ARS \n Impuesto Pais: ${totalImpPais}ARS \n Percepcíon RG 4815: ${totalRet}ARS`)
    
};


function escondicionSalida(texto){
    if(texto==salir){
       return true
    }
    return false
}

botonUsd.onclick = convertirUsd;


