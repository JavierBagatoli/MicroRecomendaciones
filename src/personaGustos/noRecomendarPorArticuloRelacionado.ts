import PersonaGusto from "./modelo.js";

const noRecomendarPorArticuloRelacionado = () => async(req: any , res: any) => {

    const idUsuario = req.params.idUsuario;
    const etiqueta = req.params.etiqueta;

    try {
        const personaGusto = await PersonaGusto.findOne({idUsuario: idUsuario});
        if (personaGusto == undefined) {
            return res.status(200).send({mensaje: "No encontrado"});
        }
        const listaDeArticulosRechazados = personaGusto.listaNoRecomendar.filter((e: any) => e.etiqueta == etiqueta);
        return res.status(200).send({articulos: listaDeArticulosRechazados});
    } catch (e) {
        mensajeError(res, "Fallo al enviar las etiquetas no recomendadas: " + e);
    }
};

const mensajeError = (res: any, text: String) => {
    res.status(500).json({
        message: text,
    });
};

export default noRecomendarPorArticuloRelacionado;