"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
import amqp = require("amqplib");
import DejarDeRecomendarArticulo from "../../personaGustos/dejarDeRecomendarArticulo";
import incrementarGusto from "../../personaGustos/incrementarGusto";
import * as env from "../../server/environment";
import { RabbitProcessor, IRabbitMessage } from "./common";

export class RabbitDirectConsumer {
    conf = env.getConfig(process.env);
    processors = new Map<string, RabbitProcessor>();

    constructor(private queue: string, private exchange: string) {
    }

    addProcessor(type: string, processor: RabbitProcessor) {
        this.processors.set(type, processor);
    }

    /**
     * Escucha eventos específicos de cart.
     *
     * article-exist : Es un evento que lo envía Catalog indicando que un articulo existe y es valido para el cart.
     */
    async init() {
        try {
            const conn = await amqp.connect(this.conf.rabbitUrl);

            const channel = await conn.createChannel();

            channel.on("close", function () {
                console.error("RabbitMQ  " + this.exchange + " conexión cerrada, intentado reconecta en 10'");
                setTimeout(() => this.init(), 10000);
            });

            console.log("RabbitMQ " + this.exchange + " conectado");

            const exchange = await channel.assertExchange(this.exchange, "direct", { durable: false });

            const queue = await channel.assertQueue(this.queue, { durable: false});

            channel.bindQueue(queue.queue, queue.queue, exchange.exchange); // di vuelta queue y exchange

            channel.consume(queue.queue,
                (message) => {
                    const rabbitMessage = JSON.parse(message.content.toString());
                    const objEtiqueta = {idUsuario: rabbitMessage.idUsuario, etiqueta: rabbitMessage.etiqueta};
                    const tipo = rabbitMessage.type;
                    if (tipo === "Incremento") {
                        console.log("Se proceso el incremento");
                        incrementarGusto(rabbitMessage);
                    } else if (tipo === "NoRecomendar") {
                        console.log("Se proceso el de dejar de recomendar");
                        DejarDeRecomendarArticulo(rabbitMessage);
                    }

// if (this.processors.has(rabbitMessage.type)) {
//  this.processors.get(rabbitMessage.type)(rabbitMessage);
// }
                }, { noAck: true });
        } catch (err) {
            console.error("RabbitMQ " + this.exchange + " " + err.message);
            setTimeout(() => this.init(), 10000);
        }
    }
}
