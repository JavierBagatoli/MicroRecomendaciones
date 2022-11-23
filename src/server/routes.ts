"use strict";

import { Express } from "express";
import * as token from "../token";
import * as cart from "../cart";
import * as error from "./error";
import * as express from "express";
import { NextFunction } from "connect";

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

interface IUserSessionRequest extends express.Request {
  user: token.ISession;
}


/**
 * @apiDefine AuthHeader
 *
 * @apiExample {String} Header Autorización
 *    Authorization=bearer {token}
 *
 * @apiErrorExample 401 Unauthorized
 *    HTTP/1.1 401 Unauthorized
 */
function validateToken(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  const auth = req.header("Authorization");
  if (!auth) {
    return error.handle(res, error.newError(error.ERROR_UNAUTHORIZED, "Unauthorized"));
  }

  token.validate(auth)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => error.handle(res, err));
}

/**
 * @api {post} /v1/cart/article Agregar Artículo
 * @apiName Agregar Artículo
 * @apiGroup Carrito
 *
 * @apiDescription Agregar artículos al carrito.
 *
 * @apiExample {json} Body
 *    {
 *      "articleId": "{Article Id}",
 *      "quantity": {Quantity to add}
 *    }
 *
 * @apiSuccessExample {json} Body
 *    {
 *      "userId": "{User Id}",
 *      "enabled": true|false,
 *      "_id": "{Id de carrito}",
 *      "articles": [{Artículos}],
 *      "updated": "{Fecha ultima actualización}",
 *      "created": "{Fecha creado}"
 *    }
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
function addArticle(req: IUserSessionRequest, res: express.Response) {
  cart.addArticle(req.user.user.id, req.body)
    .then(cart => {
      res.json(cart);
    })
    .catch(err => {
      error.handle(res, err);
    });
}