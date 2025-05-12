import React, { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import Swal from "sweetalert2";

const FormularioAuditoria = () => {
    const { darkMode } = useContext(DarkModeContext);
    const [formData, setFormData] = useState({
        Actividad: "",
        Estado: "",
        EstadoAuditoria: "",
        Empleado: "",
        Observaciones: "",
        Gestora: "",
        Aliado: "",
        Fecha:"",
        Motivo:"",
        InteresAyudar: "",
        Explicacion: "",
        ContenemosAliado: "",
        OptimizamosTiempo:"",
        InformacionIncorrecta: "",
        Errores: "",
        Plazos: "",
        Facturacion: "",
        Token: "" // Mantén el token en el estado
    });

    const [aliados, setAliados] = useState([]); // Estado para guardar la lista de aliados

    const [empleados, setEmpleados] = useState([]); // Estado para guardar la lista de aliados
    const [isWhatsAppAudit, setIsWhatsAppAudit] = useState(false); // Para manejar el cambio dinámico del formulario

    useEffect(() =>{
        const obtenerUsuarios = async () => {
            try {
                const response = await fetch("/api/usuarios/obtenerusuarios", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setEmpleados(data);  // Guardamos los empleados en el estado
                } else {
                    console.error("Error al obtener los empleados");
                }
            } catch (error) {
                console.error("Error en la conexión", error);
            }
        };
        obtenerUsuarios();
        const obtenerAliados = async ()=>{
            const token = sessionStorage.getItem("token");

            try {
                const response = await fetch("/api/abm/obteneraliados", {
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
        }
        obtenerAliados()

    },[])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (e.target.name === "Actividad" && e.target.value === "Auditoria WhatsApp") {
            setIsWhatsAppAudit(true);
        } else if (e.target.name === "Actividad") {
            setIsWhatsAppAudit(false);
        }
        
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");

        if (
            formData.Actividad === "" ||
            formData.EstadoAuditoria === "" ||
            formData.Observaciones === ""
        ) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Llene correctamente los campos.",
            });
            return;
        }
        let dataToSend = {
            Actividad: formData.Actividad,
            EstadoAuditoria: formData.EstadoAuditoria,
            Observaciones: formData.Observaciones,
            Token: token
        };

        if (isWhatsAppAudit) {
            // Si es Auditoría WhatsApp, enviamos los campos específicos
            dataToSend = {
                ...dataToSend,
                Gestora: formData.Gestora,
                Aliado: formData.Aliado,
                Fecha:formData.Fecha,
                Motivo:formData.Motivo,
                InteresAyudar: formData.InteresAyudar,
                Explicacion: formData.Explicacion,
                ContenemosAliado: formData.ContenemosAliado,
                OptimizamosTiempo:formData.OptimizamosTiempo,
                InformacionIncorrecta: formData.InformacionIncorrecta,
                Errores: formData.Errores,
                Plazos: formData.Plazos,
                Facturacion: formData.Facturacion
            };
        } else {
            // Para las otras actividades, enviamos los campos Estado y Empleado
            dataToSend = {
                ...dataToSend,
                Estado: formData.Estado,
                Empleado: formData.Empleado
            };
        }

        // Añadimos el token al formData antes de enviarlo
        // const dataToSend = {
        //     ...formData,
        //     Token: token
        // };

        try {
            const response = await fetch("/api/panelinternocalidad/crearnuevodatopanel", {
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
                        Actividad: "",
                        Estado: "",
                        EstadoAuditoria: "",
                        Empleado: "",
                        Observaciones: "",
                        Token: ""
                    });
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrió un error al enviar los datos.",
                });
            }
        } catch (error) {
            alert("Error en la conexión");
        }
    };

    return (
        <section
            className={
                darkMode
                    ? "container cuadro-calificaciones-dark"
                    : "container cuadro-calificaciones"
            }
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100%",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    width: "100%",
                    maxWidth: "700px",
                    padding: "20px",
                    borderRadius: "10px",
                }}
            >
                <div className="form-group">
                    <label
                        htmlFor="canalAtencion"
                        className={
                            darkMode
                                ? "text-white  border-0 lato-regular fs-16 py-3"
                                : "text-dark  border-0 lato-regular fs-16 py-3"
                        }
                    >
                        Actividad
                    </label>
                    <select
                        className="form-control"
                        id="canalAtencion"
                        name="Actividad"
                        value={formData.Actividad}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "1rem",
                            borderRadius: "50px",
                            border: "2px solid #D0D7E2",
                        }}
                    >
                        <option value="">Seleccione una opción</option>
                        <option value="Analisis">Analisis</option>
                        <option value="Correo Electrónico">Auditoría Mail</option>
                        <option value="Auditoria WhatsApp">Auditoria WhatsApp</option>
                        <option value="Auditoria Visitas">Auditoría Visitas</option>
                        <option value="Otros">Otros</option>
                        <option value="Procesos">Procesos</option>
                        <option value="Reunion">Reunion</option>
                    </select>
                </div>
                {/* Condicional: Campos adicionales si es Auditoría WhatsApp */}
                {isWhatsAppAudit ? (
                    <>
                        <div className="form-group">
                            <label htmlFor="Gestora">Gestora</label>
                            <select
                                className="form-control"
                                id="Gestora"
                                name="Gestora"
                                value={formData.Gestora}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    fontSize: "1rem",
                                    borderRadius: "50px",
                                    border: "2px solid #D0D7E2",
                                }}
                            >
                                <option value="">Seleccione una gestora</option>
                                {empleados.map((empleado, index) => (
                                    <option key={index} value={empleado.id}>
                                        {empleado.nombre}
                                    </option>
                                ))}
                                <option value="SinIdentificar">Sin identificar</option>
                            </select>
                        </div>


                        <div className="form-group">
                            <label htmlFor="Aliado">Aliado</label>
                            <select
                                className="form-control"
                                id="Aliado"
                                name="Aliado"
                                value={formData.Aliado}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    fontSize: "1rem",
                                    borderRadius: "50px",
                                    border: "2px solid #D0D7E2",
                                }}
                            >
                                <option value="">Seleccione un Aliado</option>
                                {aliados.map((aliado, index) => (
                            <option key={index} value={aliado}>{aliado}</option>
                        ))}
                        <option value="Otros">Otros</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="Fecha">Fecha</label>
                            <input
                   type="date"
                   id="Fecha"
                   className="form-control"
                   name="Fecha"  // Asegúrate de que el name sea "Fecha"
                   value={formData.Fecha ? formData.Fecha : new Date().toISOString().split("T")[0]}
                   onChange={handleChange}
                   style={{
                     width: "auto", // Ajusta el tamaño del input a lo necesario
                     height: "44px", // Ajusta la altura para que coincida con la del botón
                     background: "#DCDEE1",
                     marginRight: "15px", //
                     borderRadius: "32px"
                   }}
                 />
                
                        </div>
                        <div className="form-group" style={{ marginTop: "10px" }}>
                    <label htmlFor="motivo" style={{ fontWeight: "lato", marginBottom: "5px" }}>
                        Motivo
                    </label>
                    <textarea
                        className="form-control"
                        id="motivo"
                        name="Motivo"
                        required
                        style={{ borderRadius: "50px", border: "2px solid #D0D7E2" }}
                        value={formData.Motivo}
                        onChange={handleChange}
                    />
                </div>


                        {/* Radio buttons */}
                        <label style={{ fontWeight: "bold", fontSize: "1.2rem", marginTop: "20px" }}>
                    Relacionamiento
                </label>
                        <div className="form-group" style={{ display: "flex", justifyContent: "space-between" }}>
                        
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        {/* Radio Buttons a la izquierda */}
                        <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Demostramos interés en ayudarlo</label>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <label style={{ marginRight: "20px" }}>
                            <input
            type="radio"
            name="InteresAyudar"
            value="SI"
            checked={formData.InteresAyudar === "SI"}
            onChange={handleChange}
            style={{
                opacity: 0,
                position: "absolute",
                width: "20px",
                height: "20px",
                cursor: "pointer",
            }}
        />
        <span
            style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                border: formData.InteresAyudar === "SI" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                backgroundColor: formData.InteresAyudar === "SI" ? "#B4C400" : "white",
                marginRight: "10px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
            }}
        ></span>
        Sí
                        </label>
                        <label style={{ marginRight: "20px" }}>
                        <input
            type="radio"
            name="InteresAyudar"
            value="NO"
            checked={formData.InteresAyudar === "NO"}
            onChange={handleChange}
            style={{
                opacity: 0,
                position: "absolute",
                width: "20px",
                height: "20px",
                cursor: "pointer",
            }}
        />
        <span
            style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                border: formData.InteresAyudar === "NO" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                backgroundColor: formData.InteresAyudar === "NO" ? "#B4C400" : "white",
                marginRight: "10px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
            }}
        ></span>
        NO
                        </label>
                        <label style={{ marginRight: "20px" }}>
                        <input
            type="radio"
            name="InteresAyudar"
            value="NA"
            checked={formData.InteresAyudar === "NA"}
            onChange={handleChange}
            style={{
                opacity: 0,
                position: "absolute",
                width: "20px",
                height: "20px",
                cursor: "pointer",
            }}
        />
        <span
            style={{
                display: "inline-block",
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                border: formData.InteresAyudar === "NA" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                backgroundColor: formData.InteresAyudar === "NA" ? "#B4C400" : "white",
                marginRight: "10px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
            }}
        ></span>
    
                            N/A
                        </label>
                        </div>
                        <div className="form-group">
                            <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Explicamos de manera simple y segura</label>
                            <div className="radio-options" style={{ display: "flex", flexDirection: "row" }}>
                                <label style={{ marginRight: "20px" }}>
                                    <input
                                        type="radio"
                                        name="Explicacion"
                                        value="SI"
                                        checked={formData.Explicacion === "SI"}
                                        onChange={handleChange}
                                        style={{
                                            opacity: 0,
                                            position: "absolute",
                                            width: "20px",
                                            height: "20px",
                                            cursor: "pointer",
                                        }}
                                    /><span
                                    style={{
                                        display: "inline-block",
                                        width: "15px",
                                        height: "15px",
                                        borderRadius: "50%",
                                        border: formData.Explicacion === "SI" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                        backgroundColor: formData.Explicacion === "SI" ? "#B4C400" : "white",
                                        marginRight: "10px",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s ease",
                                    }}
                                ></span>
                                    Sí
                                </label>
                                <label style={{ marginRight: "20px" }}>
                                    <input
                                        type="radio"
                                        name="Explicacion"
                                        value="NO"
                                        checked={formData.Explicacion === "NO"}
                                        onChange={handleChange}
                                        style={{
                                            opacity: 0,
                                            position: "absolute",
                                            width: "20px",
                                            height: "20px",
                                            cursor: "pointer",
                                        }}
                                    />
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "15px",
                                            height: "15px",
                                            borderRadius: "50%",
                                            border: formData.Explicacion === "NO" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                            backgroundColor: formData.Explicacion === "NO" ? "#B4C400" : "white",
                                            marginRight: "10px",
                                            cursor: "pointer",
                                            transition: "background-color 0.3s ease",
                                        }}
                                    ></span>
                                    No
                                </label>
                                <label style={{ marginRight: "20px" }}>
                                    <input
                                        type="radio"
                                        name="Explicacion"
                                        value="NA"
                                        checked={formData.Explicacion === "NA"}
                                        onChange={handleChange}
                                        style={{
                                            opacity: 0,
                                            position: "absolute",
                                            width: "20px",
                                            height: "20px",
                                            cursor: "pointer",
                                        }}
                                    />
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "15px",
                                            height: "15px",
                                            borderRadius: "50%",
                                            border: formData.Explicacion === "NA" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                            backgroundColor: formData.Explicacion === "NA" ? "#B4C400" : "white",
                                            marginRight: "10px",
                                            cursor: "pointer",
                                            transition: "background-color 0.3s ease",
                                        }}
                                    ></span>
                                    N/A
                                </label>
                            </div>
                        </div>
                        
                    </div>

                    <div style={{ marginLeft: "40px" }}>
                        <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Contenemos al Aliado</label>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="ContenemosAliado"
                                value="SI"
                                checked={formData.ContenemosAliado === "SI"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.ContenemosAliado === "SI" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.ContenemosAliado === "SI" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            Sí
                        </label>
                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="ContenemosAliado"
                                value="NO"
                                checked={formData.ContenemosAliado === "NO"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.ContenemosAliado === "NO" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.ContenemosAliado === "NO" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            No
                        </label>
                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="ContenemosAliado"
                                value="NA"
                                checked={formData.ContenemosAliado === "NA"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.ContenemosAliado === "NA" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.ContenemosAliado === "NA" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            N/A
                        </label>
                        </div>
                        <label style={{ fontWeight: "bold", marginBottom: "5px", marginTop: "15px" }}>Optimizamos los tiempos
                            <br></br> <span>de manera correcta</span>
                        </label>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="OptimizamosTiempo"
                                value="SI"
                                checked={formData.OptimizamosTiempo === "SI"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.OptimizamosTiempo === "SI" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.OptimizamosTiempo === "SI" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            Sí
                        </label>
                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="OptimizamosTiempo"
                                value="NO"
                                checked={formData.OptimizamosTiempo === "NO"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.OptimizamosTiempo === "NO" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.OptimizamosTiempo === "NO" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            No
                        </label>
                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="OptimizamosTiempo"
                                value="NA"
                                checked={formData.OptimizamosTiempo === "NA"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.OptimizamosTiempo === "NA" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.OptimizamosTiempo === "NA" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            N/A
                        </label>
                        </div>
                         
                        
                    </div>
                </div>

                {/* KPIs label debajo de los Radio Buttons */}
                <label style={{ fontWeight: "bold", fontSize: "1.2rem", marginTop: "20px" }}>
                    KPIs
                </label>

                <div className="form-group" style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <div>
                        {/* Información Incorrecta y Errores a la izquierda */}
                        <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Información incorrecta/incompleta</label>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="InformacionIncorrecta"
                                value="SI"
                                checked={formData.InformacionIncorrecta === "SI"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.InformacionIncorrecta === "SI" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.InformacionIncorrecta === "SI" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            Sí
                        </label>
                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="InformacionIncorrecta"
                                value="NO"
                                checked={formData.InformacionIncorrecta === "NO"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.InformacionIncorrecta === "NO" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.InformacionIncorrecta === "NO" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            No
                        </label>
                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="InformacionIncorrecta"
                                value="NA"
                                checked={formData.InformacionIncorrecta === "NA"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.InformacionIncorrecta === "NA" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.InformacionIncorrecta === "NA" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            N/A
                        </label>
                        </div>
                        
                        <label style={{ fontWeight: "bold", marginBottom: "5px", marginTop: "15px" }}>
                            Errores de ortografía
                        </label>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="Errores"
                                value="SI"
                                checked={formData.Errores === "SI"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.Errores === "SI" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.Errores === "SI" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            Sí
                        </label>
                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="Errores"
                                value="NO"
                                checked={formData.Errores === "NO"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.Errores === "NO" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.Errores === "NO" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            No
                        </label>
                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="Errores"
                                value="NA"
                                checked={formData.Errores === "NA"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.Errores === "NA" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.Errores === "NA" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            N/A
                        </label>
                        </div>
                        
                    </div>

                    <div style={{ marginLeft: "40px" }}>
                        {/* Plazos y Facturación a la derecha */}
                        <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Plazos</label>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="Plazos"
                                value="SI"
                                checked={formData.Plazos === "SI"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.Plazos === "SI" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.Plazos === "SI" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            Sí
                        </label>
                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="Plazos"
                                value="NO"
                                checked={formData.Plazos === "NO"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.Plazos === "NO" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.Plazos === "NO" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            No
                        </label>
                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="Plazos"
                                value="NA"
                                checked={formData.Plazos === "NA"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.Plazos === "NA" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.Plazos === "NA" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            N/A
                        </label>
                        </div>
                        

                        <label style={{ fontWeight: "bold", marginBottom: "5px", marginTop: "15px" }}>Facturación</label>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                             <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="Facturacion"
                                value="SI"
                                checked={formData.Facturacion === "SI"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.Facturacion === "SI" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.Facturacion === "SI" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            Sí
                        </label>
                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="Facturacion"
                                value="NO"
                                checked={formData.Facturacion === "NO"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.Facturacion === "NO" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.Facturacion === "NO" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            No
                        </label>
                        <label style={{ marginRight: "20px" }}>
                            <input
                                type="radio"
                                name="Facturacion"
                                value="NA"
                                checked={formData.Facturacion === "NA"}
                                onChange={handleChange}
                                style={{
                                    opacity: 0,
                                    position: "absolute",
                                    width: "20px",
                                    height: "20px",
                                    cursor: "pointer",
                                }}
                            />
                            <span
                                style={{
                                    display: "inline-block",
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    border: formData.Facturacion === "NA" ? "2px solid #B4C400" : "2px solid #D0D7E2",
                                    backgroundColor: formData.Facturacion === "NA" ? "#B4C400" : "white",
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    transition: "background-color 0.3s ease",
                                }}
                            ></span>
                            N/A
                        </label>
                        </div>
                       
                            </div>
                        </div>

                        {/* Repetimos lo mismo para los otros checkboxes: Información Incorrecta, Plazos, Facturación, etc. */}
                    </>
                ) : (
                    <>
                        <div className="form-group">
                            <label
                                htmlFor="tipo"
                                className={
                                    darkMode
                                        ? "text-white  border-0 lato-regular fs-16 py-3"
                                        : "text-dark  border-0 lato-regular fs-16 py-3"
                                }
                            >
                                Estado
                            </label>
                            <select
                                className="form-control"
                                id="tipo"
                                name="Estado"
                                value={formData.Estado}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    fontSize: "1rem",
                                    borderRadius: "50px",
                                    border: "2px solid #D0D7E2",
                                }}
                            >
                                <option value="">Seleccione una opción</option>
                                <option value="Cerrado">Cerrado</option>
                                <option value="Otros">Otros</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Transferencia">Transferencia</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label
                                htmlFor="empleado"
                                className={
                                    darkMode
                                        ? "text-white  border-0 lato-regular fs-16 py-3"
                                        : "text-dark  border-0 lato-regular fs-16 py-3"
                                }
                            >
                                Empleado
                            </label>
                            <select className="form-control"
                                id="empleado"
                                name="Empleado"
                                onChange={handleChange}
                                required
                                value={formData.Empleado}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    fontSize: "1rem",
                                    borderRadius: "50px",
                                    border: "2px solid #D0D7E2",
                                }} >
                                {empleados.map((empleado, index) => (
                                    <option key={index} value={empleado.id}>{empleado.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {/* <div className="form-group">
                    <label
                        htmlFor="tipo"
                        className={
                            darkMode
                                ? "text-white  border-0 lato-regular fs-16 py-3"
                                : "text-dark  border-0 lato-regular fs-16 py-3"
                        }
                    >
                        Estado
                    </label>
                    <select
                        className="form-control"
                        id="tipo"
                        name="Estado"
                        value={formData.Estado}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "1rem",
                            borderRadius: "50px",
                            border: "2px solid #D0D7E2",
                        }}
                    >
                        <option value="">Seleccione una opción</option>
                        <option value="Cerrado">Cerrado</option>
                        <option value="Otros">Otros</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Transferencia">Transferencia</option>
                    </select>
                </div> */}

                <div className="form-group">
                    <label
                        htmlFor="estadoAuditoria"
                        className={
                            darkMode
                                ? "text-white  border-0 lato-regular fs-16 py-3"
                                : "text-dark  border-0 lato-regular fs-16 py-3"
                        }
                    >
                        Estado de Auditoría
                    </label>
                    <select
                        className="form-control"
                        id="estadoAuditoria"
                        name="EstadoAuditoria"
                        value={formData.EstadoAuditoria}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "1rem",
                            borderRadius: "50px",
                            border: "2px solid #D0D7E2",
                        }}
                    >
                        <option value="">Seleccione una opción</option>
                        <option value="Aprobado">Aprobado</option>
                        <option value="Desaprobado">Desaprobado</option>
                        <option value="No aplica">No aplica</option>
                    </select>
                </div>

                {/* Aquí cambiamos el select de Empleado por un input de texto
                <div className="form-group">
                    <label
                        htmlFor="empleado"
                        className={
                            darkMode
                                ? "text-white  border-0 lato-regular fs-16 py-3"
                                : "text-dark  border-0 lato-regular fs-16 py-3"
                        }
                    >
                        Empleado
                    </label>
                    <select className="form-control"
                        id="empleado"
                        name="Empleado"
                        onChange={handleChange}
                        required
                        value={formData.empleado}
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "1rem",
                            borderRadius: "50px",
                            border: "2px solid #D0D7E2",
                        }} >
                            {empleados.map((empleado,index)=>(
                                <option key={index} value={empleado.id}>{empleado.nombre}</option>
                            ))}

                    </select> */}
                    {/* <input
                        type="text"
                        className="form-control"
                        id="empleado"
                        name="Empleado"
                        value={formData.Empleado}
                        onChange={handleChange}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "1rem",
                            borderRadius: "50px",
                            border: "2px solid #D0D7E2",
                        }}
                    /> */}
                {/* </div> */}

                <div className="form-group" style={{ marginTop: "10px" }}>
                    <label htmlFor="observaciones" style={{ fontWeight: "lato", marginBottom: "5px" }}>
                        Observaciones
                    </label>
                    <textarea
                        className="form-control"
                        id="observaciones"
                        name="Observaciones"
                        required
                        style={{ borderRadius: "50px", border: "2px solid #D0D7E2" }}
                        value={formData.Observaciones}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    className="btn lato-bold"
                    style={{
                        borderRadius: "23px",
                        top: "848px",
                        left: "1343px",
                        width: "182px",
                        height: "44px",
                        background: "#B4C400",
                        color: "#FFFFFF",
                        marginTop: "10px",
                    }}
                >
                    Enviar
                </button>
            </form>
        </section>
    );
};

export default FormularioAuditoria;
