import PersonaGusto, { IGustoEtiqueta } from "./modelo.js";

export interface IEtiquetaMessage {
    idUsuario: String;
    etiqueta: String;
    idArticulo: String;
}

const DejarDeRecomendarArticulo = async (objetoIncremento: IEtiquetaMessage) => {
    const idUsuario = objetoIncremento.idUsuario;
    const etiqueta = objetoIncremento.etiqueta;
    const idArticulo = objetoIncremento.idArticulo;
    try {
        const personaGusto = await PersonaGusto.findOne ({idUsuario: idUsuario });
        if (personaGusto == undefined) {
            const nuevoGusto = new PersonaGusto (
                {
                    idUsuario: idUsuario,
                    gustosEtiquetas: [{
                        etiqueta: etiqueta,
                        contador: -1
                    }],
                    listaNoRecomendar: [{etiqueta: etiqueta,
                    idArticulo: [idArticulo]}

                    ]
                });
            await nuevoGusto.save();
        } else {
            const existeEtiqueta = personaGusto.gustosEtiquetas.find(e => e.etiqueta === etiqueta);
            // console.log("Analisis: " + existeEtiqueta + "\n\n fin de la busqueda")

            if (existeEtiqueta === undefined) {
            personaGusto.gustosEtiquetas = [...personaGusto.gustosEtiquetas ,
                {
                etiqueta: etiqueta,
                contador: -1
                }];
            } else {
                const nuevaListaGusto = personaGusto.gustosEtiquetas.map( (e: IGustoEtiqueta) => e.etiqueta === etiqueta ?  { etiqueta: e.etiqueta, contador: Number (e.contador) - 1} : e);
                // console.log("Nueva lista de gustos: " + nuevaListaGusto)
                personaGusto.gustosEtiquetas = nuevaListaGusto;
            }

            const existeEtiquetaNoRecomendada = personaGusto.listaNoRecomendar.find(e => e.etiqueta === etiqueta);

            if (existeEtiquetaNoRecomendada === undefined) {
                personaGusto.listaNoRecomendar = [ ...personaGusto.listaNoRecomendar,
                    {etiqueta: etiqueta,
                     idArticulo: ["23423","AA"]}
                ];
                console.log(personaGusto.listaNoRecomendar);
            } else {
                const nuevaListaNoRecomendar = personaGusto.listaNoRecomendar.map(e => e.etiqueta === etiqueta ? {etiqueta: e.etiqueta, idArticulo: [...e.idArticulo, idArticulo]} : e);
                console.log(nuevaListaNoRecomendar);
                personaGusto.listaNoRecomendar = nuevaListaNoRecomendar;
                // console.log("------------\n Persona encontrada: \n" + personaGusto)
            }

            await personaGusto.save();
        }
        console.log("Salida de la lista No recomendar: " + personaGusto.listaNoRecomendar);
    } catch (e) {
        console.log("error:" + e);
    }
};

export default DejarDeRecomendarArticulo;