import React, {useContext, useState} from 'react'
import { DarkModeContext } from "../../context/DarkModeContext";
import { Table } from 'react-bootstrap';
import './tabla.css'

const OrdenPago = ({historialDatos}) => {
    const {darkMode}=useContext(DarkModeContext)
    const today = new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const convertirNumero = (numeroString) => {
        if (!numeroString) return 0; // Si el valor es nulo o vacío, devolvemos 0
        return parseFloat(numeroString.replace(/\./g, "").replace(",", "."));
    };
    const calcularTotales = () => {
        const totales = {
          bruto: 0,
          arancel: 0,
          iva: 0,
          costoTrans: 0,
          costoFinanciero: 0,
          costoAnticipo: 0,
          retGanancias: 0,
          retIIBB: 0,
          retIVA: 0,
          totalOp: 0,
      };
  
      // Sumar los valores de cada campo en historialDatos
      historialDatos.forEach((dato) => {
          totales.bruto += convertirNumero(dato.montoinicial);
          totales.arancel += convertirNumero(dato.comisionMasIva);
          totales.iva += convertirNumero(dato.ivaFinal);
          totales.costoTrans += convertirNumero(dato.debcredFinal);
          totales.costoFinanciero += convertirNumero(dato.costoTarjeta);
          totales.costoAnticipo += convertirNumero(dato.costoAnticipo); // Ajustar si hay otro campo
          totales.retGanancias += convertirNumero(dato.gananciaFinal);
          totales.retIIBB += convertirNumero(dato.alicuotaFinal);
          totales.retIVA += convertirNumero(dato.ivaFinal);
          totales.totalOp += convertirNumero(dato.bruto);
      });
  
        return totales;
    };
    const totales = calcularTotales();

    const getNeto = (dato) =>{
        const neto= convertirNumero(dato.montoinicial)
        const netoFinal= neto - convertirNumero(dato.sumComision)- convertirNumero(dato.sumIvaComision) - convertirNumero(dato.debcredFinal) -convertirNumero(dato.costoTarjeta) - convertirNumero(dato.costoAnticipo) - convertirNumero(dato.alicuotaFinal)
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2, // Dos decimales
        }).format(netoFinal)
    }
  return (
    <div>
        <section className="container ">
      <div className="row">
        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold fs-14"> HOY SE ACREDITA</h6>
          <div
            className={
              darkMode
                ? " bg-data-header-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data-header  border-0 quitar-cursor-pointer"
            }
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "82px", // Asegúrate de que coincida con la altura del círculo
              }}
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-14">
            {new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(totales.totalOp)}
            </div>
          </div>
        </article>

        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold fs-14"> ACUMULADO</h6>
          <div
            className={
              darkMode
                ? " bg-data-header-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data-header  border-0 quitar-cursor-pointer"
            }
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "82px", // Asegúrate de que coincida con la altura del círculo
              }}
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-14">
            ${" "}
            {[0]}
            </div>
          </div>
        </article>

        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold fs-14"> DÉBITO</h6>
          <div
            className={
              darkMode
                ? " bg-data-header-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data-header  border-0 quitar-cursor-pointer"
            } 
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "82px", // Asegúrate de que coincida con la altura del círculo
              }}
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-14">
              $ {[0]}
            </div>
          </div>
        </article>

        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold fs-14"> CRÉDITO</h6>
          <div
            className={
              darkMode
                ? " bg-data-header-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data-header  border-0 quitar-cursor-pointer"
            }
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "82px", // Asegúrate de que coincida con la altura del círculo
              }}
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-14">
              $ {[0]}
            </div>
          </div>
        </article>
      </div>
    </section>
    

    
                <div
                    className={
                        darkMode
                            ? "container tabla-footer "
                            : "container tabla-footer "
                    }
                >
                        
                            <Table table table-borderless responsive striped hover>
                                <thead className="bg-dark py-2">
                                    <tr className="text-center tabla-thead">
                                      
                                        
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-10 py-3"
                                                    : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-10 py-3"
                                            }
                                            scope="col"
                                        >
                                            Fecha OP
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-10 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-10 py-3"
                                            }
                                            scope="col"
                                        >
                                            Tarjeta
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-10 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-10 py-3"
                                            }
                                            scope="col"
                                        >
                                            Cuotas
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-10 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-10 py-3"
                                            }
                                            scope="col"
                                        >
                                            Bruto
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-10 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-10 py-3"
                                            }
                                            scope="col"
                                        >
                                            Costo<br/>Financiero
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-10 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-10 py-3"
                                            }
                                            scope="col"
                                        >
                                            Costo Anticip.
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-10 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-10 py-3"
                                            }
                                            scope="col"
                                        >
                                            Arancel
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-10 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-10 py-3"
                                            }
                                            scope="col"
                                        >
                                            IVA
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-10 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-10 py-3"
                                            }
                                            scope="col"
                                        >
                                            Cost. Trans.
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-10 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-10 py-3"
                                            }
                                            scope="col"
                                        >
                                            Ret. IIBB.
                                        </th>
                                        {/* <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            }
                                            scope="col"
                                        >
                                            Ret. Ganancias.
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            }
                                            scope="col"
                                        >
                                            Ret. IVA.
                                        </th> */}
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla-derecha border-0 lato-regular fs-10 py-3"
                                                    : "bg-dark text-white border-tabla-derecha border-0 lato-regular fs-10 py-3"
                                            }
                                            scope="col"
                                        >
                                            Total OP.
                                        </th>
                                    


                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {/* Renderizar tabla vacía si no hay datos */}
                                    {historialDatos.length > 0 ? (
              historialDatos.map((dato, index) => (
                                   
                                            <tr
                                                className={
                                                    darkMode ? "bg-dark text-white" : "bg-white text-dark"
                                                }
                                              
                                                // key={}
                                            >
                                              
                                                
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-10 lato-bold py-4 prority-4 text-white "
                                                            : "fs-10 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    {today}
                                                </td>
                                                {dato.tarjeta==="American Express"? (
                                                <td
                                                id='tdTarjeta'
                                                className={
                                                    darkMode
                                                        ? "fs-10 lato-bold py-4 prority-4 text-white "
                                                        : "fs-10 lato-bold py-4 prority-4 "
                                                }
                                            >
                                               {dato.tarjeta} {" "} {dato.tipoDebCred}
                                            </td>) :( 
                                                <td
                                                className={
                                                    darkMode
                                                        ? "fs-10 lato-bold py-4 prority-4 text-white "
                                                        : "fs-10 lato-bold py-4 prority-4 "
                                                }
                                            >
                                               {dato.tarjeta} {" "} {dato.tipoDebCred}
                                            </td>
                                            )
                                                }
                                                
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-10 lato-bold py-4 prority-4 text-white "
                                                            : "fs-10 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    {dato.cuota}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-10 lato-bold py-4 prority-4 text-white "
                                                            : "fs-10 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.montoinicial}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-10 lato-bold py-4 prority-4 text-white "
                                                            : "fs-10 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.costoTarjeta}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-10 lato-bold py-4 prority-4 text-white "
                                                            : "fs-10 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.costoAnticipo}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-10 lato-bold py-4 prority-4 text-white "
                                                            : "fs-10 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.sumComision}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-10 lato-bold py-4 prority-4 text-white "
                                                            : "fs-10 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.sumIvaComision}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-10 lato-bold py-4 prority-4 text-white "
                                                            : "fs-10 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.debcredFinal}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-10 lato-bold py-4 prority-4 text-white "
                                                            : "fs-10 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.alicuotaFinal}
                                                </td>
                                                {/* <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    }
                                                >
                                                    {dato.gananciaFinal}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    }
                                                >
                                                    {dato.ivaFinal}
                                                </td> */}
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-10 lato-bold py-4 prority-4 text-white "
                                                            : "fs-10 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    {getNeto(dato)}
                                                </td>
                                                
                              

                          
                      </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="14">No hay datos disponibles</td>
                      </tr>
                    )}

                                </tbody>
                            </Table>
                        </div>
                    

                

    </div>
  )
}

export default OrdenPago