## Microservicio de Recomendacion

### Casos de uso


<img src="https://www.plantuml.com/plantuml/png/VT2_oi8m50NmFKznoVHzGmTjfoAbe8k3Yz07k2ONYQI9vi-J-GY-c5V5j2AujUIS7oVfOyAGycX5kukmneJM7tqBLTN1tn1fyGyjo9Nff91RfmADvBW1bCmbKy88XnpvIwC4_dbLn1FRa_ASrgZCxUecSbb84BA40l0EexBryIrnyYVK5EZ3EVl9Wa2MQzwXzeLj7WE7c36OsKthcRQX4mRG1E5xNc5gPaJFX_nwTm00" alt="Modelo UML">

#### CU: Incrementar etiquetas busqueda
- Precondicion: El usuario esta registrado y logeado

- Camino normal:
    - Cuando el usuario ingresa a los detalles de un producto que encontró por búsqueda o sugerencia, el microservicio traerá los detalles correspondientes de este, pero para el objetivo del microservicio de recomendaciones también enviara una petición el dato de la etiqueta y el idUsuario a una cola donde el microservicio de recomendaciones incrementará el contador interno.


#### CU: Recomendar articulos
- Camino normal:
    * Cuando el usuario ingresa el menú principal del e-comerce, se necesita tener elementos para recomendar, para esto la GUI toma le ID de usuario y hace una llamada al microservicio de recomendaciones para obtener una lista de las 3 etiquetas con mayor favoritismo.

#### CU: Dejar de recomendar articulo
 - Camino normal:
    * En la GUI cada articulo tendra la oportunidad de dejar de recomendar, lo incluye en un lista de no recomendados.
    * Si los articulos comparten etiqueta, se le restara puntaje a la etiqueta para que deje de ser recomendados.

#### CU: No recomendar por etiqueta relacionada
 - Camino normla:
    * Cuando se acceda a los detalles de algún artículo, se estima que la GUI muestre artículos similares al que estaba buscando el usuario, pero para evitar que aparezcan productos no deseados la GUI enviara una petición con el idUsuario y la etiqueta para poder conocer que artículos no debe mostrar

### Modelo de datos

**PersonaGustos**
```json
{
    "id" : "string",
    "idUsuario" : "string",
    "gustosEtiquetas" : [{
        "etiqueta" : "string",
        "contador" : "int"
        }],
    "listaNoRecomendar" : [
        {"etiqueta" : "String",
        "idArticulos": ["id":"String", ...]}]
}
```

### Interfaz REST

**Recomendar articulos**

`GET /{IdUsuario}`

*Headers*
Authorization: Bearer token

*Response*
`200 OK` articulos recomendados
```json
{
    "etiquetasRecomendadas" : ["etiqueta", "..."]
}
```

**No recomendar por etiqueta relacionada**

`GET /{idUsuario}/{etiqueta}`

*Headers*
Authorization: Bearer token

*Response*
`200 OK` articulos recomendados
```json
{
    "articulos" : ["idArticulo", "..."]
}
```

### Interfaz asincronica (rabbit)

**Incrementar etiqueta de busqueda**

Recibe a las `etiquetas` que incrementara

- cola: microRecomendaciones - incrementarEtiqueta
- Tipo suscripcion: 
body
```json
{
    "id" : "231",
    "idUsuario" : "235498213",
    "etiquetas" : ["deporte", "neumaticos"]
}
```


**Dejar de recomendar articulo**

Recibe el IdArticulo que dejara de recomendarse

- Cola: microRecomendaciones - dejarDeRecomendar
- Tipo suscripcion

body
```json
{
    "id" : "231",
    "idUsuario" : "235498213",
    "idArticulo" : "321321"
}
```
