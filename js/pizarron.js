jQuery.pizarron = function(Contenedor,botones){

var estados =  [];
var estadoActual = -1;
var longitud = 0;
 var modificasteLienzo=0;
var borradorColor ='white';
var no_html5 = $('<div>').attr({id:'no_html5'});
var ancho = Contenedor.width()?Contenedor.width(): "650px";
var altura = Contenedor.height()?Contenedor.height():"450px";
no_html5.append($('<img>').attr({src:'http://www.esedeerre.com/img/no_html5.png', title:'HTML5 support', alt:"Tu navegador no soporta HTML5" }));


    	var barra_herramientas = $('<aside>').css({width: ancho, border:'1px solid'});
    	var fondo = (botones && botones.fondo)?$("#"+botones.fondo):$('<img>').attr({src:'images/fill_2.png', id:'fondo'}).addClass('elemento');
    	var  pincel = (botones && botones.pincel)?$("#"+botones.pincel):$('<img>').attr({src:'images/brush_2.png', id:'pincel'}).addClass('elemento');
    	var borrador = (botones && botones.borrador)?$("#"+botones.borrador):$('<img>').attr({src:'images/draft.png', id:'borrador'}).addClass('elemento');
    	var barraGrosor = $('<div>').attr({id:'grosor', style:'position:absolute'});
    	var indicadorGrosor = $('<span>').attr({id: 'grueso'}).text('Grosor');
    	var grosor = $('<div>').attr({style:'display:inline-block; border:1px solid; vertical-align:50%', id: 'grosorr'})
    							.append(indicadorGrosor)
    							.append($('<div>').attr({style:'display:inline-block'}).addClass('flecha'))
    							.append(barraGrosor).addClass('elemento');
    	var borrar_pizarra= $('<img>').attr({src:'images/reiniciar.png'}).on('click',function(){
    		borrar();
    	}).addClass('elemento');
    	var png = $('<img>').attr({src:'images/png.png'}).on('click', function(){
    		guardar('png');
    	}).addClass('elemento');
    	var jpg = $('<img>').attr({src:'images/jpg.png'}).on('click', function(){
    		guardar('jpeg');
    	}).addClass('elemento');    	
    	var inputFondo= $('<input>').attr({type:'file', name:'fondoImg[]', id:'FondoImg'}).addClass('input-file').on('change', function(){
    		if($(this).val().length >0){
    			var reader, file;
                file = this.files[0];
                    if(window.FileReader){
                        reader = new FileReader();
                        reader.onloadend = function(e){
                            imagen(e.target.result);
                        };
                     
                        reader.readAsDataURL(file);
                    }
    		}else{
    			alert('no selecciono archivo');
    		}
    	});
    	var formularioImg = $('<form>').attr({method:'post', id:'formImg'}).append(inputFondo);
    	var imgFondo = $('<div>').css({width: '140px', display:'inline-block', verticalAlign:'40%', marginLeft:'10px'}).addClass('custom-input-file')
    					                 .append(formularioImg).append($('<span>').text('Seleccionar Imagen'));
      var rehacer = $('<img>').attr({src: 'images/redo.png'}).addClass('elemento');
      var deshacer = $('<img>').attr({src:'images/undo.png'}).addClass('elemento');
      
      rehacer.on('click',function(){
        if(estadoActual+1 < longitud){
          var imagen = new Image(); 
          estadoActual++;
          imagen.src = estados[estadoActual];
          imagen.onload =function(){
          //Cargo la imagen en la posición
            pizarra_context.drawImage(imagen,0,0); //- See more at: http:
          }
        }else{
          alert('No Hay Nada');
        }
    });

            deshacer.on('click',function(){


             if(estadoActual>0){
              var imagen = new Image(); 
              estadoActual--;
              imagen.src = estados[estadoActual];

              imagen.onload =function(){
                  //Cargo la imagen en la posición 
                  pizarra_context.drawImage(imagen,0,0); //- See more at: http:
              }
          }else{
            alert('No Hay nada'); 
        }
            });

if(!botones){            
barra_herramientas.append(fondo).append(pincel).append(borrador).append(grosor).append(deshacer).append(rehacer).append(borrar_pizarra).append(png).append(jpg).append(imgFondo);
}
var contenedor_pizarra = $('<div>').attr({id:'contenedor_pizarra'});
var canvas = $('<canvas>').attr({style:'border: 1px solid;', id:"pizarra", width: ancho, height:altura}).addClass('c');


contenedor_pizarra.append(canvas);

Contenedor.append(no_html5).append(barra_herramientas).append(contenedor_pizarra);

grosor.on('click',function(){
	barraGrosor.show();
});

borrador.on('click', function(){
	pizarra_context.strokeStyle = borradorColor;
});
fondo.ColorPicker({
onChange: function (hsb, hex, rgb) {
		pizarra_context.fillStyle = '#'+hex; 
		borradorColor = '#'+hex;
		pizarra_context.fillRect(0, 0, pizarra_canvas.width,pizarra_canvas.height);
    
	},
  onHide: function(){
    guardaEstado();
  }
});

pincel.ColorPicker({
onChange: function (hsb, hex, rgb) {
		pizarra_context.strokeStyle = '#'+hex;
	}});


var pizarra_canvas;
var pizarra_context;

 function guardar(tipo){
 	canvas = document.getElementById("pizarra");
 	dataUrl = canvas.toDataURL('image/'+tipo);
 /*	rpl = dataUrl.replace("image/"+tipo,'image/octet-stream');
 	document.location.href= rpl;*/
$.post('save.php',{img:dataUrl, ext: tipo}, function(res){

	alert(res.mensaje);
	$('#imagenesGuardadas').append($('<img>').attr({src:res.ruta, width:'100px', height:'100px'}).css({border:'solid 1px', marginLeft:'2px'}));
},'json');

 }

 function imagen(source){
 //	alert(pizarra_canvas.width);
 	var imagenFondo = new Image(); 
 	imagenFondo.src = source; 
imagenFondo.onload =function(){
 	//Cargo la imagen en la posición    
 	pizarra_context.drawImage(imagenFondo,0,0,pizarra_canvas.width-1,pizarra_canvas.height-1); //- See more at: http:
    guardaEstado();
 	}
 }

    barraGrosor.slider({
      range: "min",
      value: 1,
      min: 1,
      max: 60,
      animate: true,
        orientation: "vertical",
      slide: function( event, ui ) {
        pizarra_context.lineWidth = ui.value;
       indicadorGrosor.text(ui.value);

      }
    });

barraGrosor.on('mouseup' ,function(){
	$(this).hide();
});
barraGrosor.on('mouseleave' ,function(){
	$(this).hide();
});
barraGrosor.hide();

/*
	Inicializamos la pizarra. 
	En primer lugar comprobamos si el navegador tiene soporte para canvas utilizando la 
	librería Modernizr. 
	Después guardamos referencia al canvas y definimos el color del trazo con el que vamos a dibujar. 
	Por último, añadimos listeners para los eventos "mousedown" y "mouseup", ya que cuando salten esos
	eventos tenemos que empezar / terminar de pintar
*/
function init(){
	if(!Modernizr.canvas){
		document.getElementById("contenedor_pizarra").style.display = "none";
	}else{
		document.getElementById("no_html5").style.display = "none";
		pizarra_canvas = document.getElementById("pizarra");
		pizarra_context = pizarra_canvas.getContext("2d");
		pizarra_context.fillStyle = 'white'; 
		pizarra_context.fillRect(0, 0, pizarra_canvas.width,pizarra_canvas.height);
		pizarra_context.strokeStyle = 'black';
		pizarra_context.lineWidth = .2;
		pizarra_canvas.addEventListener("mousedown",empezarPintar,false);
		pizarra_canvas.addEventListener("mouseup",terminarPintar,false);
  
        guardaEstado();
	}

	
}

 

/*
	empezarPintar(e)
	Al hacer mousedown sobre la pizarra, comenzamos un nuevo trazo, movemos el pincel hasta la 
	posición del ratón y añadimos un listener para el evento mousemove, para que con cada movimiento 
	del ratón se haga un nuevo trazo
*/

function empezarPintar(e){
	pizarra_context.beginPath();
	pizarra_context.moveTo(e.pageX-pizarra_canvas.offsetLeft,e.pageY-pizarra_canvas.offsetTop);
	pizarra_canvas.addEventListener("mousemove",pintar,false)
}
 
function guardaEstado(){
    estadoActual++;
     canvas = document.getElementById("pizarra");
     p= canvas.toDataURL('image/gif');
     estados[estadoActual]= p;
     longitud++;
     if(estadoActual+1 != estados.length){
      longitud= estadoActual+1;
     }
}

/*
	terminarPintar(e) se ejecuta al soltar el botón izquierdo, y elimina el listener para 
	mousemove
*/ 
function terminarPintar(e){
	pizarra_canvas.removeEventListener("mousemove",pintar,false);
    if(modificasteLienzo!=0){
   guardaEstado();
    modificasteLienzo=0;
}
}
 
/*
	pintar(e) se ejecuta cada vez que movemos el ratón con el botón izquierdo pulsado.
	Con cada movimiento dibujamos una nueva linea hasta la posición actual del ratón en pantalla.
*/
 
function pintar(e) {
	pizarra_context.lineCap = 'round';
	pizarra_context.lineTo(e.pageX-pizarra_canvas.offsetLeft,e.pageY-pizarra_canvas.offsetTop);
	pizarra_context.stroke();
    modificasteLienzo=1;
}
 
/*
	borrar() vuelve a setear el ancho del canvas, lo que produce que se borren los trazos dibujados
	hasta ese momento.
*/
function borrar(){
	pizarra_canvas.width = pizarra_canvas.width;
	pizarra_canvas.style.background='white';
}
 
 init();
}