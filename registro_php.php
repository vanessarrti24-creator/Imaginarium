<?php
$conexion = new mysqli("localhost", "root", "", "Imaginarium");
$resultado = $conexion->query("SHOW COLUMNS FROM proyecto");
echo "<pre>";
while ($columna = $resultado->fetch_assoc()) {
    print_r($columna);
}
echo "</pre>";

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

function limpiar($conexion, $campo) {
    return isset($_POST[$campo]) ? $conexion->real_escape_string($_POST[$campo]) : null;
}

// Insertar proyecto
$asignaturas = [];
$total = $_POST['total_asignaturas_pe'];

for ($i = 1; $i <= $total; $i++) {
    $key = "asignatura_pe_$i";
    if (!empty($_POST[$key])) {
        $asignaturas[] = limpiar($conexion, $key);
    }
}

$nombre_proyecto = limpiar($conexion, 'nombre_proyecto');
$origen = limpiar($conexion, 'origen_proyecto');
$objetivo = limpiar($conexion, 'objetivo_proyecto');
$empresa = limpiar($conexion, 'empresa_proyecto');
$estado = limpiar($conexion, 'estado_proyecto');
$url = limpiar($conexion, 'url_proyecto');

$producto = limpiar($conexion, 'producto_proyecto');
$asignatura = implode(', ', $asignaturas);

$conexion->query("INSERT INTO proyecto (nombre_proyecto, origen_proyecto, objetivo_proyecto, empresa_proyecto, estado_proyecto, url_proyecto, asignatura_proyecto, producto_proyecto)
VALUES ('$nombre_proyecto', '$origen', '$objetivo', '$empresa', '$estado', '$url', '$asignatura', '$producto')");

$id_proyecto = $conexion->insert_id;
echo "<pre>";
print_r([
  'nombre_proyecto' => $nombre_proyecto,
  'origen_proyecto' => $origen,
  'objetivo_proyecto' => $objetivo,
  'empresa_proyecto' => $empresa,
  'estado_proyecto' => $estado,
  'url_proyecto' => $url,
  'asignatura_proyecto' => $asignatura,
  'producto_proyecto' => $producto
]);
echo "</pre>";

$sql = "INSERT INTO proyecto (nombre_proyecto, origen_proyecto, objetivo_proyecto, empresa_proyecto, estado_proyecto, url_proyecto, asignatura_proyecto, producto_proyecto) 
VALUES ('$nombre_proyecto', '$origen', '$objetivo', '$empresa', '$estado', '$url', '$asignatura', '$producto')";
echo $sql;

// Insertar estudiantes
$total_estudiantes = intval($_POST['total_estudiante']);
for ($i = 1; $i <= $total_estudiantes; $i++) {
    $exp = limpiar($conexion, "expediente_estudiante_$i");
    $nombre = limpiar($conexion, "nombre_estudiante_$i");
    $nivel = limpiar($conexion, "nivel_$i");
    $carrera = limpiar($conexion, "carrera_estudiante_$i");
    $grupo = limpiar($conexion, "grupo_estudiante_$i");
    $tutor = limpiar($conexion, "tutor_$i");
    $genero = limpiar($conexion, "genero_estudiante_$i");
    $cuatri = limpiar($conexion, "cuatrimestre_$i");
    
    $existe = $conexion->query("SELECT 1 FROM estudiante WHERE expediente_estudiante = '$exp'");
if ($existe->num_rows == 0) {
    $conexion->query("INSERT INTO estudiante (expediente_estudiante, nombre_estudiante, nivel, carrera_estudiante, grupo_estudiante, tutor, total_estudiante, genero_estudiante, cuatrimestre)
    VALUES ('$exp', '$nombre', '$nivel', '$carrera', '$grupo', '$tutor', 1, '$genero', '$cuatri')");
    $conexion->query("INSERT INTO es_realizado (id_proyecto2, expediente_estudiante2, fechainicio, fechafin)
    VALUES ('$id_proyecto', '$exp', '{$_POST['fechainicio']}', '{$_POST['fechafin']}')");
}
}

// Insertar profesores
$total_profesores = intval($_POST['total_profesor']);
for ($i = 1; $i <= $total_profesores; $i++) {
    $exp = limpiar($conexion, "expediente_profesor_$i");
    $nombre = limpiar($conexion, "nombre_profesor_$i");
    $genero = limpiar($conexion, "genero_profesor_$i");

    $conexion->query("INSERT INTO profesor (expediente_profesor, nombre_profesor, total_profesor, genero_profesor)
    VALUES ('$exp', '$nombre', '$total_profesores', '$genero')");
}

// Relación pertenece
for ($i = 1; $i <= $total_estudiantes; $i++) {
    $exp_est = limpiar($conexion, "expediente_estudiante_$i");
    for ($j = 1; $j <= $total_profesores; $j++) {
        $exp_prof = limpiar($conexion, "expediente_profesor_$j");
        $conexion->query("INSERT INTO pertenece VALUES ('$id_proyecto', '$exp_prof', '$exp_est')");
    }
}

// Insertar criterios SEAES
$responsabilidad = isset($_POST['responsabilidad_social']) ? 1 : 0;
$equidad = isset($_POST['equidad_social_genero']) ? 1 : 0;
$inclusion = isset($_POST['inclusion']) ? 1 : 0;
$excelencia = isset($_POST['excelencia']) ? 1 : 0;
$innovacion = isset($_POST['innovacion_social']) ? 1 : 0;
$vanguardia = isset($_POST['vanguardia']) ? 1 : 0;
$interculturalidad = isset($_POST['interculturalidad']) ? 1 : 0;
$sector = limpiar($conexion, 'sector_beneficiado');
//Acumulador SEAES 
$acumuresponsabilidad = $responsabilidad * $total_estudiantes;
$acumuequidad = $equidad * $total_estudiantes;
$acumuinclusion = $inclusion * $total_estudiantes;
$acumuexcelencia = $excelencia * $total_estudiantes;
$acumuinnovacion = $innovacion * $total_estudiantes;
$acumuvanguardia = $vanguardia * $total_estudiantes;
$acumuinterculturalidad = $interculturalidad * $total_estudiantes;
try {
    $conexion->query("INSERT INTO seaes (
        id_proyecto3, sector, responsabilidad, equidad, inclusion, excelencia,
        innovacion, vanguardia, interculturalidad,
        acumuresponsabilidad, acumuequidad, acumuinclusion, acumuexcelencia,
        acumuinnovacion, acumuvanguardia, acumuinterculturalidad
    ) VALUES (
        '$id_proyecto', '$sector', '$responsabilidad', '$equidad', '$inclusion', '$excelencia',
        '$innovacion', '$vanguardia', '$interculturalidad',
        '$acumuresponsabilidad', '$acumuequidad', '$acumuinclusion', '$acumuexcelencia',
        '$acumuinnovacion', '$acumuvanguardia', '$acumuinterculturalidad'
    )");

    // ✅ Éxito: redirigir con ID
    header("Location: registro.html?status=success&id=$id_proyecto");
    exit();

} catch (mysqli_sql_exception $e) {
    // ❌ Error: redirigir con mensaje
    $errorMsg = urlencode("Error al registrar criterios SEAES: " . $e->getMessage());
    header("Location: registro.html?status=success&id=$id_proyecto");
    exit();
}
?>
