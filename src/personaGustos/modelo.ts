import pkg from 'mongoose';
import { Document, model, Schema } from "mongoose";

export interface IGustoEtiqueta {
    etiqueta: String,
    contador: Number
}

export interface INoRecomendar {
    etiqueta: String,
    idArticulo: Array<Number>
}
export interface IPersonaGusto {
    idUsuario: String,
    gustosEtiquetas: Array<IGustoEtiqueta>,
    listaNoRecomendar: Array<INoRecomendar>
  }


const personaGusto = new Schema({
    idUsuario: {type: String, required: true, trim: true},
    gustosEtiquetas: [{
        etiqueta : {type:String, required: true},
        contador : {type:Number}
    }],
    listaNoRecomendar: [{
        etiqueta : {type: String, required: true},
        idArticulo : [{
            id: {type: String, required: true}
        }]
    }]
},
    {
    versionKey: false,
    timestamps: true
})

export default model<IPersonaGusto>("PersonaGusto", personaGusto)
