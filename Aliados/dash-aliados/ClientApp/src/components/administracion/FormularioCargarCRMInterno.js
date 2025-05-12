import React, { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import Swal from "sweetalert2";


const FormularioCargarCRMInterno = () => {
    const {darkMode}=useContext(DarkModeContext)
    const [formData, setFormData] = useState({
        CanalAtencion: "",
        Tipo: "",
        Aliado: "",
        Motivo: "",
        Estado: "",
        Observaciones: "",
        Token: "" // Incluimos el token en el estado inicial
    });

    const [aliados, setAliados] = useState([]); // Estado para guardar la lista de aliados

    useEffect(() => {
        // Función para obtener los aliados desde la API
        const obtenerAliados = async () => {
            const token = sessionStorage.getItem("token");

            try {
                const response = await fetch("/api/abm/obtenercomercios", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ Token: token }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setAliados(data); // Actualizamos el estado con los aliados recibidos
                } else {
                    console.error("Error al obtener los aliados");
                }
            } catch (error) {
                console.error("Error en la conexión", error);
            }
        };

        obtenerAliados();
    }, []); // Ejecuta solo una vez al montar el componente

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        if (
            formData.CanalAtencion === "" ||
            formData.Tipo === "" ||
            formData.Aliado === "" ||
            formData.Motivo === "" ||
            formData.Estado === "" ||
            formData.Observaciones===""
        ) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Llene correctamente los campos.",
            });
            return;
        }

        // Añadimos el token al formData antes de enviarlo
        const dataToSend = {
            ...formData,
            Token: token
        };

        try {
            const response = await fetch("/api/calidad/crearnuevodatopanel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Datos guardados",
                    text: "Los datos han sido guardados exitosamente.",
                }).then(() => {
                    setFormData({
                        CanalAtencion: "",
                        Tipo: "",
                        Aliado: "",
                        Motivo: "",
                        Estado: "",
                        Observaciones: "",
                        Token: "" // Mantener el token vacío o como estaba
                    });
                    window.location.reload();
                });
                // Limpiar el formulario restableciendo el estado
                
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrio un error al enviar los datos.",
                });;
            }
        } catch (error) {
            alert("Error en la conexión");
        }
    };

    return (
        <section className={
            darkMode
              ? "container cuadro-calificaciones-dark"
              : "container cuadro-calificaciones"
          }  style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%"
        }}>
            
            <form onSubmit={handleSubmit} style={{
                
                    width: "100%",
                    maxWidth: "700px",
                    padding: "20px",
                    borderRadius: "10px",
                    
                }}>
                <div className="form-group">
                    <label htmlFor="canalAtencion" className= {darkMode
                      ? "text-white  border-0 lato-regular fs-16 py-3"
                      : "text-dark  border-0 lato-regular fs-16 py-3"} >Canal de Atención</label >
                    <select className="form-control" id="canalAtencion" name="CanalAtencion" value={formData.CanalAtencion} onChange={handleChange} required style={{ width: "100%", padding: "10px", fontSize: "1rem", borderRadius: "50px", border: "2px solid #D0D7E2"}}>
                        <option value="">Seleccione una opción</option>
                        <option value="Comanda">Comanda</option>
                        <option value="Correo Electrónico">Correo Electrónico</option>
                        <option value="Meet">Meet</option>
                        <option value="Mensajería Instantánea">Mensajería Instantánea (WhatsApp)</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Teléfono">Teléfono</option>
                        <option value="Otros">Otros</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="tipo" className= {darkMode
                      ? "text-white  border-0 lato-regular fs-16 py-3"
                      : "text-dark  border-0 lato-regular fs-16 py-3"} >Tipo</label>
                    <select className="form-control" id="tipo" name="Tipo" value={formData.Tipo} onChange={handleChange} required style={{ width: "100%", padding: "10px", fontSize: "1rem", borderRadius: "50px", border: "2px solid #D0D7E2"}}>
                        <option value="">Seleccione una opción</option>
                        <option value="Comanda">Comanda</option>
                        <option value="Informacion General">Información General</option>
                        <option value="Pedido">Pedido</option>
                        <option value="Reunión">Reunión</option>
                        <option value="Soporte Técnico">Soporte Técnico</option>
                        <option value="Otros">Otros</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="aliado" className= {darkMode
                      ? "text-white  border-0 lato-regular fs-16 py-3"
                      : "text-dark  border-0 lato-regular fs-16 py-3"} >Aliado</label>
                    <select className="form-control" id="aliado" name="Aliado" value={formData.Aliado} onChange={handleChange} required style={{ width: "100%", padding: "10px", fontSize: "1rem", borderRadius: "50px", border: "2px solid #D0D7E2"}}>
                        <option value="">Seleccione una opción</option>
                        <option value="Proveedor">Proveedor</option>
                        <option value="Otros">Otros</option>
                        {aliados.map((aliado, index) => (
                            <option key={index} value={aliado}>{aliado}</option>
                        ))}
                    </select>
                </div>

                {/* <div className="form-group">
                    <label htmlFor="motivo" className= {darkMode
                      ? "text-white  border-0 lato-regular fs-16 py-3"
                      : "text-dark  border-0 lato-regular fs-16 py-3"}>Motivo</label>
                    <select className="form-control" id="motivo" name="Motivo" value={formData.Motivo} onChange={handleChange} required style={{ width: "100%", padding: "10px", fontSize: "1rem", borderRadius: "50px", border: "2px solid #D0D7E2"}}>
                        <option value="">Seleccione una opción</option>
                        <option value="Agrega Tarjetas Provinciales">Agrega Tarjetas Provinciales</option>
                        <option value="Agrega Terminal">Agrega Terminales</option>
                        <option value="Alta">Alta</option>
                        <option value="Auditoría Cupones">Auditoría Cupones</option>
                        <option value="Autorizacion">Autorizacion</option>

                        <option value="Baja - Cierre Comercio">Baja - Cierre Comercio</option>
                        <option value="Baja - Otro Proveedor">Baja - Otro Proveedor</option>
                        <option value="Baja Facturación">Baja Facturación</option>
                        <option value="Capacitación - Medios de Pagos">Capacitación - Medios de Pagos</option>
                        <option value="Capacitación - Panel">Capacitación - Panel</option>
                        <option value="Cerrado - Fuera de Horario">Cerrado - Fuera de Horario</option>
                        <option value="Cerrado - Mantenimiento">Cerrado - Mantenimiento</option>
                        <option value="Cerrado - Vacaciones">Cerrado - Vacaciones</option>
                        <option value="Consulta Sobre mi Liquidación">Consulta Sobre mi Liquidación</option>
                        <option value="Contacto Telefonico">Contacto Telefonico</option>
                        <option value="Encuesta">Encuesta</option>
                        <option value="Entrega Terminal">Entrega Terminal</option>
                        <option value="Extracción Reporte Mensual">Extracción Reporte Mensual</option>
                        <option value="Fidelización">Fidelización</option>
                        <option value="Modificación de Datos"> Modificación de Datos</option>
                        <option value="Modificación de Terminal">Modificación de Terminal</option>
                        <option value="Prospecto">Prospecto</option>
                        <option value="Recepcion de Fichas">Recepcion de Fichas</option>
                        <option value="Recepcion de Terminales">Recepcion de Terminales</option>

                        <option value="Reposición Rollo">Reposición Rollo</option>
                        <option value="Retiro Terminal">Retiro Terminal</option>
                        <option value="Reubicación Terminal">Reubicación Terminal</option>
                        <option value="Cadetería">Cadetería</option>
                        <option value="Carga Legajos">Carga Legajos</option>
                        <option value="QR">QR</option>

                        <option value="Otros">Otros</option>

                    </select>
                </div> */}
                <div className="form-group">
                    <label htmlFor="motivo" className= {darkMode
                      ? "text-white  border-0 lato-regular fs-16 py-3"
                      : "text-dark  border-0 lato-regular fs-16 py-3"}>Motivo</label>
                    <select className="form-control" id="motivo" name="Motivo" value={formData.Motivo} onChange={handleChange} required style={{ width: "100%", padding: "10px", fontSize: "1rem", borderRadius: "50px", border: "2px solid #D0D7E2"}}>
                        <option value="">Seleccione una opción</option>
                        <option value="ZOCO CHECK">ZOCO CHECK </option>
                        <option value="ZOCO MEET">ZOCO MEET</option>
                        <option value="ZOCO SEGUROS">ZOCO SEGUROS</option>
                        <option value="ZOCO AUDITORIA">ZOCO AUDITORIA</option>
                        <option value="ZOCO AYUDA">ZOCO AYUDA</option>

                        <option value="ZOCO STOP">ZOCO STOP</option>
                        <option value="ZOCO CONNECT">ZOCO CONNECT</option>

                        <option value="ZOCO SOLUCIONES A MEDIDA">ZOCO SOLUCIONES A MEDIDA</option>
                        <option value="ZOCO ARANCELES">ZOCO ARANCELES</option>
                        <option value="ZOCO REWARDS">ZOCO REWARDS</option>
                        <option value="ZOCO ENVIOS">ZOCO ENVIOS</option>
                        <option value="ZOCO FACTURACION">ZOCO FACTURACION</option>
                        <option value="ROBO TERMINAL">ROBO TERMINAL</option>
                        <option value="ENVIO ROLLOS">ENVIO ROLLOS</option>
                        <option value="SERVICIO TECNICO">SERVICIO TECNICO</option>
                        <option value="INCORPORACION DE TARJETAS">INCORPORACION DE TARJETAS</option>

                        <option value="Otros">Otros</option>

                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="estado" className= {darkMode
                      ? "text-white  border-0 lato-regular fs-16 py-3"
                      : "text-dark  border-0 lato-regular fs-16 py-3"} >Estado</label>
                    <select className="form-control" id="estado" name="Estado" value={formData.Estado} onChange={handleChange} required style={{ width: "100%", padding: "10px", fontSize: "1rem", borderRadius: "50px", border: "2px solid #D0D7E2"}}>
                        <option value="">Seleccione una opción</option>
                        <option value="Cerrado">Cerrado</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En Espera de Respuesta">En Espera de Respuesta</option>
                        <option value="Otros">Otros</option>

                    </select>
                </div>

                <div className="form-group" style={{marginTop:"10px"}}>
                    <label htmlFor="observaciones" style={{ fontWeight: "lato", marginBottom: "5px" }}>Observaciones</label>
                    <textarea className="form-control" id="observaciones" name="Observaciones" required style={{borderRadius:"50px", border:"2px solid #D0D7E2"}} value={formData.Observaciones} onChange={handleChange} />
                </div>

                <button type="submit" className="btn lato-bold" style={{borderRadius: "23px", top: "848px",
left: "1343px",
width: "182px",
height: "44px",
background: "#B4C400",
color:"#FFFFFF",
marginTop:"10px"}}>Enviar</button>
            </form>
        

        </section>
        
        
    );
};

export default FormularioCargarCRMInterno;
