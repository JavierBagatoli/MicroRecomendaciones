<a name="top"></a>
# Cart Service en Node v0.1.0

Microservicio de Carrito

- [RabbitMQ_GET](#rabbitmq_get)
	- [Validación de Artículos](#validación-de-artículos)
	


# <a name='rabbitmq_get'></a> RabbitMQ_GET

## <a name='validación-de-artículos'></a> Validación de Artículos
[Back to top](#top)

<p>Escucha de mensajes article-exist desde cart. Valida artículos</p>

	DIRECT cart/article-exist





### Success Response

Mensaje

```
{
   "type": "article-exist",
   "message": {
        "referenceId": "{cartId}",
        "articleId": "{articleId}",
        "valid": true|false
   }
}
```


