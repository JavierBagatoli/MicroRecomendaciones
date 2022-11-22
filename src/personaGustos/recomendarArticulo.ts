import PersonaGusto from "./modelo.js"

const recomendarArticulo = () => async(req: any,res: any) => {
    const idUsuario = req.params.idUsuario;
    try{
        let etiqueta1 = {etiqueta: "", contador : 0}
        let etiqueta2 = {etiqueta: "", contador : 0}
        let etiqueta3 = {etiqueta: "", contador : 0}
        const personaGusto = await PersonaGusto.findOne({idUsuario : idUsuario})
        
        personaGusto.gustosEtiquetas.map((etiqueta: any) => {
            if (etiqueta.contador > etiqueta1){
                etiqueta3 = etiqueta2;
                etiqueta2 = etiqueta1;
                etiqueta1 = etiqueta
            }else if(etiqueta.contador > etiqueta2){
                etiqueta3 = etiqueta2;
                etiqueta2 = etiqueta
            }else if(etiqueta.contador > etiqueta3){
                etiqueta3 = etiqueta
            }
        })

        const listaEtiquetasRecomendados = [etiqueta1, etiqueta2, etiqueta3]
        res.status(200).send({etiquetasRecomendadas : listaEtiquetasRecomendados})
    }catch(e){
        mensajeError(res, "Fallo al recomendar etiquetas: " + e )
    }
}

const mensajeError = (res: any , text: any) => {
    res.status(500).json({
        message: text
    })
}

export default recomendarArticulo;