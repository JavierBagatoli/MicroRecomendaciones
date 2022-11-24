import PersonaGusto, { IGustoEtiqueta, IPersonaGusto } from "./modelo.js";

export interface IEtiquetaMessage {
    idUsuario: String;
    etiqueta: String;
    idArticulo: String;
}

const crearNuevoPersonaGusto = async(idUsuario: String, etiqueta: String, idArticulo: String) => {
    const nuevoGusto = new PersonaGusto (
        {
            idUsuario: idUsuario,
            gustosEtiquetas: [{
                etiqueta: etiqueta,
                contador: -1
            }],
            listaNoRecomendar: [{
                etiqueta: etiqueta,
                idArticulo: [idArticulo]
            }]
        });
    await nuevoGusto.save();
};

const agregarEtiquetaALaLista = (personaGusto: any, etiqueta: String) => {
    personaGusto.gustosEtiquetas = [...personaGusto.gustosEtiquetas ,
        {
        etiqueta: etiqueta,
        contador: -1
        }];
    return personaGusto;
};

const DejarDeRecomendarArticulo = async (objetoIncremento: IEtiquetaMessage) => {
    const idUsuario = objetoIncremento.idUsuario;
    const etiqueta = objetoIncremento.etiqueta;
    const idArticuloNuevo = objetoIncremento.idArticulo;
    try {
        const personaGusto = await PersonaGusto.findOne ({idUsuario: idUsuario });
        let personaModificada;

        if (personaGusto == undefined) {
            crearNuevoPersonaGusto(idUsuario, etiqueta, idArticuloNuevo);
        } else {
            const existeEtiqueta = personaGusto.gustosEtiquetas.find(e => e.etiqueta === etiqueta);
            // console.log("Analisis: " + existeEtiqueta + "\n\n fin de la busqueda")

            if (existeEtiqueta === undefined) {
                personaModificada = agregarEtiquetaALaLista(personaGusto, etiqueta);
            } else {
                const nuevaListaGusto = personaGusto.gustosEtiquetas.map( (e: IGustoEtiqueta) => e.etiqueta === etiqueta ?  { etiqueta: e.etiqueta, contador: Number (e.contador) - 1} : e);
                personaGusto.gustosEtiquetas = nuevaListaGusto;
            }

            const existeEtiquetaNoRecomendada = personaGusto.listaNoRecomendar.find(e => e.etiqueta === etiqueta);

            if (existeEtiquetaNoRecomendada === undefined) {
                personaGusto.listaNoRecomendar = [ ...personaGusto.listaNoRecomendar,
                    {etiqueta: etiqueta,
                     idArticulo: [idArticuloNuevo]}
                ];
                console.log(personaGusto.listaNoRecomendar);
            } else {

                console.log("\n\nid de articulo " + idArticuloNuevo);

                const listaDeNoGustados = personaGusto.listaNoRecomendar.find (e => e.etiqueta).idArticulo;
                const nuevaListaDeNoGustados = [...listaDeNoGustados, idArticuloNuevo];

                console.log("\n\nExperimento " + nuevaListaDeNoGustados);

                const nuevaListaNoRecomendar = personaGusto.listaNoRecomendar.map(e => e.etiqueta === etiqueta ? {etiqueta: e.etiqueta, idArticulo: nuevaListaDeNoGustados} : e);
                console.log(nuevaListaNoRecomendar);

                personaGusto.listaNoRecomendar = nuevaListaNoRecomendar;
                // console.log("------------\n Persona encontrada: \n" + personaGusto)
            }

            await personaGusto.save();
        }
        console.log("\n\nSalida de la lista No recomendar: " + personaGusto.listaNoRecomendar);
    } catch (e) {
        console.log("error:" + e);
    }
};

export default DejarDeRecomendarArticulo;