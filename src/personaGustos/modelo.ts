import { Document, model, Schema } from "mongoose";

export interface IGustoEtiqueta {
    etiqueta: String;
    contador: Number | number;
}

export interface INoRecomendar {
    etiqueta: String;
    idArticulo: Array<String>;
}
export interface IPersonaGusto {
    idUsuario: String;
    gustosEtiquetas: Array<IGustoEtiqueta>;
    listaNoRecomendar: Array<INoRecomendar>;
  }


const personaGusto = new Schema({
    idUsuario: {type: String, required: true, trim: true, unique: true},
    gustosEtiquetas: [{
        etiqueta : {type: String, required: true},
        contador : {type: Number}
    }],
    listaNoRecomendar: [{
        etiqueta : {type: String, required: true},
        idArticulo : [Array<Number>]
    }]
},
    {
    versionKey: false,
    timestamps: true
});

export default model<IPersonaGusto>("PersonaGusto", personaGusto);
