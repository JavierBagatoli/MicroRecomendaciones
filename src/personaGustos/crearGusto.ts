"use strict";
import PersonaGusto from "./modelo.js";

const crearGusto = () => async(req: any , res: any) => {
    try {
        const nuevoGusto = new PersonaGusto({
                idUsuario: "1234",
            });
        const GustoGuardado = await nuevoGusto.save();
        console.log(GustoGuardado);
        res.json({message : "NuevoGustoCreado"});
    } catch (e) {
        res.status(400).json({message : "Error de salida: " + e});
    }
};

export default crearGusto;