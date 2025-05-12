import { faPlusCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { DarkModeContext } from "../../context/DarkModeContext";
import SignatureCanvas from "react-signature-canvas";

const FormAltaEditarJuridicaPersona = ({ item }) => {
  const {
    numeroTerminal,
    // tipo de persona juridica
    apellidoYnombre,
    cuittitular,
    actividadLaboralProfesional,
    // Datos del aliado
    calle,
    numeroCalle,
    localidadTitular,
    provincia,
    codigoPostalTitular,
    telFijo,
    correo,
    apoderado,
    // Datos del comercio
    nombreFantasia,
    domicilio,
    localidadComercio,
    codigoPostalComercio,
    // Condicion fiscal
    afipMonotributista,
    afipResponsableInscripto,
    afipExentoIva,
    afipExentoGanancia,
    rentasConvenioMultilateral,
    rentasExento,
    rentasIncripto,
    // Datos bancarios
    banco,
    tipoCuenta,
    cbucvu,
    alias,
    cuitbancario,
    titularRazonSocial,
    // numero de comercio
    numeroComericoActual,
    numeroComercioSolicitado,
    // tipo de alta
    tipoAlta,
    nuevoPanel,
    // tipo de imagenes
    // datos que no se utilizan
    fechaApertura,
    id,
    idGestor,
    nombreGestor,
    cbucvufront,
  } = item;

  // Estado para almacenar datos del formulario
  const [formData, setFormData] = useState({
    tipoPersona: "Juridica",
    TerminalN: numeroTerminal,
    FechaApertura: fechaApertura,
    ApellidoYnombre: apellidoYnombre,
    Cuittitular: cuittitular,
    ActividadLaboralProfesional: actividadLaboralProfesional,
    Calle: calle,
    NumeroCalle: numeroCalle,
    LocalidadTitular: localidadTitular,
    Provincia: provincia,
    CodigoPostalTitular: codigoPostalTitular,
    TelFijo: telFijo,
    Correo: correo,
    Apoderado:apoderado,
    NombreFantasia: nombreFantasia,
    Domicilio: domicilio,
    LocalidadComercio: localidadComercio,
    CodigoPostalComercio:codigoPostalComercio,
    Banco: banco || "",
    Cbucvufront:cbucvu,
    Alias:alias,
    Cuitbancario: cuitbancario,
    TitularRazonSocial: titularRazonSocial,
    NumeroComericoActual: numeroComericoActual,
    NumeroComercioSolicitado: numeroComercioSolicitado
  });

  // context para el modo oscuro
  const { darkMode } = useContext(DarkModeContext);

  // funcion de control y reseteo del hook useForm
  const { control, reset } = useForm();

  const [rubros, setRubros] = useState([]);
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await fetch("/api/Rubro/lista");
        if (!response.ok) {
          throw new Error("Error fetching Rubros");
        }
        const data = await response.json();
        setRubros(data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchComercios = async () => {
      try {
        const response = await fetch("/api/Comercio/lista");
        if (!response.ok) {
          throw new Error("Error fetching Comercios");
        }
        const data = await response.json();
        setComercios(data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchRubros(), fetchComercios()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Mapear las opciones de los rubros
  const optionsNumeroComercioActualTerminal = rubros.map((rubro) => ({
    value: rubro.nomRubro,
    label: rubro.nomRubro,
  }));

  // Mapear las opciones de los comercios
  const optionsNumeroComercioSolicitado = comercios.map((comercio) => ({
    value: comercio.numComercio,
    label: comercio.numComercio,
  }));

  // Referencia para la firma digital
  const sigCanvas = useRef({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();

      return;
    }
    const token = sessionStorage.getItem("token");

    if (!token) {
      console.error("No se encontró token en sessionStorage.");
      return;
    }

    // Agregar token a formData antes de enviar
    const formDataWithToken = { ...formData, token, Id: id };

    console.log("formData antes de enviar:", formDataWithToken);

    try {
      const response = await fetch("/api/formulario/EditarFomularioAlta", {
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
          AfipExentoGanancia: "",
          AfipExentoIva: "",
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

  // Función para convertir la firma digital en base64
  const convertToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => callback(reader.result);
    reader.onerror = (error) => console.error("Error: ", error);
  };

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
    value: banco.nomBanco, // Asegúrate de que "id" sea el campo correcto para el valor
    label: banco.nomBanco, // Asegúrate de que "nombre" sea el campo correcto para la etiqueta
  }));

  return (
    <>
      <section className="container">
        <Form onSubmit={handleSubmit}>
          <div>
            <Row className="mb-3">
              <Form.Group as={Col} md="8" sm="12">
                <Form.Label className="fs-14">N° de terminal</Form.Label>
                <Form.Control
                  type="number"
                  name="TerminalN"
                  maxLength={10}
                  value={formData.TerminalN}
                  onChange={handleChange}
                  className="input-formulario fs-14"
                  placeholder="Ingresar el N° Terminal"
                />
              </Form.Group>
              <Form.Group as={Col} md="4" sm="12">
                <Form.Label className="fs-14">Fecha Apertura</Form.Label>
                <Form.Control
                  type="text"
                  name="FechaApertura"
                  disabled
                  value={formData.FechaApertura}
                  onChange={handleChange}
                  className="input-formulario fs-14"
                  placeholder="Ingresar el N° Terminal"
                />
              </Form.Group>
            </Row>
            {/* DATOS ALIADO */}
            <Row className="">
              <div className="mt-1">
                <h6> Datos del aliado</h6>
              </div>
              <Form.Group as={Col} md="7" sm="12">
                <Form.Label className=" fs-14">Denominación o razón social</Form.Label>
                <Form.Control
                  type="text"
                  className="input-formulario fs-14"
                  name="ApellidoYnombre"
                  value={formData.ApellidoYnombre}
                  onChange={handleChange}
                  placeholder="Ingresar apellido y nombre"
                />
              </Form.Group>
              <Form.Group as={Col} md="5" sm="12">
                <Form.Label className="fs-14">CUIT, CDI, o la clave de identificación que en el futuro sea creada por la AFIP</Form.Label>
                <Form.Control
                  className="input-formulario-corto fs-14"
                  type="number"
                  name="Cuittitular"
                  value={formData.Cuittitular}
                  onChange={handleChange}
                  placeholder="DNI/CUIT"
                />
              </Form.Group>
              <Form.Group className="py-2" as={Col} md="12" sm="12">
                <Form.Label className="mt-2 fs-14">
                  Actividad laboral o profesional
                </Form.Label>
                <Form.Control
                  type="text"
                  className="input-formulario fs-14"
                  name="ActividadLaboralProfesional"
                  value={formData.ActividadLaboralProfesional}
                  onChange={handleChange}
                  placeholder="Ingresar actividad laboral y profesional"
                />
              </Form.Group>
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className=" fs-14 mt-2">Domicilio de calle</Form.Label>
                <Form.Control
                  type="text"
                  className="input-formulario fs-14"
                  id="Calle"
                  name="Calle"
                  value={formData.Calle}
                  onChange={handleChange}
                  placeholder="Ingresar calle"
                />
              </Form.Group>
              <Form.Group as={Col} md="2" sm="12">
                <Form.Label className="mt-2 fs-14">N°</Form.Label>
                <Form.Control
                  className="input-formulario fs-14"
                  type="number"
                  name="NumeroCalle"
                  value={formData.NumeroCalle}
                  onChange={handleChange}
                  placeholder="Ingresar N°"
                />
              </Form.Group>
              <Form.Group as={Col} md="4" sm="12">
                <Form.Label className="mt-2 fs-14">Localidad</Form.Label>
                <Form.Control
                  className="input-formulario fs-14"
                  type="text"
                  name="LocalidadTitular"
                  value={formData.LocalidadTitular}
                  onChange={handleChange}
                  placeholder="Ingresar Localidad"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="7" sm="12">
                <Form.Label className="mt-2 fs-14">Provincia</Form.Label>
                <Form.Control
                  type="text"
                  className="input-formulario fs-14"
                  name="Provincia"
                  value={formData.Provincia}
                  onChange={handleChange}
                  placeholder="Ingresar Provincia"
                />
              </Form.Group>
              <Form.Group as={Col} md="5" sm="12">
                <Form.Label className="mt-2 fs-14">Código postal</Form.Label>
                <Form.Control
                  className="input-formulario fs-14"
                  type="number"
                  name="CodigoPostalTitular"
                  value={formData.CodigoPostalTitular}
                  onChange={handleChange}
                  placeholder="Ingresar Codigo Postal"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="mt-2 fs-14">
                  Número de teléfono de la sede
                </Form.Label>
                <Form.Control
                  className="input-formulario fs-14"
                  type="number"
                  name="TelFijo"
                  value={formData.TelFijo}
                  onChange={handleChange}
                  placeholder="Ingresar Tel. de la sede"
                />
              </Form.Group>
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="mt-2 fs-14">
                  Correo electrónico
                </Form.Label>
                <Form.Control
                  type="email"
                  className="input-formulario fs-14"
                  name="Correo"
                  value={formData.Correo}
                  onChange={handleChange}
                  placeholder="Ingresar Correo electrónico"
                />
              </Form.Group>
            </Row>
            <Row className="mb-1">
              <Form.Group as={Col} md="12" sm="12">
                <Form.Label className="mt-2 fs-14">
                  Identificación del apoderado, adicional, representante y
                  autorizado:
                </Form.Label>
                <Form.Control
                  type="text"
                  className="input-formulario fs-14"
                  name="Apoderado"
                  value={formData.Apoderado}
                  onChange={handleChange}
                  placeholder="Ingresar identificación"
                />
              </Form.Group>
            </Row>
            {/* DATOS DEL COMERCIO */}
            <Row className="mb-1">
              <div>
                <h6 className="mt-2 lato-bold "> Datos del comercio</h6>
              </div>
              <Form.Group as={Col} md="12" sm="12">
                <Form.Label className="fs-14">Nombre de fantasía</Form.Label>
                <Form.Control
                  type="text"
                  className="input-formulario fs-14"
                  name="NombreFantasia"
                  value={formData.NombreFantasia}
                  onChange={handleChange}
                  placeholder="Ingresar Nombre de fantasía "
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" sm="12">
                <Form.Label className="fs-14 pt-2">Domicilio</Form.Label>
                <Form.Control
                  type="text"
                  className="input-formulario fs-14"
                  name="Domicilio"
                  value={formData.Domicilio}
                  onChange={handleChange}
                  placeholder="Ingresar Domicilio del comercio"
                />
              </Form.Group>
              <Form.Group as={Col} md="3" sm="12">
                <Form.Label className="pt-2 fs-14">Localidad</Form.Label>
                <Form.Control
                  type="text"
                  className="input-formulario fs-14"
                  name="LocalidadComercio"
                  value={formData.LocalidadComercio}
                  onChange={handleChange}
                  placeholder="Ingresar Localidad del Comercio"
                />
              </Form.Group>
              <Form.Group as={Col} md="3" sm="12">
                <Form.Label className="pt-2 fs-14">Cód. postal</Form.Label>
                <Form.Control
                  type="number"
                  className="input-formulario fs-14"
                  name="CodigoPostalComercio"
                  value={formData.CodigoPostalComercio}
                  onChange={handleChange}
                  placeholder="Ingresar Código postal del comercio"
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <h6 className="mt-2"> Condición fiscal</h6>
              <div className="row">
                <section className="col-lg-6 col-12">
                  <h6 className="mt-2 fs-16">AFIP</h6>
                  <article className="d-flex">
                    <div className="form-check me-4">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="condicionAFIP"
                        id="Monotributista"
                        value="Monotributista"
                        checked={formData.condicionAFIP === "Monotributista"}
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
                        checked={
                          formData.condicionAFIP === "Responsable Inscripto"
                        }
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
                        className="form-check-label lato-bold fs-16"
                        htmlFor="AfipExentoIva"
                      >
                        Exento IVA
                      </label>
                    </div>
                  </article>
                </section>
                <section className="col-lg-6 col-12 ">
                  <h6 className="mt-2 fs-16">RENTAS</h6>
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
            <div>
              <h6 className="mt-2"> Datos bancario</h6>
            </div>
            <div className="row">
              <section className="col-lg-6 col-12">
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
                      isSearchable={false}
                    value={optionsBancos.find(
                      (option) => option.label === formData.Banco
                    )}
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
              <section className="col-lg-6 col-12">
                <Row className="mb-3">
                  <section>
                    <div>
                      <h6 className="mt-2 fs-14">Tipo de cuenta:</h6>
                    </div>

                    <article className="d-flex ">
                      <div className="form-check me-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="TipoCuenta"
                          id="cajaDeAhorros"
                          value="Caja de Ahorros"
                          checked={formData.TipoCuenta === "Caja de Ahorros"}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label fs-12"
                          htmlFor="cajaDeAhorros"
                        >
                          Caja de Ahorros
                        </label>
                      </div>
                      <div className="form-check me-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="TipoCuenta"
                          id="cuentaCorriente"
                          value="Cuenta Corriente"
                          checked={formData.TipoCuenta === "Cuenta Corriente"}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label fs-12"
                          htmlFor="cuentaCorriente"
                        >
                          Cuenta Corriente
                        </label>
                      </div>
                      <div className="form-check me-3">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="TipoCuenta"
                          id="billeteraVirtual"
                          value="Billetera Virtual"
                          checked={formData.TipoCuenta === "Billetera Virtual"}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label fs-12"
                          htmlFor="billeteraVirtual"
                        >
                          Billetera Virtual
                        </label>
                      </div>
                    </article>
                  </section>
                </Row>
              </section>
              <section>
                <Row className="my-3">
                  <Form.Group as={Col} md="6" sm="12">
                    <Form.Label className="fs-14 mt-2">CBU / CVU</Form.Label>
                    <Form.Control
                      type="number"
                      className="input-formulario fs-14"
                      name="Cbucvufront"
                      value={formData.Cbucvufront}
                      onChange={handleChange}
                      placeholder="Ingresar CBU/CVU"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6" sm="12">
                    <Form.Label className="fs-14 mt-2">Alias</Form.Label>
                    <Form.Control
                      type="text"
                      className="input-formulario fs-14"
                      name="Alias"
                      value={formData.Alias}
                      onChange={handleChange}
                      placeholder="Ingresar Alias"
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" sm="12">
                    <Form.Label className="fs-14 mt-2">CUIT</Form.Label>
                    <Form.Control
                      type="number"
                      className="input-formulario fs-14"
                      name="Cuitbancario"
                      value={formData.Cuitbancario}
                      onChange={handleChange}
                      placeholder="Ingresar CUIT"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md="6" sm="12">
                    <Form.Label className="fs-14 mt-2">
                      Titular o razón social
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="input-formulario fs-14"
                      name="TitularRazonSocial"
                      value={formData.TitularRazonSocial}
                      onChange={handleChange}
                      placeholder="Ingresar Titular o razón social"
                    />
                  </Form.Group>
                </Row>
              </section>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" sm="12">
                  <article>
                    <label
                      htmlFor="NumeroComercioActual"
                      className="lato-bold fs-14 ms-1"
                    >
                      Número de comercio actual de la terminal
                    </label>
                    <Controller
                      name="NumeroComercioSolicitado"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className="input-formulario fs-14"
                          value={formData.NumeroComericoActual}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({
                              ...formData,
                              NumeroComericoActual: val,
                            });
                            field.onChange(val);
                          }}
                        />
                      )}
                    />
                  </article>
                </Form.Group>
                <Form.Group as={Col} md="6" sm="12">
                  <article>
                    <label htmlFor="Banco" className="lato-bold fs-14 ms-1">
                      Número de comercio solicitado
                    </label>
                    <Controller
                      name="NumeroComercioSolicitado"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={optionsNumeroComercioSolicitado}
                          className="lato-bold fs-12"
                          classNamePrefix="select"
                          isSearchable={false}
                          onChange={(val) =>
                            setFormData({
                              ...formData,
                              NumeroComercioSolicitado: val.label,
                            })
                          }
                        />
                      )}
                    />
                  </article>
                </Form.Group>
              </Row>
              <Row>
                <section className="d-flex">
                  <div className="form-check me-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="TipoAlta"
                      id="NuevoAliado"
                      value="NuevoAliado"
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label fs-14"
                      htmlFor="NuevoAliado"
                    >
                      Nuevo aliado
                    </label>
                  </div>
                  <div className="form-check me-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="TipoAlta"
                      id="AgregaTerminal"
                      value="AgregaTerminal"
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label fs-14"
                      htmlFor="AgregaTerminal"
                    >
                      Agrega terminal
                    </label>
                  </div>
                  <div className="form-check me-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="NuevoPanel"
                      id="NuevoPanel"
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label fs-12"
                      htmlFor="NuevoPanel"
                    >
                      Se requiere nuevo nombre en el panel de control.
                    </label>
                  </div>
                </section>
              </Row>
            </div>
            {/* AGREGAR IMAGENES */}
            {/* <Row className="">
              <div>
                <h6 className="mt-4"> Datos del comercio</h6>
              </div>
              <Form.Group
                as={Col}
                lg="4"
                md="12"
                controlId="validationCustom01"
              >
                <Form.Label className="fs-14">Alta firmada</Form.Label>
                <Form.Control
                  type="file"
                  className="input-form-editar-comanda fs-14"
                  name="AltaFirmada"
                  onChange={handleChange}
                  multiple
                  required
                />
              </Form.Group>
              <Form.Group
                as={Col}
                lg="4"
                md="12"
                controlId="validationCustom02"
              >
                <Form.Label className="fs-14 mt-2">
                  Cupón de inicialización de la terminal
                </Form.Label>
                <Form.Control
                  type="file"
                  className="input-form-editar-comanda fs-14"
                  name="CuponInicializacionTerminal"
                  onChange={handleChange}
                  multiple
                  required
                />
              </Form.Group>
              <Form.Group
                as={Col}
                lg="4"
                md="12"
                controlId="validationCustom03"
              >
                <Form.Label className="fs-14 mt-2">
                  Constancias fiscales
                </Form.Label>
                <Form.Control
                  type="file"
                  className="input-form-editar-comanda fs-14"
                  name="ConstanciaAfip"
                  onChange={handleChange}
                  multiple
                  required
                />
              </Form.Group>
            </Row>
            <Row className="">
              <Form.Group
                as={Col}
                lg="4"
                md="12"
                controlId="validationCustom04"
              >
                <Form.Label className="fs-14 mt-2">
                  Constancia de CBU/CVU
                </Form.Label>
                <Form.Control
                  type="file"
                  className="input-form-editar-comanda fs-14"
                  name="ContanciaCbuCvu"
                  onChange={handleChange}
                  multiple
                  required
                />
              </Form.Group>
              <Form.Group
                as={Col}
                lg="4"
                md="12"
                controlId="validationCustom05"
              >
                <Form.Label className="fs-14 mt-2">
                  Copia del DNI del admin., socio o representante
                </Form.Label>
                <Form.Control
                  type="file"
                  className="input-form-editar-comanda fs-14"
                  name="Dnifrente"
                  onChange={handleChange}
                  multiple
                  required
                />
              </Form.Group>
              <Form.Group
                as={Col}
                lg="4"
                md="12"
                controlId="validationCustom05"
              >
                <Form.Label className="fs-14 mt-2">
                  Copia del dorso DNI del admin., socio o representante.
                </Form.Label>
                <Form.Control
                  type="file"
                  className="input-form-editar-comanda fs-14"
                  name="Dnidorso"
                  onChange={handleChange}
                  multiple
                  required
                />
              </Form.Group>
            </Row>
            <Row>
              <Form.Group
                as={Col}
                lg="4"
                md="12"
                controlId="validationCustom06"
              >
                <Form.Label className="fs-14 mt-2">
                  Ficha de autorización
                </Form.Label>
                <Form.Control
                  className="input-form-editar-comanda fs-14"
                  type="file"
                  name="FichaAutorizacion"
                  onChange={handleChange}
                  multiple
                  required
                />
              </Form.Group>
            </Row> */}
          </div>
          <div className="d-flex justify-content-center">
            <Button className="btn-guardar-formulario-alta my-5" type="submit">
              Guardar
            </Button>
          </div>
        </Form>
      </section>
    </>
  );
};

export default FormAltaEditarJuridicaPersona;
