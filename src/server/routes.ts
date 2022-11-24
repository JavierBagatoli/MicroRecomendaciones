"use strict";

import { Express } from "express";

import noRecomendarPorArticuloRelacionado from "../personaGustos/noRecomendarPorArticuloRelacionado";
import recomendarArticulo from "../personaGustos/recomendarArticulo";
import crearGusto from "../personaGustos/crearGusto";

/**
 * Modulo de seguridad, login/logout, cambio de contraseñas, etc
 */
export function init(app: Express) {
  app.route("/crear").post(crearGusto());
  app.route("/recomendacion/:idUsuario").get(recomendarArticulo());
  app.route("/recomendacion/:idUsuario/:etiqueta").get(noRecomendarPorArticuloRelacionado());
}

