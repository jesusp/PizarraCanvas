
<?php

if(isset($_POST['img'])){
	$ext = $_POST['ext'];
	$img = $_POST['img'];
	$filteredData=substr($img, strpos($img, ",")+1);

// Need to decode before saving since the data we received is already base64 encoded
$unencodedData=base64_decode($filteredData);
//echo $unencodedData;
//echo "unencodedData".$unencodedData;
 $nombre = date('YmdHis');
// Save file. This example uses a hard coded filename for testing,
// but a real application can specify filename in POST variable
 $ruta = 'dibujos/'.$nombre.'.'.$ext;
$fp = fopen($ruta, 'wb' );
fwrite( $fp, $unencodedData);
fclose( $fp );
echo json_encode(['mensaje'=>'Imagen Guardada con Exito', 'ruta'=>$ruta]);

}else{
	echo '#Error, Imagen no Subida';
}
/*
$string  = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8
/evAIgvA/FsIF
BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB
jawzgs
Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==";
$filteredData=substr($string, strpos($string, ",")+1);

// Need to decode before saving since the data we received is already base64 encoded
$unencodedData=base64_decode($filteredData);
$fp = fopen("archivo.png", 'wb' );
fwrite( $fp, $unencodedData);
fclose( $fp );
echo "bien";
*/
?>