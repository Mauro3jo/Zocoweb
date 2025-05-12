import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { DarkModeContext } from "../../context/DarkModeContext";
import ReactSignatureCanvas from "react-signature-canvas";

const FormModificacionesNuevo = () => {
  const { control } = useForm();
  // Estado para almacenar datos del formulario
  const [formData, setFormData] = useState({});

  // Referencia para la firma digital
  const sigCanvas = useRef({});

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Capturar la firma en base64
    const firmaDigital = sigCanvas.current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    // Obtener el token del sessionStorage
    const token = sessionStorage.getItem("token");

    // Crear el objeto formData con los datos del formulario, la firma digital y el token
    const formDataWithToken = {
      ...formData,
      AltaFirmada: firmaDigital,
      token: token,
      };
     
    try {
      const response = await fetch("/api/formulario/formulariomodificarcrear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithToken),
      });

      if (!response.ok) {
        throw new Error("La respuesta de la red no fue correcta");
      }
      window.location.reload();
    } catch (error) {
      console.error("Hubo un error:", error);
    }
  };

  // Función para actualizar los datos del formulario
  const handleChange = (event) => {
    const { name, type, checked, value, files } = event.target;
    if (type === "checkbox") {
      let textValue = checked ? value : "";
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: textValue,
      }));
    } else if (type === "radio") {
      if (value === "Monotributista") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          condicionAFIP: value,
        }));
        setIsActiveResponsableInscripto(false);
      } else if (value === "Responsable Inscripto") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          condicionAFIP: value,
        }));
        setIsActiveResponsableInscripto(true);
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }
    }
    if (name === "Banco") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        Banco: value.label,
      }));
    } else if (name.startsWith("TipoCuenta")) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        TipoCuenta: value,
      }));
    }
    if (type === "file") {
      if (files.length > 0) {
        const file = files[0];
        convertToBase64(file, (base64) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: base64,
          }));
        });
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // funcion para convertir la base64.
  const convertToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
    reader.onerror = (error) => console.error("Error: ", error);
  };

  // estados para la logica dinamica de la pagina
  const [isActiveNombreFantasia, setIsActiveNombreFantasia] = useState(false);
  const [isActiveNombreComercio, setIsActiveNombreComercio] = useState(false);
  const [isActiveDomicilio, setIsActiveDomicilio] = useState(false);
  const [isActiveBocaPago, setIsActiveBocaPago] = useState(false);
  const [isActiveEmail, setIsActiveEmail] = useState(false);
  const [isActiveResponsableInscripto, setIsActiveResponsableInscripto] =
    useState(false);

  const [bancos, setBancos] = useState([]);

  useEffect(() => {
    const getbanco = async () => {
      const response = await fetch("/api/Banco/lista", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setBancos(data);
    };

    getbanco();
  }, []);

  // mapear las opciones de los bancos
  const optionsBancos = bancos.map((banco) => ({
    value: banco.nomBanco,
    label: banco.nomBanco, 
  }));

  return (
    <section className="container">
      <Form onSubmit={handleSubmit} autoComplete="off">
        <Row className="mb-3">
        <Form.Group as={Col} md="6" sm="12">
          <article>
              <label htmlFor="NombreComercio" className="fs-14 mb-2">
                Nombre del establecimiento
              </label>
              <Controller
                name="NombreComercio"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Ingresar el nombre del establecimiento"
                    className="input-formulario fs-14"
                    value={formData.NombreComercio}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        NombreComercio: val,
                      });
                      field.onChange(val);
                    }}
                  />
                )}
              />
            </article>
          </Form.Group>

        </Row>
        {/* BAJA SERVICIO TECNICO  */}
        <Row className="mx-1">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="BajaServicioTecnico"
              id="BajaServicioTecnico"
              value="Baja de servicio" // Valor asignado al checkbox
              onChange={handleChange}
            />
            <label
              className="form-check-label lato-bold fs-16"
              htmlFor="BajaServicioTecnico"
            >
              Baja Servicio Técnico
            </label>
          </div>
        </Row>
        <Row className="mb-1 pt-2">
          <Form.Group as={Col} md="6" sm="12">
            <Form.Label className="fs-14 mt-2">
              N° de terminal a dar de baja
            </Form.Label>
            <Form.Control
              type="text"
              name="NumeroTerminalBaja"
              required
              value={formData.NumeroTerminalBaja}
              onChange={handleChange}
              className="input-formulario fs-14"
              placeholder="Ingresar N° de terminal a dar de baja"
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Label className="fs-14 mt-2">Motivo de falla</Form.Label>
          <Form.Control
            className="input-comentario-form-bajas fs-14"
            as="textarea"
            name="Observacion"
            required
            value={formData.Observacion}
            onChange={handleChange}
            autoComplete="off"
            placeholder="Ingresar Motivo"
          />
        </Row>
        <Row>
          <Form.Group className="d-flex mt-2" as={Col} md="12">
            <Form.Label className="fs-14 mt-2">
              Registra operaciones pendientes:
            </Form.Label>
            <Form.Group className="mb-3 mx-3">
              <Form.Check
                type="radio"
                name="RegistraOperacionesPendientes"
                label="Si"
                value="Si"
                checked={formData.RegistraOperacionesPendientes === "Si"}
                onChange={handleChange}
                className="fs-14 mt-2"
              />
            </Form.Group>
            <Form.Group className="mb-3 mx-3">
              <Form.Check
                type="radio"
                name="RegistraOperacionesPendientes"
                label="No"
                value="No"
                checked={formData.RegistraOperacionesPendientes === "No"}
                onChange={handleChange}
                className="fs-14 mt-2"
              />
            </Form.Group>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group className="d-flex mt-2" as={Col} md="12">
            <Form.Label className="fs-14 mt-2">
              Registra operaciones con Tarjeta Naranja:
            </Form.Label>
            <Form.Group className="mb-3 mx-3">
              <Form.Check
                type="radio"
                name="RegistraOperacionesConTarjetaNaranja"
                label="Si"
                value="Si"
                checked={formData.RegistraOperacionesConTarjetaNaranja === "Si"}
                onChange={handleChange}
                className="fs-14 mt-2"
              />
            </Form.Group>
            <Form.Group className="mb-3 mx-3">
              <Form.Check
                className="fs-14 mt-2"
                type="radio"
                name="RegistraOperacionesConTarjetaNaranja"
                label="No"
                value="No"
                checked={formData.RegistraOperacionesConTarjetaNaranja === "No"}
                onChange={handleChange}
              />
            </Form.Group>
          </Form.Group>
        </Row>

        <Row>
          <Form.Group className="d-flex mt-2" as={Col} md="12">
            <Form.Label className="fs-14 mt-2">
              Adjunta cierre de Lote:
            </Form.Label>
            <Form.Group className="mb-3 mx-3">
              <Form.Check
                type="radio"
                name="AdjuntaCierreLote"
                label="Si"
                value="Si"
                checked={formData.AdjuntaCierreLote === "Si"}
                onChange={handleChange}
                className="fs-14 mt-2"
              />
            </Form.Group>
            <Form.Group className="mb-3 mx-3">
              <Form.Check
                type="radio"
                name="AdjuntaCierreLote"
                label="No"
                value="No"
                checked={formData.AdjuntaCierreLote === "No"}
                onChange={handleChange}
                className="fs-14 mt-2"
              />
            </Form.Group>
          </Form.Group>
        </Row>
        <section className="">
          <h6 className="fs-12">
            * Recuerde que una vez retirada de servicio técnico debe dar aviso
            indicando si quedan operaciones pendientes y adjunta cierre de lote
            correspondiente
          </h6>
        </section>
        <hr className="mb-3" />
        {/* NUM TERMINAL ALTA - TIPO MODIFICACION */}
        <Row className="mb-3">
          <Form.Group as={Col} md="5" sm="12">
            <Form.Label className="fs-14 pt-2">N° terminal (alta)</Form.Label>
            <Form.Control
              type="text"
              name="NumeroTerminalAltaL"
              required
              value={formData.NumeroTerminalAltaL}
              onChange={handleChange}
              className="input-formulario fs-14"
              placeholder="Ingresar N° terminal (alta)"
            />
          </Form.Group>
          <Form.Group as={Col} md="7" sm="12">
            <Form.Label className="fs-14 mt-2">Tipo de modificación</Form.Label>
            <Form.Control
              required
              type="text"
              className="input-formulario fs-14"
              name="TipoModificacion"
              value={formData.TipoModificacion}
              onChange={handleChange}
              placeholder="Ingresar tipo de modificación"
            />
          </Form.Group>
        </Row>
        {/* Estos botones son puramente funcionales  */}
        <section className="d-flex justify-content-between flex-wrap">
          <article>
            <input
              className="form-check-input "
              type="checkbox"
              id="Nombre de fantasía"
              onClick={() => setIsActiveNombreFantasia(!isActiveNombreFantasia)}
              value="true"
            />
            <label
              className="form-check-label lato-bold ms-2 fs-14"
              htmlFor="Nombre de fantasía"
            >
              Nombre de fantasía
            </label>
          </article>
          <article>
            <input
              className="form-check-input"
              type="checkbox"
              id="Número de comercio"
              onClick={() => setIsActiveNombreComercio(!isActiveNombreComercio)}
              value="true"
            />
            <label
              className="form-check-label lato-bold fs-14 ms-2"
              htmlFor="Número de comercio"
            >
              Número de comercio
            </label>
          </article>
          <article>
            <input
              className="form-check-input"
              type="checkbox"
              id="domicilioActive"
              onClick={() => setIsActiveDomicilio(!isActiveDomicilio)}
              value="true"
            />
            <label
              className="form-check-label lato-bold fs-14 ms-2"
              htmlFor="domicilioActive"
            >
              Domicilio
            </label>
          </article>
          <article>
            <input
              className="form-check-input"
              type="checkbox"
              id="cambioBocaPago"
              onClick={() => setIsActiveBocaPago(!isActiveBocaPago)}
              value="true"
            />
            <label
              className="form-check-label lato-bold fs-14 ms-2"
              htmlFor="cambioBocaPago"
            >
              Cambio de boca de pago
            </label>
          </article>
          <article>
            <input
              className="form-check-input"
              type="checkbox"
              id="cambioEmail"
              onClick={() => setIsActiveEmail(!isActiveEmail)}
              value="true"
            />
            <label
              className="form-check-label lato-bold fs-14 ms-2"
              htmlFor="cambioEmail"
            >
              Email
            </label>
          </article>
        </section>
        <hr className="my-2" />
        <Row className="">
          <Form.Group as={Col} md="7" sm="12">
            <Form.Label className="fs-14 pt-2">Nombre de fantasía</Form.Label>
            <Form.Control
              name="NombreFantasia"
              value={formData.NombreFantasia}
              onChange={handleChange}
              className={
                isActiveNombreFantasia === true
                  ? " input-formulario fs-14"
                  : "input-desactivado-form-modificaciones fs-14"
              }
              required
              disabled={isActiveNombreFantasia === true ? false : true}
              type="text"
              placeholder="Ingresar nombre de fantasía"
            />
          </Form.Group>
          <Form.Group as={Col} md="5" sm="12">
            <Form.Label className="fs-14 mt-2">Número de comercio</Form.Label>
            <Form.Control
              name="NumeroComercio"
              value={formData.NumeroComercio}
              onChange={handleChange}
              className={
                isActiveNombreComercio === true
                  ? " input-formulario fs-14"
                  : "input-desactivado-form-modificaciones fs-14"
              }
              required
              type="number"
              disabled={isActiveNombreComercio === true ? false : true}
              placeholder="Ingresar número de comercio"
            />
          </Form.Group>
        </Row>
        <Row className="">
          <Form.Group as={Col} md="12" sm="12">
            <Form.Label className="fs-14 mt-2">Domicilio</Form.Label>
            <Form.Control
              name="Domicilio"
              value={formData.Domicilio}
              onChange={handleChange}
              className={
                isActiveDomicilio === true
                  ? " input-formulario fs-14"
                  : "input-desactivado-form-modificaciones fs-14"
              }
              required
              disabled={isActiveDomicilio === true ? false : true}
              type="text"
              placeholder="Ingresar domicilio"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" sm="12">
            <Form.Label className="fs-14 mt-2">Provincia</Form.Label>
            <Form.Control
              className={
                isActiveDomicilio === true
                  ? " input-formulario fs-14"
                  : "input-desactivado-form-modificaciones fs-14"
              }
              required
              disabled={isActiveDomicilio === true ? false : true}
              type="text"
              name="Provincia"
              value={formData.Provincia}
              onChange={handleChange}
              placeholder="Ingresar Provincia"
            />
          </Form.Group>
          <Form.Group as={Col} md="4" sm="12">
            <Form.Label className="fs-14 mt-2">Ciudad</Form.Label>
            <Form.Control
              className={
                isActiveDomicilio === true
                  ? " input-formulario fs-14"
                  : "input-desactivado-form-modificaciones fs-14"
              }
              required
              disabled={isActiveDomicilio === true ? false : true}
              type="text"
              name="Ciudad"
              value={formData.Ciudad}
              onChange={handleChange}
              placeholder="Ingresar ciudad"
            />
          </Form.Group>
          <Form.Group as={Col} md="4" sm="12">
            <Form.Label className="fs-14 mt-2">Código postal</Form.Label>
            <Form.Control
              className={
                isActiveDomicilio === true
                  ? " input-formulario fs-14"
                  : "input-desactivado-form-modificaciones fs-14"
              }
              required
              disabled={isActiveDomicilio === true ? false : true}
              type="number"
              name="CodigoPostal"
              value={formData.CodigoPostal}
              onChange={handleChange}
              placeholder="Ingresar código postal"
            />
          </Form.Group>
        </Row>
        <div>
          <h6 className="mt-2"> Datos bancario</h6>
        </div>
        <div className="row">
          <section className="col-lg-12">
            <article>
              <label htmlFor="Banco" className="lato-bold fs-14 ms-1">
                Bancos
              </label>
              <Controller
                name="Banco"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={optionsBancos}
                    className="lato-bold pb-3 fs-12"
                    classNamePrefix="select"
                    isDisabled={isActiveBocaPago === true ? false : true}
                    isSearchable={false}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        Banco: val.label,
                      })
                    }
                  />
                )}
              />
            </article>
          </section>
          <section className="">
            <Row className="">
              <section>
                <article className="">
                  <div>
                    <h6 className="me-1 fs-14">Tipo de cuenta:</h6>
                  </div>
                  <section className="d-flex flex-wrap justify-content-between">
                    <div className="form-check  ">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="TipoCuenta"
                        id="cajaDeAhorros"
                        value="Caja de Ahorros"
                        onChange={handleChange}
                        disabled={isActiveBocaPago === true ? false : true}
                      />
                      <label
                        className="form-check-label fs-14"
                        htmlFor="cajaDeAhorros"
                      >
                        Caja de Ahorros
                      </label>
                    </div>
                    <div className="form-check ">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="TipoCuenta"
                        id="cuentaCorriente"
                        value="Cuenta Corriente"
                        onChange={handleChange}
                        disabled={isActiveBocaPago === true ? false : true}
                      />
                      <label
                        className="form-check-label fs-14"
                        htmlFor="cuentaCorriente"
                      >
                        Cuenta Corriente
                      </label>
                    </div>
                    <div className="form-check ">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="TipoCuenta"
                        id="billeteraVirtual"
                        value="Billetera Virtual"
                        onChange={handleChange}
                        disabled={isActiveBocaPago === true ? false : true}
                      />
                      <label
                        className="form-check-label fs-14"
                        htmlFor="billeteraVirtual"
                      >
                        Billetera Virtual
                      </label>
                    </div>
                  </section>
                </article>
              </section>
            </Row>
          </section>
          <Row className="">
            <Form.Group as={Col} md="6" sm="12">
              <Form.Label className="fs-14 mt-2">CBU/CVU</Form.Label>
              <Form.Control
                type="number"
                className={
                  isActiveBocaPago === true
                    ? " input-formulario fs-14"
                    : "input-desactivado-form-modificaciones fs-14"
                }
                required
                disabled={isActiveBocaPago === true ? false : true}
                name="Cbucvu"
                value={formData.Cbucvu}
                onChange={handleChange}
                placeholder="Ingresar CBU/CVU"
              />
            </Form.Group>
            <Form.Group as={Col} md="6" sm="12">
              <Form.Label className="fs-14 mt-2">Alias</Form.Label>
              <Form.Control
                type="text"
                className={
                  isActiveBocaPago === true
                    ? " input-formulario fs-14"
                    : "input-desactivado-form-modificaciones fs-14"
                }
                required
                disabled={isActiveBocaPago === true ? false : true}
                name="Alias"
                value={formData.Alias}
                onChange={handleChange}
                placeholder="Ingresar Alias"
              />
            </Form.Group>
          </Row>
          <Row className="">
            <Form.Group as={Col} md="6" sm="12">
              <Form.Label className="fs-14 mt-2">CUIT</Form.Label>
              <Form.Control
                type="number"
                className={
                  isActiveBocaPago === true
                    ? " input-formulario fs-14"
                    : "input-desactivado-form-modificaciones fs-14"
                }
                required
                disabled={isActiveBocaPago === true ? false : true}
                name="Cuitbancario"
                value={formData.Cuitbancario}
                onChange={handleChange}
                placeholder="Ingresar CUIT"
              />
            </Form.Group>
            <Form.Group as={Col} md="6" sm="12">
              <Form.Label className="fs-14 mt-2">E-mail</Form.Label>
              <Form.Control
                type="email"
                className={
                  isActiveEmail === true
                    ? " input-formulario fs-14"
                    : "input-desactivado-form-modificaciones fs-14"
                }
                required
                disabled={isActiveEmail === true ? false : true}
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Ingresar email"
              />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            {/* este tambien me esta dando problema back dame una mano  */}
            <h6 className="mt-4"> Condición fiscal</h6>
            <div className="row">
              <section className="col-lg-6 col-12">
                <h6 className="fs-14 mt-2">AFIP</h6>
                <article className="d-flex">
                  <div className="form-check me-4">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="condicionAFIP"
                      id="Monotributista"
                      value="Monotributista"
                      onChange={handleChange}
                      onClick={() => setIsActiveResponsableInscripto(false)}
                    />
                    <label
                      className="form-check-label lato-bold fs-14"
                      htmlFor="Monotributista"
                    >
                      Monotributista
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="condicionAFIP"
                      id="responsableInscripto"
                      value="Responsable Inscripto"
                      onChange={handleChange}
                      onClick={() => setIsActiveResponsableInscripto(true)}
                    />
                    <label
                      className="form-check-label lato-bold fs-14"
                      htmlFor="responsableInscripto"
                    >
                      Resp. Inscripto
                    </label>
                  </div>
                </article>
                <article className="d-flex">
                  <div className="form-check me-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="AfipExentoGanancia"
                      id="AfipExentoGanancia"
                      value="Exento Ganancia"
                      onChange={handleChange}
                      disabled={!isActiveResponsableInscripto}
                    />
                    <label
                      className="form-check-label lato-bold fs-14"
                      htmlFor="AfipExentoGanancia"
                    >
                      Exento Ganancia
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="AfipExentoIva"
                      id="AfipExentoIva"
                      value="Exento IVA"
                      onChange={handleChange}
                      disabled={!isActiveResponsableInscripto}
                    />
                    <label
                      className="form-check-label lato-bold fs-14"
                      htmlFor="AfipExentoIva"
                    >
                      Exento IVA
                    </label>
                  </div>
                </article>
              </section>
              <section className="col-lg-6 col-12">
                <h6 className="fs-14 mt-2">RENTAS</h6>
                <article className="d-flex">
                  <div className="form-check me-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="RentasIncripto"
                      id="RentasIncripto"
                      value="RentasIncripto"
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label lato-bold fs-14"
                      htmlFor="RentasIncripto"
                    >
                      Inscripto
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="RentasConvenioMultilateral"
                      id="RentasConvenioMultilateral"
                      value="RentasConvenioMultilateral"
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label lato-bold fs-14"
                      htmlFor="RentasConvenioMultilateral"
                    >
                      Convenio Multilateral
                    </label>
                  </div>
                </article>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="RentasExento"
                    id="RentasExento"
                    value="RentasExento"
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label lato-bold fs-14"
                    htmlFor="RentasExento"
                  >
                    Exento
                  </label>
                </div>
              </section>
            </div>
          </Row>
          {/* TITULAR O RAZON SOCIAL EN CASO DE CORRESPONDER */}
                  <Row className="mb-3">
                      <Form.Group as={Col} md="12" sm="12">
                          <Form.Label className="fs-14 mt-2">
                              Titular o razón social (En caso de corresponder)
                          </Form.Label>
                          <Form.Control
                              type="file"
                              className="input-formulario fs-14"
                              name="TitularRazonSocial"
                              onChange={handleChange}
                              placeholder="Ingresar Titular o razón social"
                              accept="image/*"
                          />
                      </Form.Group>
                  </Row>

          <section>
            <h6 className="fs-12">
              (En caso de ser sociedad adjuntar copia del contrato social o acto
              constitutivo donde conste que la persona física es socio gerente
              de la razón social indicada o apoderado)
            </h6>
          </section>
          {/* AGREGAR IMAGENES / este tambien */}
          <Row className="">
            <div>
              <h6 className="mt-2"> Datos del comercio</h6>
            </div>
            <Form.Group as={Col} md="4" sm="12">
              <Form.Label className="fs-12 mt-2">
                Cupón de inicialización
              </Form.Label>
              <Form.Control
                type="file"
                className="input-form-editar-comanda fs-14"
                name="CuponInicializacionTerminal1"
                onChange={handleChange}
                multiple
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="4" sm="12">
              <Form.Label className="fs-14 mt-2">
                Constancias fiscales
              </Form.Label>
              <Form.Control
                type="file"
                className="input-form-editar-comanda fs-14"
                name="ConstanciaRentas"
                onChange={handleChange}
                multiple
                required
              />
            </Form.Group>
            <Form.Group as={Col} md="4" sm="12">
              <Form.Label className="fs-14 mt-2">
                Constancia de CBU/CVU
              </Form.Label>
              <Form.Control
                type="file"
                className="input-form-editar-comanda fs-14"
                name="ConstanciaCbucvu"
                onChange={handleChange}
                multiple
                required
              />
            </Form.Group>
          </Row>
                  <Row className="mb-3">
                      <Form.Group as={Col} md="6" sm="12">
                          <Form.Label className="fs-14 mt-2">
                              Copia del DNI del titular
                          </Form.Label>
                          <Form.Control
                              type="file"
                              className="input-form-editar-comanda fs-14"
                              name="Dni"
                              onChange={handleChange}
                              multiple
                              required
                          />
                      </Form.Group>
                      <Form.Group as={Col} md="6" sm="12">
                          <Form.Label className="fs-14 mt-2">
                              Copia del dorso del DNI del titular
                          </Form.Label>
                          <Form.Control
                              type="file"
                              className="input-form-editar-comanda fs-14"
                              name="DniDorso"
                              onChange={handleChange}
                              multiple
                              required
                          />
                      </Form.Group>
                  </Row>
          <section className="mt-2">
            <h6 className="fs-12">DECLARACIÓN JURADA</h6>
            <h6 className="fs-12">
              El que subscribe, con poder suficiente para este acto, manifiesta
              en calidad de declaración jurada y asumiendo toda la
              responsabilidad civil, penal y administrativa por cualquier
              falsedad, omisión u ocultamiento que se verificare, que la
              información contenida en el presente formulario es veraz, exacta y
              subsiste al tiempo de efectuarse esta presentación.
            </h6>
          </section>
          {/* Firma digital */}
          <Row className="mb-3">
            <div>
              <h6 className="mt-4">Firma Digital</h6>
            </div>
            <article className="container">
              <Form.Group as={Col} md="12" controlId="firmaDigital">
                <ReactSignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{
                    className: "sigCanvas",
                  }}
                />
                <div className="d-flex justify-content-start">
                  <Button
                    className="mt-3"
                    variant="secondary"
                    onClick={() => sigCanvas.current.clear()}
                  >
                    Borrar Firma
                  </Button>
                </div>
              </Form.Group>
            </article>
          </Row>
        </div>
        <div className="d-flex justify-content-center">
          <Button className="btn-guardar-formulario-alta my-3" type="submit">
            Guardar
          </Button>
        </div>
      </Form>
    </section>
  );
};

export default FormModificacionesNuevo;
