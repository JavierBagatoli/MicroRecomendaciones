import PersonaGusto from "./modelo.js"

const incrementarGusto = () => async(objetoIncremento : any, res : any) => {

    const idUsuario = objetoIncremento.idUsuario;
    const etiqueta = objetoIncremento.etiqueta;

    try{
        const personaGusto = await PersonaGusto.findOne({idUsuario:idUsuario})
        if (personaGusto == null){
            
            const nuevoGusto = new PersonaGusto(
                {
                    idUsuario: idUsuario,
                    gustosEtiquetas: [{
                        etiqueta: etiqueta,
                        contador: 1
                    }]
                })
            await nuevoGusto.save()

        }

        let nuevaListaGusto = personaGusto.gustosEtiquetas.map((e : any) => e === etiqueta ? e.contador+1 : e.contador)
        personaGusto.gustosEtiquetas = nuevaListaGusto;
        await personaGusto.save()

        return res.status(200).send({personaGusto})
    }catch(e){
        mensajeError(res, "Fallor al incrementar: " + e)
    }
}

const mensajeError = (res : any , text : String) => {
    res.status(500).json({
        message: text
    })
}

export default incrementarGusto;