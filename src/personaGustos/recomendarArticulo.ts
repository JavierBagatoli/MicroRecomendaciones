import PersonaGusto, { IGustoEtiqueta } from "./modelo.js";

const recomendarArticulo = () => async(req: any , res: any) => {
    const idUsuario = req.params.idUsuario;
    try {
        let etiqueta1: IGustoEtiqueta  = {etiqueta: "", contador: 0};
        let etiqueta2: IGustoEtiqueta = {etiqueta: "", contador: 0};
        let etiqueta3: IGustoEtiqueta = {etiqueta: "", contador: 0};
        const personaGusto = await PersonaGusto.findOne({idUsuario : idUsuario});
        console.log("Persona encontrada" + personaGusto);
        personaGusto.gustosEtiquetas.map((etiqueta: IGustoEtiqueta) => {
            if (Number (etiqueta.contador) > etiqueta1.contador) {
                etiqueta3 = etiqueta2;
                etiqueta2 = etiqueta1;
                etiqueta1 = etiqueta;
            } else if (etiqueta.contador > etiqueta2.contador) {
                etiqueta3 = etiqueta2;
                etiqueta2 = etiqueta;
            } else if (etiqueta.contador > etiqueta3.contador) {
                etiqueta3 = etiqueta;
            }
        });

        const listaEtiquetasRecomendados = [etiqueta1, etiqueta2, etiqueta3];
        res.status(200).send({etiquetasRecomendadas : listaEtiquetasRecomendados});
    } catch (e) {
        mensajeError(res, "Fallo al recomendar etiquetas: " + e );
    }
};

const mensajeError = (res: any , text: any) => {
    res.status(500).json({
        message: text,
    });
};

export default recomendarArticulo;