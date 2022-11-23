import PersonaGusto, { IGustoEtiqueta, IPersonaGusto } from "./modelo.js";


export interface IEtiquetaMessage {
    idUsuario: String;
    etiqueta: String;
}

const incrementarGusto = async (objetoIncremento: IEtiquetaMessage) => {

    const idUsuario = objetoIncremento.idUsuario;
    const etiqueta = objetoIncremento.etiqueta;
    try {
        const personaGusto = await PersonaGusto.findOne ({idUsuario: idUsuario });
        if (personaGusto == undefined) {
            const nuevoGusto = new PersonaGusto (
                {
                    idUsuario: idUsuario,
                    gustosEtiquetas: [{
                        etiqueta: etiqueta,
                        contador: 1
                    }]
                });
            await nuevoGusto.save();
        } else {
            const existeEtiqueta = personaGusto.gustosEtiquetas.find(e => e.etiqueta === etiqueta);
            console.log("Analisis: " + existeEtiqueta + "\n\n fin de la busqueda");

            if (existeEtiqueta === undefined) {
            personaGusto.gustosEtiquetas = [...personaGusto.gustosEtiquetas,
                {
                etiqueta: etiqueta,
                contador: 1
                }];
            } else {
                const nuevaListaGusto = personaGusto.gustosEtiquetas.map( (e: IGustoEtiqueta) => e.etiqueta === etiqueta ?  { etiqueta: e.etiqueta, contador: Number (e.contador) + 1} : e);
                console.log("Nueva lista de gustos: " + nuevaListaGusto);
                personaGusto.gustosEtiquetas = nuevaListaGusto;
            }
            console.log("------------\n Persona encontrada: \n" + personaGusto);

            await personaGusto.save();
        }
        console.log(personaGusto.gustosEtiquetas);
    } catch (e) {
        console.log("error:" + e);
    }
};

export default incrementarGusto;