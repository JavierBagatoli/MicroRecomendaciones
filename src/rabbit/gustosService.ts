"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
import { RabbitDirectConsumer } from "./tools/directConsumer";
import { IRabbitMessage } from "./tools/common";
import incrementarGusto, { IEtiquetaMessage } from "../personaGustos/incrementarGusto";

export function init() {
    const incrementarEtiqueta = new RabbitDirectConsumer("mr_incremento", "mr_incremento");
    incrementarEtiqueta.addProcessor("IncrementarEtiqueta", processEtiqueta);
    incrementarEtiqueta.init();

    const noRecomendarArticulo = new RabbitDirectConsumer("mr_decremento", "mr_decremento");
    noRecomendarArticulo.addProcessor("noRecomendarArticulo", processNoRecomendarEtiqueta);
    noRecomendarArticulo.init();
}

/**
 * @api {direct} cart/article-exist Validación de Artículos
 * @apiGroup RabbitMQ GET
 *
 * @apiDescription Escucha de mensajes article-exist desde cart. Valida artículos
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *        "type": "article-exist",
 *        "message": {
 *             "referenceId": "{cartId}",
 *             "articleId": "{articleId}",
 *             "valid": true|false
 *        }
 *     }
 */

function processEtiqueta(rabbitMessage: IRabbitMessage) {
    console.log("Llegan etiquetas");
    const etiqueta = rabbitMessage.message as IEtiquetaMessage;
    incrementarGusto(etiqueta);
}

function processNoRecomendarEtiqueta(rabbitMessage: IRabbitMessage) {
    console.log("Llegan etiquetas");
    const etiqueta = rabbitMessage.message as IEtiquetaMessage;
// DejarDeRecomendarArticulo(etiqueta);
}