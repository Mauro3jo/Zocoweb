import React, {useContext, useEffect} from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const DatosDiarios = ({ data }) => {
    const { darkMode } = useContext(DarkModeContext);
    
    useEffect(() => {
    }, [data]);

    // Accedemos a las propiedades 'cantidad' de los objetos
    const nivelUno = data?.facturacionMenos20 ? [data.facturacionMenos20.cantidad, data.facturacionMenos20.porcentaje.toFixed(2)] : [0, 0];
    const nivelDos = data?.facturacionMas20 ? [data.facturacionMas20.cantidad, data.facturacionMas20.porcentaje.toFixed(2)] : [0, 0];
    const nivelTres = data?.facturacionMas40 ? [data.facturacionMas40.cantidad, data.facturacionMas40.porcentaje.toFixed(2)] : [0, 0];
    const nivelCuatro = data?.facturacionMas60 ? [data.facturacionMas60.cantidad, data.facturacionMas60.porcentaje.toFixed(2)] : [0, 0];
    const nivelCinco = data?.facturacionMas80 ? [data.facturacionMas80.cantidad, data.facturacionMas80.porcentaje.toFixed(2)] : [0, 0];
    const totalTerminales = data?.totalTerminales || 0;

    return (
        <section className="container">
            <div className="row">
                
    <article className="col-12 col-md-6 col-lg d-flex flex-column py-2">
        <h6 className="text-center lato-bold fs-17">Terminales que facturan mas del 80% de la semana</h6>
        <button className={darkMode ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1" : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"}>
            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                {nivelCinco[0]} {/* Cantidad */}
            </div>
        </button>
        <button className={darkMode ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1" : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"}>
            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                {nivelCinco[1]}% {/* Porcentaje */}
            </div>
        </button>
    </article>

    <article className="col-12 col-md-6 col-lg d-flex flex-column py-2">
        <h6 className="text-center lato-bold fs-17">Terminales que facturan del 60% al 80% de la semana</h6>
        <button className={darkMode ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1" : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"}>
            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                {nivelCuatro[0]} {/* Cantidad */}
            </div>
        </button>
        <button className={darkMode ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1" : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"}>
            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                {nivelCuatro[1]}% {/* Porcentaje */}
            </div>
        </button>
    </article>

    <article className="col-12 col-md-6 col-lg d-flex flex-column py-2">
        <h6 className="text-center lato-bold fs-17">Terminales que facturan del 40% al 60% de la semana</h6>
        <button className={darkMode ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1" : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"}>
            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                {nivelTres[0]} {/* Cantidad */}
            </div>
        </button>
        <button className={darkMode ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1" : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"}>
            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                {nivelTres[1]}% {/* Porcentaje */}
            </div>
        </button>
    </article>

    <article className="col-12 col-md-6 col-lg d-flex flex-column py-2">
        <h6 className="text-center lato-bold fs-17">Terminales que facturan del 20% al 40% de la semana</h6>
        <button className={darkMode ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1" : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"}>
            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                {nivelDos[0]} {/* Cantidad */}
            </div>
        </button>
        <button className={darkMode ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1" : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"}>
            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                {nivelDos[1]}% {/* Porcentaje */}
            </div>
        </button>
    </article>

    <article className="col-12 col-md-6 col-lg d-flex flex-column py-2">
        <h6 className="text-center lato-bold fs-17">Terminales que facturan menos del 20% de la semana</h6>
        <button className={darkMode ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1" : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"}>
            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                {nivelUno[0]} {/* Cantidad */}
            
                
            </div>
        </button>
        <button className={darkMode ? "bg-data-dark border-0 quitar-cursor-pointer flex-grow-1" : "container-light bg-data border-0 quitar-cursor-pointer flex-grow-1"}>
            <div className="d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-22">
                
            
                {nivelUno[1]}% {/* Porcentaje */}
            </div>
        </button>
    </article>
</div>
        </section>
    )
}

export default DatosDiarios;
