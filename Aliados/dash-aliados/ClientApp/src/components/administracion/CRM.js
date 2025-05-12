import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  FormControl,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Modal,
  FormGroup,
  FormLabel,
  Table,
  
} from "react-bootstrap";
import Select from "react-select";
import { DarkModeContext } from "../../context/DarkModeContext";
import { CRMContext } from "../../context/CRMContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OrigenDestino from "./OrigenDestino";
import { ReactComponent as DisponibleIcon } from "../../assets/svg/Recurso 7.svg";
import { ReactComponent as AltaIcon } from "../../assets/svg/Recurso 8.svg";
import { ReactComponent as BajaIcon } from "../../assets/svg/Recurso 9.svg";
import { ReactComponent as ServicioIcon } from "../../assets/svg/Recurso 10.svg";
import { ReactComponent as ExtraviadaIcon } from "../../assets/svg/Recurso 12.svg";
import * as XLSX from "xlsx";
import {
  faFileInvoice,
  faSearch,
  faEdit,
  faPlus,
  faLocationDot,
  faFileExcel
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import "./CRM.css";
const fieldMap = {
  id: "Id",
  sasmutual: "SasMutual",
  estado: "Estado",
  ndeterminal: "NDeTerminal",
  ndecomercio: "NDeComercio",
  nroLocal: "NroLocal",
  legajo: "Legajo",
  nombredefantasia: "NombreDeFantasia",
  domicilio: "Domicilio",
  localidad: "Localidad",
  codigoPostal: "CodigoPostal",
  telefono: "Telefono",
  linkdepago: "LinkDePago",
  rubro: "Rubro",
  rubrosecundario: "RubroSecundario",
  altaahorA12: "AltaAhora12",
  fechadealta: "FechaDeAlta",
  fechadebaja: "FechaDeBaja",
  tipodebaja: "TipoDeBaja",
  provincia: "Provincia",
  nombredelasesor: "NombreDelAsesor",
  alta: "Altas",
  baja: "Baja",
  mail: "Mail",
  titular: "Titular",
  cuitcuil: "CuitCuil",
  banco: "Banco",
  tipodecuenta: "TipoDeCuenta",
  cbucvu: "CbuCvu",
  ndecuenta: "NDeCuenta",
  letracbu: "LetraCbu",
  largocbu: "LargoCbu",
  alias: "Alias",
  razonsocial: "RazonSocial",
  cuitrazonsocial: "CuitRazonSocial",
  estadoafip: "EstadoAfip",
  codactividad: "CodActividad",
  actividad: "Actividad",
  exento: "Exento",
  estadorentas: "EstadoRentas",
  actividaD2: "Actividad2",
  domiciliofiscal: "DomicilioFiscal",
  provinciA3: "Provincia3",
  alicuota: "Alicuota",
  codactividadrentas: "CodActividadRentas",
  actividadrentas: "ActividadRentas",
};

const colorMap = {
  blue: [
    /* "Id",*/
    "SasMutual",
    "Estado",
    "NDeTerminal",
    "NDeComercio",
    "NroLocal",
    "Legajo",
    "NombreDeFantasia",
    "Domicilio",
    "Localidad",
    "CodigoPostal",
    "Telefono",
    "LinkDePago",
    "Rubro",
    "RubroSecundario",
    "AltaAhora12",
    "FechaDeAlta",
    "FechaDeBaja",
    "TipoDeBaja",
    "Provincia",
    "NombreDelAsesor",
    "Altas",
    "Baja",
    "Mail",
  ],
  violet: [
    "Titular",
    "CuitCuil",
    "Banco",
    "TipoDeCuenta",
    "CbuCvu",
    "NDeCuenta",
    "LetraCbu",
    "LargoCbu",
    "Alias",
  ],
  yellow: [
    "RazonSocial",
    "CuitRazonSocial",
    "EstadoAfip",
    "CodActividad",
    "Actividad",
    "Exento",
    "EstadoRentas",
    "Actividad2",
    "DomicilioFiscal",
    "Provincia3",
    "Alicuota",
    "CodActividadRentas",
    "ActividadRentas",
  ],
};

const getBackgroundColor = (field) => {
  const mappedField = fieldMap[field] || field;
  if (colorMap.blue.includes(mappedField)) return "#B4C400"; // Primer color
  if (colorMap.violet.includes(mappedField)) return "#E89F2F"; // Segundo color
  if (colorMap.yellow.includes(mappedField)) return "#EFCA39"; // Último color
  return "white";
};


const altaOptions = [
  { value: "AGREGA", label: "AGREGA" },
  { value: "AGREGA CT", label: "AGREGA CT" },
  { value: "ALTA CCTT", label: "ALTA CCTT" },
  { value: "ALTA NUEVA", label: "ALTA NUEVA" },
  { value: "ALTA SSTT", label: "ALTA SSTT" },
];

const bajaOptions = [
  { value: "BAJA", label: "BAJA" },
  { value: "BAJA POR FACTURACION", label: "BAJA POR FACTURACION" },
  { value: "BAJA POR POSNET", label: "BAJA POR POSNET" },
  
  { value: "BAJA SSTT", label: "BAJA SSTT" },
  { value: "VERIFONE REUTILIZABLE", label: "VERIFONE REUTILIZABLE" },
  {value: "BAJA POR CAMBIO DE TERMINAL", label:"BAJA POR CAMBIO DE TERMINAL"}
];

const getInitialFieldValues = () => {
  const initialValues = {};
  Object.keys(fieldMap).forEach((key) => {
    initialValues[key] = ""; // Asigna valores iniciales vacíos
  });
  return initialValues;
};

const CRM = ({ datos = [], view, rol }) => {
  const {
    legajos,
    comercios,
    rubros,
    provincias,
    asesores,
      bancos,
      legajosCompleto,
    loading: crmLoading, // Usar crmLoading para evitar conflictos con el estado interno
    } = useContext(CRMContext);
  const [searchField, setSearchField] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchTerms, setSearchTerms] = useState({});
  const [showAll, setShowAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]); // Estado para la fecha (por defecto hoy)
  const [showModal, setShowModal] = useState(false);
  const [showOrigenDestinoModal, setShowOrigenDestinoModal] = useState(false);
  const [idOrigenDestino, setIdOrigenDestino] = useState(null);
  
  // Función para abrir el modal con el ID seleccionado
  const handleOpenOrigenDestino = (id) => {
    setIdOrigenDestino(id);
    setShowOrigenDestinoModal(true);
  };

  // Función para cerrar el modal
  const handleCloseOrigenDestinoModal = () => {
    setShowOrigenDestinoModal(false);
    setIdOrigenDestino(null);
  };

  const [modalData, setModalData] = useState({
    NDeComercio: "",
    Legajo: "",
    NombreDeFantasia: "",
    Domicilio: "",
    Localidad: "",
    codigoPostal: "",
    Telefono: "",
    Rubro: "",
    RubroSecundario: "",
    Mail: "",
    Razonsocial: "",
    CuitRazonSocial: "",
    EstadoAfip: "",
    CodActividad: "",
    Actividad: "",
    Exento: "",
    EstadoRentas: "",
    Actividad2: "",
    DomicilioFiscal: "",
    Provincia3: "",
    Alicuota: "",
    CodActividadRentas: "",
    ActividadRentas: "",
    Titular: "", // Nombre del titular
    CuitCuil: "", // CUIT/CUIL del titular
    Banco: "", // Nombre del banco
    TipoDeCuenta: "", // Tipo de cuenta (Ahorro, Corriente, etc.)
    CbuCvu: "", // CBU o CVU
    NDeCuenta: "", // Número de cuenta
    LetraCbu: "", // Letra del CBU
    LargoCbu: "", // Largo del CBU (cantidad de caracteres)
    Alias: "", // Alias del CBU
  });

  const [isEditMode, setIsEditMode] = useState(false);

  const [showNewModal, setShowNewModal] = useState(false);
  const [terminalBaja, setTerminalBaja] = useState("");
  const [terminalAlta, setTerminalAlta] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [selectMotivo, setMotivo] = useState("");
  const [observacion, setObservacion] = useState("");
  const [tipoOperacion, setTipoOperacion] = useState("alta"); // Estado independiente para Tipo
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistorialModal, setShowHistorialModal] = useState(false);
  const [historialData, setHistorialData] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [filaExtendida, setFilaExtendida] = useState(null);

  const [searchSubmitted, setSearchSubmitted] = useState(false); // Nuevo estado para controlar si se ha enviado una búsqueda
  const [showAddHistorialModal, setShowAddHistorialModal]= useState(false)
  const [cuitMismatch, setCuitMismatch] = useState(false);

  const [filters, setFilters] = useState({
    searchTerms: {}, // Aquí se guardan los términos de búsqueda (número de terminal, comercio, CUIT, provincia, etc.)
    estado: null, // Aquí se guarda el estado seleccionado
  });

  
  const [altaAhora12Options] = useState([
    { value: "SI", label: "SI" },
    { value: "NO", label: "NO" },
  ]);
  const [linkDePagoOptions] = useState([
    { value: "SI", label: "SI" },
    { value: "NO", label: "NO" },
  ]);

  
  const tipoCuentaOptions = [
    { value: "CAJA AHORRO", label: "CAJA AHORRO" },
    { value: "CUENTA CORRIENTE", label: "CUENTA CORRIENTE" },
    { value: "BILLETERA VIRTUAL", label: "BILLETERA VIRTUAL" },
  ];

  const [selectedTerminalForCopy, setSelectedTerminalForCopy] = useState(null);

  // Función que toma los datos de la terminal seleccionada y llena los campos

  const formatDateInput = (value) => {
    const digitsOnly = value.replace(/\D/g, "");
    const charArray = digitsOnly.split("");
    if (charArray.length > 4) {
      charArray.splice(4, 0, "/");
    }
    if (charArray.length > 7) {
      charArray.splice(7, 0, "/");
    }
    return charArray.join("");
  };

  const handleDateChange = (field, value) => {
    const formattedValue = formatDateInput(value);
    setModalData((prevData) => ({ ...prevData, [field]: formattedValue }));
  };
  useEffect(() => {
    const selectedProvince = provincias.find(
      (option) => option.value === modalData.provincia3
    );
    if (selectedProvince) {
      setModalData((prevData) => ({
        ...prevData,
        alicuota: selectedProvince.alicuota,
      }));
    }
  }, [modalData.provincia3, provincias]);
  // Modificar getTerminalOptions para manejar la lógica de incluir o excluir estados
  const getTerminalOptions = useMemo(() => {
    return datos
      .filter((dato) => {
        if (selectValue === "option5") {
          return dato.estado === "BAJA";
        }
        return true;
      })
      .map((dato) => ({
        value: dato.ndeterminal,
        label: `${dato.ndeterminal} - ${dato.estado}`,
      }));
  }, [datos, selectValue]);
  

  const handleTerminalSelection = useCallback(
    (option) => {
      setTerminalBaja(option ? option.value : "");

      const selectedTerminalData = datos.find(
        (terminal) => terminal.ndeterminal === option.value
      );

      if (selectedTerminalData) {
        setModalData({
          NDeComercio: selectedTerminalData.ndecomercio?.toString() || "", // Convertido a string
          Legajo: selectedTerminalData.legajo?.toString() || "",
          NombreDeFantasia:
            selectedTerminalData.nombredefantasia?.toString() || "",
          Domicilio: selectedTerminalData.domicilio?.toString() || "",
          Localidad: selectedTerminalData.localidad?.toString() || "",
          codigoPostal: selectedTerminalData.codigoPostal?.toString() || "", // Convertido a string
          Telefono: selectedTerminalData.telefono?.toString() || "", // Convertido a string
          Rubro: selectedTerminalData.rubro?.toString() || "",
          RubroSecundario:
            selectedTerminalData.rubrosecundario?.toString() || "",
          Mail: selectedTerminalData.mail?.toString() || "",
          Razonsocial: selectedTerminalData.razonsocial?.toString() || "",
          CuitRazonSocial:
            selectedTerminalData.cuitrazonsocial?.toString() || "", // Convertido a string
          EstadoAfip: selectedTerminalData.estadoafip?.toString() || "",
          CodActividad: selectedTerminalData.codactividad?.toString() || "", // Convertido a string
          Actividad: selectedTerminalData.actividad?.toString() || "",
          Exento: selectedTerminalData.exento?.toString() || "",
          EstadoRentas: selectedTerminalData.estadorentas?.toString() || "",
          Actividad2: selectedTerminalData.actividaD2?.toString() || "",
          DomicilioFiscal:
            selectedTerminalData.domiciliofiscal?.toString() || "",
          Provincia3: selectedTerminalData.provinciA3?.toString() || "",
          Alicuota: selectedTerminalData.alicuota?.toString() || "", // Convertido a string
          CodActividadRentas:
            selectedTerminalData.codactividadrentas?.toString() || "", // Convertido a string
          ActividadRentas:
            selectedTerminalData.actividadrentas?.toString() || "",
          Titular: selectedTerminalData.titular?.toString() || "",
          CuitCuil: selectedTerminalData.cuitcuil?.toString() || "", // Convertido a string
          Banco: selectedTerminalData.banco?.toString() || "",
          TipoDeCuenta: selectedTerminalData.tipodecuenta?.toString() || "",
          CbuCvu: selectedTerminalData.cbucvu?.toString() || "",
          NDeCuenta: selectedTerminalData.ndecuenta?.toString() || "", // Convertido a string
          LetraCbu: selectedTerminalData.letracbu?.toString() || "",
          LargoCbu: selectedTerminalData.largocbu?.toString() || "", // Convertido a string
          Alias: selectedTerminalData.alias?.toString() || "",
          FechaBaja: selectedTerminalData.fechaBaja?.toString() || "",
          FechaAlta: selectedTerminalData.fechaAlta?.toString() || "",
        });
      }
    },
    [datos]
  );

  useEffect(() => {
   
  }, []);

  const handleSelectorChange = (selectedOption) => {
    setSearchField(selectedOption.value);
    setSearchValue("");
  };
  const selectOptions = [
    { value: "ndeterminal", label: "N° Terminal" },
    { value: "ndecomercio", label: "N° Comercio" },
    { value: "cuitcuil", label: "CUIT/CUIL" },
    //{ value: "cuitrazonsocial", label: "Cuit razón social" },
    // { value: "estado", label: "Estado" },
    { value: "provincia", label: "Provincia" },
    { value: "localidad", label: "Localidad" },
  ];

  const selectOptionsDefault = [
    { value: "ndeterminal", label: "N° Terminal" },
 
    { value: "cuitcuil", label: "CUIT/CUIL" },
    
  ];

    const handleShowModal = (
        dato = getInitialFieldValues(),
        editMode = true,
        tipo = "alta"
    ) => {
        const transformedData = {
            ...dato,
            cuitcuil: dato.cuitcuil?.toString() || "",
            cuitrazonsocial: dato.cuitrazonsocial?.toString() || "",
        };

        setModalData(transformedData);
        setIsEditMode(editMode);
        setTipoOperacion(tipo);
        setShowModal(true);

        // Solo validar si es modo edición o los campos tienen algo
        const cuit1 = transformedData.cuitcuil.trim();
        const cuit2 = transformedData.cuitrazonsocial.trim();

        const shouldValidate = editMode || (cuit1.length > 0 && cuit2.length > 0);

        if (shouldValidate) {
            const isLengthValid = cuit1.length === 11 && cuit2.length === 11;
            const isMatch = cuit1 === cuit2;

            setCuitMismatch(!(isLengthValid && isMatch));
        } else {
            // Si no se debería validar todavía, asumir que no hay error
            setCuitMismatch(false);
        }

        //console.log("▶️ [Alta/Editar] CUITCuil:", typeof cuit1, cuit1);
        //console.log("▶️ [Alta/Editar] CUITRazonSocial:", typeof cuit2, cuit2);
    };




  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({});
  };

  const handleInputChange = (field, value) => {
    setModalData((prevData) => ({
      ...prevData,
      [field]: value,
      Tipo: prevData.Tipo || "alta",
    }));
  };
  
    useEffect(() => {
        const cuit1 = modalData.cuitcuil ? modalData.cuitcuil.toString().trim() : "";
        const cuit2 = modalData.cuitrazonsocial ? modalData.cuitrazonsocial.toString().trim() : "";

        const isLengthValid = cuit1.length === 11 && cuit2.length === 11;
        const isMatch = cuit1 === cuit2;

        // Si alguno tiene menos de 11 o no coinciden, hay mismatch
        if (!isLengthValid || !isMatch) {
            setCuitMismatch(true);
        } else {
            setCuitMismatch(false);
        }
    }, [modalData.cuitcuil, modalData.cuitrazonsocial]);

  const handleSaveChanges = async () => {
    try {
      setIsSubmitting(true);
      const token = sessionStorage.getItem("token");

      const dataToSend = { token };

      // Mapeamos todas las claves de modalData usando el fieldMap
      Object.keys(modalData).forEach((key) => {
        const mappedKey = fieldMap[key]; // Mapeamos cada clave
        if (mappedKey) {
          dataToSend[mappedKey] =
            modalData[key] !== null ? modalData[key].toString() : "";
        }
      });

      // Añadir el valor de 'Tipo' desde la variable tipoOperacion o un estado
      dataToSend.Tipo = tipoOperacion || "alta"; // Si 'tipoOperacion' no está definido, se usa "alta" como valor por defecto

      // Determinar la URL según el tipo de operación
      const apiUrl =
        view === "alta"
          ? "/api/altas/editarcrmalta"
          : "/api/bajas/editarcrmbajas";

      // Enviar los datos mediante fetch
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      // Manejo de errores
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      setIsSubmitting(false);

      // Si todo está bien, cerrar el modal y mostrar mensaje de éxito
      handleCloseModal();
      Swal.fire({
        icon: "success",
        title: "Cambios guardados",
        text: "Los cambios han sido guardados exitosamente.",
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      setIsSubmitting(false);
      console.error("Error al guardar los cambios:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Los cambios no pudieron ser guardados.",
      });
    }
  };
  const handleOpenHistorialModal = async (id) => {
    const token = sessionStorage.getItem("token");
    try {
      setSelectedId(id); // Aún actualizamos el estado si lo necesitas en otro lugar
      setLoadingHistorial(true);
      setShowHistorialModal(true);

      // Usa directamente el valor `id` que obtuviste como parámetro
      const response = await fetch("api/historial/listahistorialcrmporid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          Id: id.toString(), // Usa el `id` directamente en lugar de `selectedId`
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setHistorialData(data);
      setLoadingHistorial(false);
    } catch (error) {
      console.error("Error al obtener el historial:", error);
      setLoadingHistorial(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar el historial.",
      });
    }
  };

  const handleCloseHistorialModal = () => {
    setShowHistorialModal(false);
    setHistorialData([]);
  };

  const handleNewModalSubmit = async () => {
    if (selectValue === "default" || !selectValue) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Debe seleccionar una opción válida antes de enviar.",
      });
      return; // Salir de la función para evitar enviar el formulario
    }
    if (terminalAlta) {
      const terminal = datos.find((dato) => dato.ndeterminal === terminalAlta);

      if (selectValue === "option1" && terminalBaja) {
        const terminal = datos.find(
          (dato) => dato.ndeterminal === terminalBaja
        );
      }
    }
    if (selectValue === "option5" && terminalAlta) {
      const terminal = datos.find((dato) => dato.ndeterminal === terminalAlta);

      if (terminal && terminal.estado === "ALTA") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No puede seleccionar una terminal en estado 'ALTA' para la opción de Desvinculación.",
        });
        return; // Salir de la función para evitar enviar el formulario
      }
    }
    setIsSubmitting(true);
    const apiMap = {
      option1: "/api/abm/baja",
      option2: "/api/abm/sstt",
      option3: "/api/abm/ssttcambio",
      option4: "/api/abm/bajaycambioclover",
      option5: "/api/abm/desvinculacion", // Nueva opción
      option6: "/api/abm/cambiotitularidad", // API para cambio de titularidad
      option7:"/api/abm/extraviada" //api de extraviada
    };

    const apiUrl = apiMap[selectValue];
    const token = sessionStorage.getItem("token");

    const dataToSend = {
      Token: token,
      Tipo: selectValue,
      Observacion: observacion,
      NumeroTerminalBaja: terminalBaja ? terminalBaja.toString() : "",
      NumeroTerminalAlta: terminalAlta ? terminalAlta.toString() : "",
      Motivo: selectMotivo,
      FechaBaja: modalData.FechaBaja || "", // Asegúrate de incluir la fecha de baja
      FechaAlta: modalData.FechaAlta || "", // Asegúrate de incluir la fecha de alta
    };

    // Si es opción 6, agrega los datos de titularidad
    if (selectValue === "option6") {
      Object.assign(dataToSend, {
        Titular: modalData.Titular || "", // Nombre del titular
        CuitCuil: modalData.CuitCuil || "", // CUIT/CUIL del titular
        Banco: modalData.Banco || "", // Nombre del banco
        TipoDeCuenta: modalData.TipoDeCuenta || "", // Tipo de cuenta
        CbuCvu: modalData.CbuCvu || "", // CBU o CVU
        NDeCuenta: modalData.NDeCuenta || "", // Número de cuenta
        LetraCbu: modalData.LetraCbu || "", // Letra del CBU
        LargoCbu: modalData.LargoCbu ? parseInt(modalData.LargoCbu, 10) : null, // Largo del CBU
        Alias: modalData.Alias || "", // Alias del CBU
        NDeComercio: modalData.NDeComercio || "", // Número de comercio
        Legajo: modalData.Legajo?.toString() || "", // **Convertir Legajo a string**
        NombreDeFantasia: modalData.NombreDeFantasia || "", // Nombre de fantasía
        Domicilio: modalData.Domicilio || "", // Domicilio
        Localidad: modalData.Localidad || "", // Localidad
        codigoPostal: modalData.codigoPostal || "", // Código postal
        Telefono: modalData.Telefono || "", // Teléfono
        Rubro: modalData.Rubro || "", // Rubro
        RubroSecundario: modalData.RubroSecundario || "", // Rubro secundario
        Mail: modalData.Mail || "", // Correo electrónico
        Razonsocial: modalData.Razonsocial || "", // Razón social
        CuitRazonSocial: modalData.CuitRazonSocial || "", // CUIT de la razón social
        EstadoAfip: modalData.EstadoAfip || "", // Estado en AFIP
        CodActividad: modalData.CodActividad || "", // Código de actividad
        Actividad: modalData.Actividad || "", // Actividad económica
        Exento: modalData.Exento || "", // Exento
        EstadoRentas: modalData.EstadoRentas || "", // Estado en Rentas
        Actividad2: modalData.Actividad2 || "", // Actividad secundaria
        DomicilioFiscal: modalData.DomicilioFiscal || "", // Domicilio fiscal
        Provincia3: modalData.Provincia3 || "", // Provincia
        Alicuota: modalData.Alicuota || "", // Alícuota
        CodActividadRentas: modalData.CodActividadRentas || "", // Código de actividad en Rentas
        ActividadRentas: modalData.ActividadRentas || "", // Actividad en Rentas
      });
    }

   
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }

      setIsSubmitting(false);
      handleCloseNewModal();
      Swal.fire({
        icon: "success",
        title: "Datos guardados",
        text: "Los datos han sido guardados exitosamente.",
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      setIsSubmitting(false);
      console.error("Error al enviar los datos:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Los datos no pudieron ser guardados.",
      });
    }
  };

  const handleCloseNewModal = () => {
    setShowNewModal(false);
    setTerminalBaja("");
    setTerminalAlta("");
    setSelectValue("");
    setObservacion("");
    setMotivo("");
  };

    const handleTerminalAltaChange = (selectedOption) => {
        if (selectedOption) {
            const terminal = datos.find((datos) => datos.ndeterminal === selectedOption.value);

            if (terminal) {
                const newData = {};

                Object.keys(fieldMap).forEach((key) => {
                    let value = terminal[key] || "";

                    // Forzar que los CUITs sean string
                    if (key === "cuitcuil" || key === "cuitrazonsocial") {
                        value = value.toString();
                    }

                    newData[key] = value;
                });

                setModalData(newData);
            }

            setTerminalAlta(selectedOption.value);
        } else {
            setTerminalAlta("");
            setModalData(getInitialFieldValues());
        }
    };


  const hasLetters = (str) => {
    return /[a-zA-Z]/.test(str);
  };
  const handleCopyFromTerminal = () => {
    const terminalData = datos.find(
      (dato) => dato.ndeterminal === selectedTerminalForCopy
    );

    if (terminalData) {
      const updatedData = {};
      Object.keys(modalData).forEach((key) => {
        // Excluir los campos "id", "ndeterminal", y "ndecomercio"
        if (!["id", "ndeterminal", "ndecomercio"].includes(key)) {
          updatedData[key] = terminalData[key] || "";
        }
      });

      // Actualizar los datos del modal excepto los campos excluidos
      setModalData((prevData) => ({
        ...prevData,
        ...updatedData,
      }));
    } else {
    }
  };
  const tableRowStyle = {
    transition: "transform 0.2s ease-in-out",
  };

  const tableCellStyle = (isExpanded) => ({
    whiteSpace: isExpanded ? "normal" : "nowrap",
    overflow: isExpanded ? "visible" : "hidden",
    textOverflow: isExpanded ? "clip" : "ellipsis",
    height: isExpanded ? "auto" : "60px",
  });

  const renderField = (key) => {
    const displayName = fieldMap[key] || key;
    const value = modalData[key] || "";
    const commonProps = {
      key,
      controlId: key,
      className: "mb-3",
    };
    switch (key) {
      case "sasmutual":
      case "id":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control type="text" value={value} readOnly />
          </Form.Group>
        );
      case "ndeterminal":
        if (!isEditMode) {
          const terminalOptions = datos
            .filter((datos) => datos.estado !== "ALTA")
            .map((datos) => ({
              value: datos.ndeterminal,
              label: datos.ndeterminal,
            }));
          return (
            <Form.Group {...commonProps}>
              <Form.Label>{displayName}</Form.Label>
              <Select
                value={
                  terminalOptions.find((option) => option.value === value) ||
                  null
                }
                onChange={handleTerminalAltaChange}
                options={terminalOptions}
                isClearable
              />
            </Form.Group>
          );
        }
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control type="text" value={value} readOnly />
          </Form.Group>
        );
      case "estado":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            {isEditMode ? (
              <Form.Control
                readOnly
                value={
                  estadoOptions.find((option) => option.value === value)
                    ?.label || ""
                }
              />
            ) : (
              <Select
                value={estadoOptions.find((option) => option.value === value)}
                onChange={(selectedOption) =>
                  handleInputChange(key, selectedOption.value)
                }
                options={estadoOptions}
              />
            )}
          </Form.Group>
        );

      case "legajo":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={legajos.find((option) => option.value === value)}
              onChange={(selectedOption) =>
                handleInputChange(key, selectedOption.value)
              }// Llama a la función cuando se selecciona un legajo
              options={legajos}
              isClearable
            />
          </Form.Group>
        );
      case "ndecomercio":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={
                comercios.find((option) => option.value === value) || {
                  value,
                  label: value,
                }
              }
              onChange={(selectedOption) =>
                handleInputChange(key, selectedOption.value)
              }
              options={comercios}
            />
          </Form.Group>
        );
      case "nroLocal":
      case "codigoPostal":
      case "telefono":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control
              type="text"
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              maxLength={key === "nrolocal" ? 4 : 15}
              pattern={
                key === "telefono" || key === "codigopostal"
                  ? "[0-9]*"
                  : undefined
              }
              //style={{ backgroundColor: getBackgroundColor(key) }}
            />
          </Form.Group>
        );
      case "linkdepago":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={linkDePagoOptions.find((option) => option.value === value)}
              onChange={(selectedOption) =>
                handleInputChange(key, selectedOption.value)
              }
              options={linkDePagoOptions}
            />
          </Form.Group>
        );
      case "rubro":
      case "rubrosecundario":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={rubros.find((option) => option.value === value) || null}
              onChange={(selectedOption) =>
                handleInputChange(
                  key,
                  selectedOption ? selectedOption.value : ""
                )
              }
              options={rubros}
              isClearable
            />
          </Form.Group>
        );
      case "altaahorA12":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={altaAhora12Options.find(
                (option) => option.value === value
              )}
              onChange={(selectedOption) =>
                handleInputChange(key, selectedOption.value)
              }
              options={altaAhora12Options}
            />
          </Form.Group>
        );
      case "fechadealta":
      case "fechadebaja":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control
              type="text"
              value={value || ""}
              onChange={(e) => handleDateChange(key, e.target.value)}
              placeholder="YYYY/MM/DD"
              maxLength={10}
              //style={{ backgroundColor: getBackgroundColor(key) }}
            />
          </Form.Group>
        );
      case "provincia":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={
                provincias.find((option) => option.value === value) || {
                  value,
                  label: value,
                }
              }
              onChange={(selectedOption) =>
                handleInputChange(
                  key,
                  selectedOption ? selectedOption.value : ""
                )
              }
              options={provincias}
              isClearable
            />
          </Form.Group>
        );
      case "nombredelasesor":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={
                asesores.find((option) => option.value === value) || {
                  value,
                  label: value,
                }
              }
              onChange={(selectedOption) =>
                handleInputChange(
                  key,
                  selectedOption ? selectedOption.value : ""
                )
              }
              options={asesores}
              isClearable
            />
          </Form.Group>
        );
      case "alta":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={
                altaOptions.find((option) => option.value === value) || {
                  value,
                  label: value,
                }
              }
              onChange={(selectedOption) =>
                handleInputChange(
                  key,
                  selectedOption ? selectedOption.value : ""
                )
              }
              options={altaOptions}
              isClearable
            />
          </Form.Group>
        );
      case "baja":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={
                bajaOptions.find((option) => option.value === value) || {
                  value,
                  label: value,
                }
              }
              onChange={(selectedOption) =>
                handleInputChange(
                  key,
                  selectedOption ? selectedOption.value : ""
                )
              }
              options={bajaOptions}
              isClearable
            />
          </Form.Group>
        );
      case "mail":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control
              type="email"
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              //style={{ backgroundColor: getBackgroundColor(key) }}
            />
          </Form.Group>
        );
        case "cuitcuil":
            const cuitCuilLengthError = value.length !== 11;

            return (
                <Form.Group {...commonProps}>
                    <Form.Label>{displayName}</Form.Label>
                    <Form.Control
                        type="number"
                        value={value}
                        isInvalid={cuitMismatch || cuitCuilLengthError}
                        onChange={(e) => {
                            const inputValue = e.target.value;

                            if (inputValue.length <= 11) {
                                handleInputChange(key, inputValue);
                            }
                        }}
                        onWheel={(e) => e.target.blur()}
                    />
                    {cuitCuilLengthError && (
                        <Form.Control.Feedback type="invalid">
                            El CUIT debe tener exactamente 11 dígitos.
                        </Form.Control.Feedback>
                    )}
                    {!cuitCuilLengthError && cuitMismatch && (
                        <Form.Control.Feedback type="invalid">
                            El CUIT del titular y el de la razón social deben coincidir.
                        </Form.Control.Feedback>
                    )}
                </Form.Group>
            );

        case "banco":
            return (
                <Form.Group {...commonProps}>
                    <Form.Label>{displayName}</Form.Label>
                    <Select
                        value={
                            bancos
                                .map((banco) => ({
                                    value: banco.nomBanco,
                                    label: banco.nomBanco,
                                }))
                                .find((option) => option.value === value) || {
                                value,
                                label: value,
                            }
                        }
                        onChange={(selectedOption) =>
                            handleInputChange(key, selectedOption.value)
                        }
                        options={bancos.map((banco) => ({
                            value: banco.nomBanco,
                            label: banco.nomBanco,
                        }))}
                        isClearable
                    />
                </Form.Group>
            );


      case "tipodecuenta":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={
                tipoCuentaOptions.find((option) => option.value === value) || {
                  value,
                  label: value,
                }
              }
              onChange={(selectedOption) => {
                handleInputChange(key, selectedOption.value);
                handleInputChange(
                  "cbucvu",
                  selectedOption.value === "BILLETERA VIRTUAL" ? "CVU" : "CBU"
                );
              }}
              options={tipoCuentaOptions}
              isClearable
            />
          </Form.Group>
        );
      case "cbucvu":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control
              type="text"
              value={value}
              readOnly
              //style={{ backgroundColor: getBackgroundColor(key) }}
            />
          </Form.Group>
        );
      case "ndecuenta":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control
              type="number"
              value={value}
              onChange={(e) => {
                const newValue = e.target.value;
                handleInputChange(key, newValue);
                handleInputChange(
                  "letracbu",
                  hasLetters(newValue) ? "CORRECTO" : "INCORRECTO"
                );
                handleInputChange("largocbu", newValue.length);
              }}
              //style={{ backgroundColor: getBackgroundColor(key) }}
            />
          </Form.Group>
        );
      case "letracbu":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control
              type="text"
              value={value}
              readOnly
              //style={{ backgroundColor: getBackgroundColor(key) }}
            />
          </Form.Group>
        );
      case "largocbu":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control
              type="number"
              value={value}
              readOnly
              //style={{ backgroundColor: getBackgroundColor(key) }}
            />
          </Form.Group>
        );
        case "cuitrazonsocial":
            const cuitRazonLengthError = value.length !== 11;

            return (
                <Form.Group {...commonProps}>
                    <Form.Label>{displayName}</Form.Label>
                    <Form.Control
                        type="number"
                        value={value}
                        isInvalid={cuitMismatch || cuitRazonLengthError}
                        onChange={(e) => {
                            const inputValue = e.target.value;

                            if (inputValue.length <= 11) {
                                handleInputChange(key, inputValue);
                            }
                        }}
                        onWheel={(e) => e.target.blur()}
                    />
                    {cuitRazonLengthError && (
                        <Form.Control.Feedback type="invalid">
                            El CUIT debe tener exactamente 11 dígitos.
                        </Form.Control.Feedback>
                    )}
                    {!cuitRazonLengthError && cuitMismatch && (
                        <Form.Control.Feedback type="invalid">
                            El CUIT del titular y el de la razón social deben coincidir.
                        </Form.Control.Feedback>
                    )}
                </Form.Group>
            );

      case "estadoafip":
        const estadoAfipOptions = [
          { value: "EXENTO", label: "EXENTO" },
          { value: "INHABILITADO", label: "INHABILITADO" },
          { value: "MONOTRIBUTISTA", label: "MONOTRIBUTISTA" },
          { value: "RESPONSABLE INSCRIPTO", label: "RESPONSABLE INSCRIPTO" },
        ];
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={
                estadoAfipOptions.find((option) => option.value === value) || {
                  value,
                  label: value,
                }
              }
              onChange={(selectedOption) =>
                handleInputChange(
                  key,
                  selectedOption ? selectedOption.value : ""
                )
              }
              options={estadoAfipOptions}
              isClearable
            />
          </Form.Group>
        );
      case "codactividad":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control
              type="number"
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              //style={{ backgroundColor: getBackgroundColor(key) }}
            />
          </Form.Group>
        );
      case "exento":
        const exentoOptions = [
          { value: "NO", label: "NO" },
          { value: "EXENTO GANANCIA", label: "EXENTO GANANCIA" },
        ];
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={
                exentoOptions.find((option) => option.value === value) || {
                  value,
                  label: value,
                }
              }
              onChange={(selectedOption) =>
                handleInputChange(
                  key,
                  selectedOption ? selectedOption.value : ""
                )
              }
              options={exentoOptions}
              isClearable
            />
          </Form.Group>
        );
      case "estadorentas":
        const estadoRentasOptions = [
          { value: "ALTA EN PROCESO", label: "ALTA EN PROCESO" },
          { value: "CM", label: "CM" },
          { value: "EXENTO", label: "EXENTO" },
          { value: "INSCRIPTO", label: "INSCRIPTO" },
          { value: "NO INSCRIPTO", label: "NO INSCRIPTO" },
        ];
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={
                estadoRentasOptions.find(
                  (option) => option.value === value
                ) || { value, label: value }
              }
              onChange={(selectedOption) =>
                handleInputChange(
                  key,
                  selectedOption ? selectedOption.value : ""
                )
              }
              options={estadoRentasOptions}
              isClearable
            />
          </Form.Group>
        );
      case "actividaD2":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control
              type="text"
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              //style={{ backgroundColor: getBackgroundColor(key) }}
            />
          </Form.Group>
        );
      case "provinciA3":
        const selectedProvincia = provincias.find(
          (option) => option.value === value
        ) || { value, label: value };
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Select
              value={
                isEditMode && selectedProvincia.value !== undefined
                  ? selectedProvincia
                  : { value, label: value }
              }
              onChange={(selectedOption) => {
                handleInputChange(
                  key,
                  selectedOption ? selectedOption.value : ""
                );
                const selectedAlicuota =
                  provincias.find(
                    (option) => option.value === selectedOption?.value
                  )?.alicuota || "";
                handleInputChange("alicuota", selectedAlicuota);
              }}
              options={provincias}
              isClearable
            />
          </Form.Group>
        );

      case "alicuota":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control
              type="text"
              value={value}
              readOnly
              //style={{ backgroundColor: getBackgroundColor(key) }}
            />
          </Form.Group>
        );

      case "codactividadrentas":
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control
              type="number"
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              //style={{ backgroundColor: getBackgroundColor(key) }}
            />
          </Form.Group>
        );

      default:
        return (
          <Form.Group {...commonProps}>
            <Form.Label>{displayName}</Form.Label>
            <Form.Control
              type="text"
              value={value}
              onChange={(e) => handleInputChange(key, e.target.value)}
              // style={{ backgroundColor: getBackgroundColor(key) }}
            />
          </Form.Group>
        );
    }
  };

  const handleSearchSubmit = () => {
    if (!searchValue || searchValue.trim().length < 4 || !searchField) {
      setShowAll(true);
      return;
    }
  
    setLoading(true);
    setTimeout(() => {
      // Solo actualizará los filtros cuando se haga clic en el botón
      setFilters((prevFilters) => ({
        ...prevFilters,
        searchTerms: {
          ...prevFilters.searchTerms,
          [searchField]: searchValue.trim(), // Agregar .trim() para eliminar espacios adicionales
        },
      }));
      setShowAll(false);
      setLoading(false);
      setSearchSubmitted(true); // Marcar que la búsqueda ha sido enviada
    }, 1000);
  };
    
    const filteredDatos = datos.filter((dato) => {
         // Filtrar por términos de búsqueda (cuando se haya enviado la búsqueda)
  const matchesSearchTerms = Object.keys(filters.searchTerms).every((field) => {
    const searchValue = filters.searchTerms[field]?.toLowerCase() || '';
    const datoField = dato[field]?.toString().toLowerCase() || '';

    // Para palabras exactas (Provincia, Localidad, etc.)
    if (isNaN(searchValue)) {
      // Compara exactitud para campos de texto (sin espacios adicionales)
      return datoField.trim() === searchValue.trim();
    }

    // Para números exactos (CUIT, N° de comercio, N° de terminal)
    return datoField === searchValue;
  });

  // Filtrar por estado seleccionado
  const matchesEstado = filters.estado
    ? dato.estado.toLowerCase() === filters.estado.toLowerCase()
    : true;

  // Retornar verdadero si ambos filtros coinciden
  return matchesSearchTerms && matchesEstado;
});
  const customFilterOption = (option, inputValue) => {
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  // Verificar si el campo seleccionado es Provincia o Localidad
  const isProvinciaOrLocalidad = (field) => {
    return field === "provincia" || field === "localidad"
  };
  const handleFilaClick = (index) => {
    setFilaExtendida(filaExtendida === index ? null : index);
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "ALTA":
        return <AltaIcon style={{ width: 24, height: 24 }} />;
      case "BAJA":
        return <BajaIcon style={{ width: 24, height: 24 }} />;
      case "SERVICIO.TECNICO":
        return <ServicioIcon style={{ width: 24, height: 24 }} />;
      case "DISPONIBLE":
        return <DisponibleIcon style={{ width: 24, height: 24 }} />;
      case "EXTRAVIADA":
        return <ExtraviadaIcon style={{ width: 24, height: 24 }} />;
      default:
        return estado; // En caso de que no haya un ícono para el estado
    }
  };
  const estadoOptions = [
    { value: 'ALTA', label: 'Alta' },
    { value: 'BAJA', label: 'Baja' },
    { value: 'SERVICIO.TECNICO', label: 'Servicio Técnico' },
    { value: 'DISPONIBLE', label: 'Disponible' },
    { value: 'EXTRAVIADA', label: 'Extraviada' },
    // Agrega más estados según sea necesario
  ];
  const isEstadoSelectDisabled = Object.keys(filters.searchTerms).length === 0;


  // Manejar cambio en el select de estado
  const handleEstadoChange = (estadoSeleccionado) => {
    if (!isEstadoSelectDisabled) { // Solo permitir el cambio si no está desactivado
      setFilters((prevFilters) => ({
        ...prevFilters,
        estado: estadoSeleccionado || null, // Actualizar el estado en los filtros
      }));
      setShowAll(false);
    }
  };
  // Filtrar datos por estado seleccionado
  
  const clearFilter = (filterName) => {
  setFilters((prevFilters) => {
    const updatedSearchTerms = { ...prevFilters.searchTerms };
    if (filterName in updatedSearchTerms) {
      delete updatedSearchTerms[filterName];
    }

    // Comprobar si solo queda el filtro de estado activo
    const remainingFiltersCount = Object.keys(updatedSearchTerms).length;
    if (remainingFiltersCount === 0) {
      // Si solo queda el filtro de estado, eliminarlo también
      return {
        ...prevFilters,
        searchTerms: updatedSearchTerms,
        estado: null,
      };
    }

    return {
      ...prevFilters,
      searchTerms: updatedSearchTerms,
    };
  });
};

// Función para eliminar el filtro de estado
const clearEstado = () => {
  setFilters((prevFilters) => {
    const updatedFilters = {
      ...prevFilters,
      estado: null,
    };

    // Comprobar si quedan otros filtros activos (excluyendo el estado)
    const remainingSearchTermsCount = Object.keys(prevFilters.searchTerms).length;
    if (remainingSearchTermsCount === 0) {
      // Si no quedan filtros, restablecer la búsqueda enviada
      setSearchSubmitted(false);
    }

    return updatedFilters;
  });
};
  const exportarExcel = () => {
    // Crea un libro de trabajo
    const workbook = XLSX.utils.book_new();
    // Convierte los datos en una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(filteredDatos);
    // Agrega la hoja de trabajo al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    // Genera el archivo Excel y lo descarga
    XLSX.writeFile(workbook, `Auditorias_${fecha}.xlsx`);
  };
  const isFilterAppliedAndHasResults = () => {
    const hasActiveSearchTerms = Object.keys(filters.searchTerms).length > 0;
    const hasEstado = !!filters.estado;
    const hasSearchResults = searchSubmitted && hasActiveSearchTerms && filteredDatos.length > 0;
    const hasEstadoResults = hasEstado && filteredDatos.length > 0;
  
    // Mostrar tabla solo si hay términos de búsqueda activos o estado seleccionado y hay resultados
    return (hasSearchResults || hasEstadoResults) && (hasActiveSearchTerms || hasEstado);
  };
  const nombretag= (key)=>{
    if (key==="provincia") return "Provincia"
    if (key==="cuitcuil") return "CUIT/CUIL"
    if (key==="localidad") return "Localidad"
    if (key==="ndecomercio") return "N° de comercio"
    if (key==="ndeterminal") return "N° de terminal"

  }
  const [nuevoHistorial, setNuevoHistorial] = useState({
    tipo: "",
    observaciones: "",
    usuarioNombre: "",
  });

  const handleAgregarHistorial = async () => {
    setIsSubmitting(true);
    const token = sessionStorage.getItem("token");
    
    const historialData = {
      token: token,
      AltaId: selectedId, // El ID de la terminal o el comercio
      Tipo: nuevoHistorial.tipo,
      Observaciones: nuevoHistorial.observaciones,
    };
  
    try {
      const response = await fetch("/api/historial/nuevohistorial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(historialData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error: ${response.status} - ${errorText}`);
      }
  
      // Recargar el historial actualizado después de agregar el nuevo
      handleOpenHistorialModal(selectedId);
  
      setShowAddHistorialModal(false);
      setNuevoHistorial({ tipo: "", observaciones: "" });
    } catch (err) {
      console.error("Error al agregar el historial:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar el historial.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  

  
  

  return (
    <>
      <div className="container" style={{ marginBottom: "10px" }}>
      <Row className="my-3 align-items-center">

    {/* Mostrar "Alta Nueva" y "Gestionar Terminales" solo si el rol es 8 */}
    {rol === 8 && (
      <>
        {/* Col para Alta Nueva */}
        <Col xs="auto">
          <Form.Label className="fs-18 lato-bold mb-0" style={{color: "#292B2F"}}>
            Alta Nueva
          </Form.Label>
        </Col>
        <Col xs="auto">
          <Button
            className="btn-publicar border-0 mx-1"
            onClick={() => handleShowModal({}, false, "alta")}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Col>

        {/* Col para Gestionar Terminales */}
        <Col xs="auto">
          <Form.Label className="fs-18 lato-bold mb-0" style={{color: "#292B2F"}}>
            Gestionar Terminales
          </Form.Label>
        </Col>
        <Col xs="auto">
          <Button
            className="btn-publicar border-0 mx-1"
            onClick={() => setShowNewModal(true)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
        </Col>
      </>
    )}

    {/* Col para Buscar */}
    <Col xs="auto">
      <Form.Label className="fs-18 lato-bold mb-0" style={{color: "#292B2F"}}>
        Buscar
      </Form.Label>
    </Col>

    {/* Select de Buscar */}
    <Col xs="auto">
      {rol === 8 ? (
        <Select
          className="select__control_custom-inicio select__control_custom lato-bold fs-12"
          classNamePrefix="select"
          value={selectOptions.find(option => option.value === searchField)}
          onChange={handleSelectorChange}
          options={selectOptions}
          isSearchable={true}
          filterOption={
            isProvinciaOrLocalidad(searchField) ? customFilterOption : undefined
          }
        />
      ) : (
        <Select
          className="select__control_custom-inicio select__control_custom lato-bold fs-12"
          classNamePrefix="select"
          value={selectOptionsDefault.find(option => option.value === searchField)}
          onChange={handleSelectorChange}
          options={selectOptionsDefault}
          isSearchable={true}
          filterOption={
            isProvinciaOrLocalidad(searchField) ? customFilterOption : undefined
          }
        />
      )}
    </Col>

    {/* Campo de Búsqueda */}
    <Col xs="auto">
      <FormControl
        className="form-control input-ingresar-buscador-crm px-5 border-0"
        placeholder={`Buscar por ${
          selectOptions.find(option => option.value === searchField)?.label || "Seleccione un campo"
        }`}
        aria-label={`Buscar por ${searchField}`}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        disabled={!searchField}
        style={{ width: "100%" }} // Cambiar a 100% para que ocupe todo el espacio disponible
      />
    </Col>

    {/* Botón de Buscar */}
    <Col xs="auto">
      <Button
        className="btn-publicar border-0 mx-1"
        onClick={handleSearchSubmit}
        disabled={!searchField || searchValue.length < 4}
      >
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </Col>
  </Row>

  {/* Fila para Filtrar por Estado y Exportar Tabla */}
  <Row className="my-3 align-items-center">
    <Col className="d-flex align-items-center justify-content-start">
      <Form.Label className="fs-18 lato-bold mb-0 me-2">Filtrar por Estado</Form.Label>
      <Select
        className="select__control_custom-inicio select__control_custom lato-bold fs-12 me-2"
        classNamePrefix="select"
        value={estadoOptions.find(option => option.value === filters.estado)}
        onChange={(option) => handleEstadoChange(option ? option.value : null)}
        options={estadoOptions}
        isClearable={true}
        placeholder="Estado"
        isDisabled={isEstadoSelectDisabled}
      />
    </Col>

    <Col xs="auto">
      <Form.Label className="fs-18 lato-bold mb-0">Exportar tabla</Form.Label>
      <Button
        className="btn-publicar border-0 mx-1"
        onClick={exportarExcel}
        style={{
          width: "200px",
          height: "44px",
          background: "#B4C400",
          color: "#FFFFFF",
          borderRadius: "32px",
        }}
      >
        <FontAwesomeIcon className="me-2" icon={faFileExcel} />
        Descargar Tabla
      </Button>
    </Col>
  </Row>

  <Row className="my-3 align-items-center">
    <Col>
      <div className="d-flex flex-wrap">
        {Object.entries(filters.searchTerms).map(([key, value]) => (
          <span
            key={key}
            className="badge me-2 mb-2"
            style={{ cursor: "pointer", background: "#B4C400", color: "#FFFFFF" }}
          >
            {`${nombretag(key)}: ${value}`} <span onClick={() => clearFilter(key)}>x</span>
          </span>
        ))}
        {filters.estado && (
          <span
            className="badge me-2 mb-2"
            style={{ cursor: "pointer", background: "#B4C400", color: "#FFFFFF" }}
          >
            {`Estado: ${filters.estado}`}{" "}
            <span onClick={clearEstado}>x</span>
          </span>
        )}
      </div>
    </Col>
  </Row>
</div>
      {rol===8?(
        <article>
        <div
          className={
            darkMode
              ? "container table-responsive py-3 px-5"
              : "container table-responsive py-3 px-5"
          }
        >
          {isFilterAppliedAndHasResults() ? (
          <Table table table-borderless responsive striped hover>
            <thead className="border-0 bg-dark py-2">
              <tr className="text-center tabla-thead">
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                  }
                  scope="col"
                >
                  Estado
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  Numero de terminal
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  Nombre de fantasia
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  N° de comercio
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  Direccion
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  Localidad
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  Titular
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  CUIT/CUIL
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  Email
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  Banco
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 border-tabla-derecha lato-regular fs-12 py-3"
                      : "bg-dark text-white border-0 fs-12 lato-regular py-3 border-tabla-derecha"
                  }
                  scope="col"
                >
                  Gestionar
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {loading ? (
                <div className="d-flex justify-content-center my-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (searchTerms && filteredDatos.length > 0) || showAll ? (
                (showAll ? datos : filteredDatos).map((dato, index) => (
                  <tr
                    className={
                      darkMode ? "bg-dark text-white" : "bg-white text-dark"
                    }
                    style={tableRowStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        // tableRowHoverStyle.transform;
                        e.currentTarget.style.overflow = "hidden"; // Asegura que no se muestre scroll lateral
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onClick={() => handleFilaClick(index)}
                    key={index}
                  >
                    {/* <td
                              className={
                                darkMode
                                  ? "fs-14 lato-regular py-4 prority-4 text-white "
                                  : "fs-14 lato-regular py-4 prority-4 "
                              } style={{ verticalAlign: "middle" }}
                            >
                              {dato.id}
                            </td> */}
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {getEstadoIcon(dato.estado)}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.ndeterminal}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.nombredefantasia}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.ndecomercio}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.domicilio}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.localidad}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.titular}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.cuitcuil}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.mail}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.banco}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <Button
                          variant="primary"
                          onClick={() => handleOpenHistorialModal(dato.id)}
                          className="btn-publicar border-0 me-2" // Clase adicional "me-2" para espacio entre botones
                          style={{
                            padding: "0 10px",
                            fontSize: "12px",
                          }}
                        >
                          <FontAwesomeIcon icon={faFileInvoice} />
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => handleShowModal(dato, true, "editar")}
                          className="btn-publicar border-0 me-2" // Clase adicional "me-2" para espacio entre botones
                          style={{
                            padding: "0 10px",
                            fontSize: "12px",
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => handleOpenOrigenDestino(dato.id)}
                          className="btn-publicar border-0"
                          style={{
                            padding: "0 10px",
                            fontSize: "12px",
                          }}
                        >
                          <FontAwesomeIcon icon={faLocationDot} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="lato-bold fs-16-a-10">
                    No se encontraron resultados para esta búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          ) : (
            <p>No se ha aplicado un filtro válido o no se encontraron resultados. Por favor, ingrese un valor para buscar o seleccione un estado.</p>
          )}
        </div>

      </article>

      ):(
        <article>
        <div
          className={
            darkMode
              ? "container table-responsive py-3 px-5"
              : "container table-responsive py-3 px-5"
          }
        >
          {isFilterAppliedAndHasResults() ? (
          <Table table table-borderless responsive striped hover>
            <thead className="border-0 bg-dark py-2">
              <tr className="text-center tabla-thead">
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3"
                  }
                  scope="col"
                >
                  Estado
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  Numero de terminal
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  Nombre de fantasia
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  Direccion
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  Localidad
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  Titular
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  CUIT/CUIL
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 lato-regular fs-12 py-3"
                      : "bg-dark text-white fs-12 lato-regular py-3"
                  }
                  scope="col"
                >
                  Email
                </th>
                <th
                  className={
                    darkMode
                      ? "bg-white text-dark border-0 border-tabla-derecha lato-regular fs-12 py-3"
                      : "bg-dark text-white border-0 fs-12 lato-regular py-3 border-tabla-derecha"
                  }
                  scope="col"
                >
                  Banco
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {loading ? (
                <div className="d-flex justify-content-center my-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (searchTerms && filteredDatos.length > 0) || showAll ? (
                (showAll ? datos : filteredDatos).map((dato, index) => (
                  <tr
                    className={
                      darkMode ? "bg-dark text-white" : "bg-white text-dark"
                    }
                    style={tableRowStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        // tableRowHoverStyle.transform;
                        e.currentTarget.style.overflow = "hidden"; // Asegura que no se muestre scroll lateral
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onClick={() => handleFilaClick(index)}
                    key={index}
                  >
                    {/* <td
                              className={
                                darkMode
                                  ? "fs-14 lato-regular py-4 prority-4 text-white "
                                  : "fs-14 lato-regular py-4 prority-4 "
                              } style={{ verticalAlign: "middle" }}
                            >
                              {dato.id}
                            </td> */}
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {getEstadoIcon(dato.estado)}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.ndeterminal}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.nombredefantasia}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.domicilio}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.localidad}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.titular}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.cuitcuil}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.mail}
                    </td>
                    <td
                      className={
                        darkMode
                          ? "fs-12 lato-regular py-4 prority-4 text-white "
                          : "fs-12 lato-regular py-4 prority-4 "
                      }
                      style={tableCellStyle(filaExtendida === index)}
                    >
                      {dato.banco}
                    </td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="lato-bold fs-16-a-10">
                    No se encontraron resultados para esta búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          ) : (
            <p>No se ha aplicado un filtro válido o no se encontraron resultados. Por favor, ingrese un valor para buscar o seleccione un estado.</p>
          )}
        </div>

      </article>
      )}

      

      

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Editar Datos" : "Agregar Alta"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={3}>
                {Object.keys(fieldMap)
                  .slice(0, Math.ceil(Object.keys(fieldMap).length / 4))
                  .map((key) => (
                    <div
                      key={key}
                      style={{
                        backgroundColor: getBackgroundColor(key),
                        borderRadius: "8px",

                        textAlign: "left",
                      }}
                    >
                      {renderField(key)}
                    </div>
                  ))}
              </Col>
              <Col md={3}>
                {Object.keys(fieldMap)
                  .slice(
                    Math.ceil(Object.keys(fieldMap).length / 4),
                    Math.ceil((Object.keys(fieldMap).length * 2) / 4)
                  )
                  .map((key) => (
                    <div
                      key={key}
                      style={{
                        backgroundColor: getBackgroundColor(key),
                        borderRadius: "8px",

                        textAlign: "left",
                      }}
                    >
                      {renderField(key)}
                    </div>
                  ))}
              </Col>
              <Col md={3}>
                {Object.keys(fieldMap)
                  .slice(
                    Math.ceil((Object.keys(fieldMap).length * 2) / 4),
                    Math.ceil((Object.keys(fieldMap).length * 3) / 4)
                  )
                  .map((key) => (
                    <div
                      key={key}
                      style={{
                        backgroundColor: getBackgroundColor(key),
                        borderRadius: "8px",

                        textAlign: "left",
                      }}
                    >
                      {renderField(key)}
                    </div>
                  ))}
              </Col>
              <Col md={3}>
                {Object.keys(fieldMap)
                  .slice(Math.ceil((Object.keys(fieldMap).length * 3) / 4))
                  .map((key) => (
                    <div
                      key={key}
                      style={{
                        backgroundColor: getBackgroundColor(key),
                        borderRadius: "8px",

                        textAlign: "left",
                      }}
                    >
                      {renderField(key)}
                    </div>
                  ))}


                {/* Aquí verificamos si la opción seleccionada en el campo ALTAS es "AGREGA" */}
                {modalData.alta === "AGREGA" && (
                  <>
                    <Form.Group controlId="selectTerminalForCopy">
                      <Form.Label>
                        Seleccionar terminal para copiar datos
                      </Form.Label>
                      <Select
                        value={
                          datos
                            .filter((dato) => dato.estado)
                            .map((dato) => ({
                              value: dato.ndeterminal,
                              label: `${dato.ndeterminal} - ${dato.estado}`,
                            }))
                            .find(
                              (option) =>
                                option.value === selectedTerminalForCopy
                            ) || null
                        }
                        onChange={(option) =>
                          setSelectedTerminalForCopy(option?.value)
                        }
                        options={datos
                          .filter((dato) => dato.estado)
                          .map((dato) => ({
                            value: dato.ndeterminal,
                            label: `${dato.ndeterminal} - ${dato.estado}`,
                          }))}
                        placeholder="Selecciona una terminal"
                        isClearable
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleCopyFromTerminal();
                        setSelectedTerminalForCopy(null); // Resetea el valor del Select a default
                      }}
                      disabled={!selectedTerminalForCopy}
                    >
                      Tomar datos de la terminal seleccionada
                    </Button>
                  </>
                )}
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button
             variant="success"
             onClick={handleSaveChanges}
             disabled={isSubmitting || cuitMismatch}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" />
              </>
            ) : isEditMode ? (
              "Guardar Cambios"
            ) : (
              "Enviar"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showNewModal} onHide={handleCloseNewModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Gestionar Terminales</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="selectOption">
              <Form.Label>Acción a realizar</Form.Label>
              <Form.Control
                as="select"
                value={selectValue || "default"} // Por defecto selecciona "default"
                onChange={(e) => {
                  setSelectValue(e.target.value);
                  if (e.target.value === "option1"|| e.target.value === "option7") {
                    setTerminalAlta("");
                  }
                }}
              >
                <option value="default" disabled>
                  Por favor, seleccione una opción
                </option>
                <option value="option1">Baja</option>
                <option value="option2">SSTT</option>
                <option value="option3">SSTT Cambio de Terminal</option>
                <option value="option4">Baja Verifone y Cambio Clover</option>
                <option value="option5">Desvinculación</option>
                <option value="option6">Cambio Titularidad</option>
                <option value="option7">Terminal Extraviada</option>{" "}
                {/* Nueva opción */}
              </Form.Control>
            </Form.Group>
            {/* Terminal a dar de baja - incluye "ALTA" y "SERVICIO.TECNICO" */}
            <Form.Group controlId="terminalBaja">
              <Form.Label>Terminal a dar de baja</Form.Label>
              <Select
                value={
                  getTerminalOptions.find(
                    (option) => option.value === terminalBaja
                  ) || null
                }
                onChange={handleTerminalSelection}
                options={getTerminalOptions}
                isClearable
              />
            </Form.Group>

            {/* Terminal a dar de alta - excluye "ALTA" */}
            <Form.Group controlId="terminalAlta">
              <Form.Label>Terminal a dar de alta</Form.Label>
              {selectValue === "option4" || selectValue === "option5" ? (
                <Form.Control
                  type="text"
                  value={terminalAlta}
                  onChange={(e) => setTerminalAlta(e.target.value)}
                />
              ) : (
                <Select
                  value={
                    getTerminalOptions.find(
                      (option) => option.value === terminalAlta
                    ) || null
                  }
                  onChange={(option) =>
                    setTerminalAlta(option ? option.value : "")
                  }
                  options={getTerminalOptions}
                  isClearable
                  isDisabled={
                    selectValue === "option1" ||
                    selectValue === "option2" ||
                    selectValue === "option6" ||
                    selectValue === "option7"
                  }
                />
              )}
            </Form.Group>
            {/* Observación */}
            <Form.Group controlId="observacion">
              <Form.Label>Observación</Form.Label>
              <Form.Control
                type="text"
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
              />
            </Form.Group>

            {/* Acción a realizar */}

            <Row>
              <Col md={6}>
                <FormGroup controlId="selectMotivo">
                  <FormLabel>Motivo de Baja</FormLabel>
                  <FormControl
                    as="select"
                    value={selectMotivo || ""}
                    onChange={(e) => setMotivo(e.target.value)}
                  >
                    {bajaOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </FormControl>
                </FormGroup>
              </Col>

              <Col md={6}>
                <Form.Group controlId="fechadebaja">
                  <Form.Label>Fecha de Baja</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.FechaBaja || ""}
                    onChange={(e) =>
                      handleDateChange("FechaBaja", e.target.value)
                    } // Usar handleDateChange
                    placeholder="YYYY/MM/DD"
                    maxLength={10}
                  />
                </Form.Group>
              </Col>

              {/*<Col md={4}>*/}
              {/*  <Form.Group controlId="fechadealta">*/}
              {/*    <Form.Label>Fecha de Alta</Form.Label>*/}
              {/*    <Form.Control*/}
              {/*      type="text"*/}
              {/*      value={modalData.FechaAlta || ""}*/}
              {/*      onChange={(e) =>*/}
              {/*        handleDateChange("FechaAlta", e.target.value)*/}
              {/*      } // Usar handleDateChange*/}
              {/*      placeholder="YYYY/MM/DD"*/}
              {/*      maxLength={10}*/}
              {/*    />*/}
              {/*  </Form.Group>*/}
              {/*</Col>*/}
            </Row>

            {/* Campos adicionales para opción 6: Cambio Titularidad */}
            {/* Campos adicionales para opción 6: Cambio Titularidad */}
            {selectValue === "option6" && (
              <>
                <Form.Group controlId="Titular">
                  <Form.Label>Nombre del Titular</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.Titular || ""}
                    onChange={(e) =>
                      handleInputChange("Titular", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="CuitCuil">
                  <Form.Label>CUIT/CUIL del Titular</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.CuitCuil || ""}
                    onChange={(e) =>
                      handleInputChange("CuitCuil", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="Banco">
                  <Form.Label>Nombre del Banco</Form.Label>
                  
                  <Select
                    value={
                      bancos
                      .map((banco) => ({
                        value: banco.nomBanco,
                        label: banco.nomBanco,
                    }))
                    .find(
                        (option) => option.value === modalData.Banco
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      handleInputChange(
                        "Banco",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    options={bancos.map((banco) => ({
                      value: banco.nomBanco,
                      label: banco.nomBanco,
                  }))}
                    isClearable
                  />
                </Form.Group>

                <Form.Group controlId="TipoDeCuenta">
                  <Form.Label>Tipo de Cuenta</Form.Label>
                  <Select
                    value={
                      tipoCuentaOptions.find(
                        (option) => option.value === modalData.TipoDeCuenta
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      handleInputChange(
                        "TipoDeCuenta",
                        selectedOption ? selectedOption.value : ""
                      );
                      handleInputChange(
                        "CbuCvu",
                        selectedOption.value === "BILLETERA VIRTUAL"
                          ? "CVU"
                          : "CBU"
                      );
                    }}
                    options={tipoCuentaOptions}
                    isClearable
                  />
                </Form.Group>

                <Form.Group controlId="CbuCvu">
                  <Form.Label>CBU o CVU</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.CbuCvu || ""}
                    readOnly
                  />
                </Form.Group>

                <Form.Group controlId="NDeCuenta">
                  <Form.Label>Número de Cuenta</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.NDeCuenta || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      handleInputChange("NDeCuenta", newValue);
                      handleInputChange(
                        "LetraCbu",
                        hasLetters(newValue) ? "CORRECTO" : "INCORRECTO"
                      );
                      handleInputChange("LargoCbu", newValue.length);
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="LetraCbu">
                  <Form.Label>Letra del CBU</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.LetraCbu || ""}
                    readOnly
                  />
                </Form.Group>

                <Form.Group controlId="LargoCbu">
                  <Form.Label>Largo del CBU</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.LargoCbu || ""}
                    readOnly
                  />
                </Form.Group>

                <Form.Group controlId="Alias">
                  <Form.Label>Alias del CBU</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.Alias || ""}
                    onChange={(e) => handleInputChange("Alias", e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="NDeComercio">
                  <Form.Label>Número de Comercio</Form.Label>
                  <Select
                    value={
                      comercios.find(
                        (option) => option.value === modalData.NDeComercio
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      handleInputChange(
                        "NDeComercio",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    options={comercios}
                    isClearable
                  />
                </Form.Group>

                <Form.Group controlId="Legajo">
                  <Form.Label>Legajo</Form.Label>
                  <Select
                    value={
                      legajos.find(
                        (option) => option.value === modalData.Legajo
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      handleInputChange(
                        "Legajo",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    options={legajos}
                    isClearable
                  />
                </Form.Group>

                <Form.Group controlId="NombreDeFantasia">
                  <Form.Label>Nombre de Fantasía</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.NombreDeFantasia || ""}
                    onChange={(e) =>
                      handleInputChange("NombreDeFantasia", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="Domicilio">
                  <Form.Label>Domicilio</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.Domicilio || ""}
                    onChange={(e) =>
                      handleInputChange("Domicilio", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="Localidad">
                  <Form.Label>Localidad</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.Localidad || ""}
                    onChange={(e) =>
                      handleInputChange("Localidad", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="codigoPostal">
                  <Form.Label>Código Postal</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.codigoPostal || ""}
                    onChange={(e) =>
                      handleInputChange("codigoPostal", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="Telefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.Telefono || ""}
                    onChange={(e) =>
                      handleInputChange("Telefono", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="Rubro">
                  <Form.Label>Rubro</Form.Label>
                  <Select
                    value={
                      rubros.find(
                        (option) => option.value === modalData.Rubro
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      handleInputChange(
                        "Rubro",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    options={rubros}
                    isClearable
                  />
                </Form.Group>

                <Form.Group controlId="RubroSecundario">
                  <Form.Label>Rubro Secundario</Form.Label>
                  <Select
                    value={
                      rubros.find(
                        (option) => option.value === modalData.RubroSecundario
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      handleInputChange(
                        "RubroSecundario",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    options={rubros}
                    isClearable
                  />
                </Form.Group>

                <Form.Group controlId="Mail">
                  <Form.Label>Mail</Form.Label>
                  <Form.Control
                    type="email"
                    value={modalData.Mail || ""}
                    onChange={(e) => handleInputChange("Mail", e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="Razonsocial">
                  <Form.Label>Razón Social</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.Razonsocial || ""}
                    onChange={(e) =>
                      handleInputChange("Razonsocial", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="CuitRazonSocial">
                  <Form.Label>CUIT Razón Social</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.CuitRazonSocial || ""}
                    onChange={(e) =>
                      handleInputChange("CuitRazonSocial", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="EstadoAfip">
                  <Form.Label>Estado AFIP</Form.Label>
                  {/** Inicializamos las opciones dentro del Form.Group **/}
                  <Select
                    value={
                      [
                        { value: "EXENTO", label: "EXENTO" },
                        { value: "INHABILITADO", label: "INHABILITADO" },
                        { value: "MONOTRIBUTISTA", label: "MONOTRIBUTISTA" },
                        {
                          value: "RESPONSABLE INSCRIPTO",
                          label: "RESPONSABLE INSCRIPTO",
                        },
                      ].find(
                        (option) => option.value === modalData.EstadoAfip
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      handleInputChange(
                        "EstadoAfip",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    options={[
                      { value: "EXENTO", label: "EXENTO" },
                      { value: "INHABILITADO", label: "INHABILITADO" },
                      { value: "MONOTRIBUTISTA", label: "MONOTRIBUTISTA" },
                      {
                        value: "RESPONSABLE INSCRIPTO",
                        label: "RESPONSABLE INSCRIPTO",
                      },
                    ]}
                    isClearable
                  />
                </Form.Group>

                <Form.Group controlId="CodActividad">
                  <Form.Label>Código de Actividad</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.CodActividad || ""}
                    onChange={(e) =>
                      handleInputChange("CodActividad", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="Actividad">
                  <Form.Label>Actividad</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.Actividad || ""}
                    onChange={(e) =>
                      handleInputChange("Actividad", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="Exento">
                  <Form.Label>Exento</Form.Label>
                  {/** Inicializamos las opciones dentro del Form.Group **/}
                  <Select
                    value={
                      [
                        { value: "NO", label: "NO" },
                        { value: "EXENTO GANANCIA", label: "EXENTO GANANCIA" },
                      ].find((option) => option.value === modalData.Exento) ||
                      null
                    }
                    onChange={(selectedOption) =>
                      handleInputChange(
                        "Exento",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    options={[
                      { value: "NO", label: "NO" },
                      { value: "EXENTO GANANCIA", label: "EXENTO GANANCIA" },
                    ]}
                    isClearable
                  />
                </Form.Group>

                <Form.Group controlId="EstadoRentas">
                  <Form.Label>Estado Rentas</Form.Label>
                  {/** Inicializamos las opciones dentro del Form.Group **/}
                  <Select
                    value={
                      [
                        { value: "ALTA EN PROCESO", label: "ALTA EN PROCESO" },
                        { value: "CM", label: "CM" },
                        { value: "EXENTO", label: "EXENTO" },
                        { value: "INSCRIPTO", label: "INSCRIPTO" },
                        { value: "NO INSCRIPTO", label: "NO INSCRIPTO" },
                      ].find(
                        (option) => option.value === modalData.EstadoRentas
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      handleInputChange(
                        "EstadoRentas",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    options={[
                      { value: "ALTA EN PROCESO", label: "ALTA EN PROCESO" },
                      { value: "CM", label: "CM" },
                      { value: "EXENTO", label: "EXENTO" },
                      { value: "INSCRIPTO", label: "INSCRIPTO" },
                      { value: "NO INSCRIPTO", label: "NO INSCRIPTO" },
                    ]}
                    isClearable
                  />
                </Form.Group>

                <Form.Group controlId="Actividad2">
                  <Form.Label>Actividad 2</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.Actividad2 || ""}
                    onChange={(e) =>
                      handleInputChange("Actividad2", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="DomicilioFiscal">
                  <Form.Label>Domicilio Fiscal</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.DomicilioFiscal || ""}
                    onChange={(e) =>
                      handleInputChange("DomicilioFiscal", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="Provincia3">
                  <Form.Label>Provincia</Form.Label>
                  <Select
                    value={
                      provincias.find(
                        (option) => option.value === modalData.Provincia3
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      handleInputChange(
                        "Provincia3",
                        selectedOption ? selectedOption.value : ""
                      );
                      const selectedAlicuota =
                        provincias.find(
                          (option) => option.value === selectedOption?.value
                        )?.alicuota || "";
                      handleInputChange("Alicuota", selectedAlicuota);
                    }}
                    options={provincias}
                    isClearable
                  />
                </Form.Group>

                <Form.Group controlId="Alicuota">
                  <Form.Label>Alicuota</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.Alicuota || ""}
                    readOnly
                  />
                </Form.Group>

                <Form.Group controlId="CodActividadRentas">
                  <Form.Label>Código de Actividad Rentas</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.CodActividadRentas || ""}
                    onChange={(e) =>
                      handleInputChange("CodActividadRentas", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group controlId="ActividadRentas">
                  <Form.Label>Actividad Rentas</Form.Label>
                  <Form.Control
                    type="text"
                    value={modalData.ActividadRentas || ""}
                    onChange={(e) =>
                      handleInputChange("ActividadRentas", e.target.value)
                    }
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNewModal}>
            Cerrar
          </Button>
          <Button
            variant="success"
            onClick={handleNewModalSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm"></Spinner>
              </>
            ) : (
              "Enviar"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showHistorialModal}
        onHide={handleCloseHistorialModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Historial de la Terminal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingHistorial ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <div className="container table-responsive py-3 px-5">
              <Table responsive striped hover>
                <thead className={darkMode ? "bg-dark py-2" : "bg-light py-2"}>
                  <tr className="text-center tabla-thead">
                    <th
                      className={
                        darkMode
                          ? "bg-white text-dark border-tabla-izquierda border-0 fs-12 py-3"
                          : "bg-dark text-white border-tabla-izquierda border-0 fs-12 py-3"
                      }
                    >
                      ID
                    </th>
                    <th
                      className={
                        darkMode
                          ? "bg-white text-dark border-0 fs-12 py-3"
                          : "bg-dark text-white border-0 fs-12 py-3"
                      }
                    >
                      Nro Terminal
                    </th>
                    <th
                      className={
                        darkMode
                          ? "bg-white text-dark border-0 fs-12 py-3"
                          : "bg-dark text-white border-0 fs-12 py-3"
                      }
                    >
                      Fecha de Subida
                    </th>
                    <th
                      className={
                        darkMode
                          ? "bg-white text-dark border-0 fs-12 py-3"
                          : "bg-dark text-white border-0 fs-12 py-3"
                      }
                    >
                      Nombre Comercio
                    </th>
                    <th
                      className={
                        darkMode
                          ? "bg-white text-dark border-0 fs-12 py-3"
                          : "bg-dark text-white border-0 fs-12 py-3"
                      }
                    >
                      Tipo
                    </th>
                    <th
                      className={
                        darkMode
                          ? "bg-white text-dark border-0 fs-12 py-3"
                          : "bg-dark text-white border-0 fs-12 py-3"
                      }
                    >
                      Observaciones
                    </th>
                    <th
                      className={
                        darkMode
                          ? "bg-white text-dark border-tabla-derecha border-0 fs-12 py-3"
                          : "bg-dark text-white border-tabla-derecha border-0 fs-12 py-3"
                      }
                    >
                      Usuario Nombre
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {historialData.map((item, index) => (
                    <tr
                      className={
                        darkMode ? "bg-dark text-white" : "bg-white text-dark"
                      }
                      style={tableRowStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        // tableRowHoverStyle.transform;
                        e.currentTarget.style.overflow = "hidden"; // Asegura que no se muestre scroll lateral
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    onClick={() => handleFilaClick(index)}
                    key={index}
                    >
                      <td
                        className={
                          darkMode ? "fs-12 py-4 text-white" : "fs-12 py-4"
                        }
                        style={tableCellStyle(filaExtendida === index)}
                      >
                        {item.id}
                      </td>
                      <td
                        className={
                          darkMode ? "fs-12 py-4 text-white" : "fs-12 py-4"
                        }
                        style={tableCellStyle(filaExtendida === index)}
                      >
                        {item.bajaNroTerminal || "N/A"}
                      </td>
                      <td
                        className={
                          darkMode ? "fs-12 py-4 text-white" : "fs-12 py-4"
                        }
                        style={tableCellStyle(filaExtendida === index)}
                      >
                        {item.fechaSubida
                          ? new Date(item.fechaSubida).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td
                        className={
                          darkMode ? "fs-12 py-4 text-white" : "fs-12 py-4"
                        }
                        style={tableCellStyle(filaExtendida === index)}
                      >
                        {item.nombrecomercio || "N/A"}
                      </td>
                      <td
                        className={
                          darkMode ? "fs-12 py-4 text-white" : "fs-12 py-4"
                        }
                        style={tableCellStyle(filaExtendida === index)}
                      >
                        {item.tipo || "N/A"}
                      </td>
                      <td
                        className={
                          darkMode ? "fs-12 py-4 text-white" : "fs-12 py-4"
                        }
                        style={tableCellStyle(filaExtendida === index)}
                      >
                        {item.observaciones || "N/A"}
                      </td>
                      <td
                        className={
                          darkMode ? "fs-12 py-4 text-white" : "fs-12 py-4"
                        }
                        style={tableCellStyle(filaExtendida === index)}
                      >
                        {item.usuarioNombre || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
        <Button
      variant="success"
      onClick={() => {
        // Abre un nuevo modal o form para agregar historial
        setShowAddHistorialModal(true);
      }}
    >
      Agregar Nuevo Historial
    </Button>
          <Button variant="secondary" onClick={handleCloseHistorialModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
  show={showAddHistorialModal}
  onHide={() => setShowAddHistorialModal(false)}
  size="lg"
>
  <Modal.Header closeButton>
    <Modal.Title>Agregar Nuevo Historial</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="historialTipo">
        <Form.Label>Tipo</Form.Label>
        <Form.Control
          type="text"
          value={nuevoHistorial.tipo}
          onChange={(e) =>
            setNuevoHistorial({ ...nuevoHistorial, tipo: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group controlId="historialObservaciones">
        <Form.Label>Observaciones</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={nuevoHistorial.observaciones}
          onChange={(e) =>
            setNuevoHistorial({
              ...nuevoHistorial,
              observaciones: e.target.value,
            })
          }
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowAddHistorialModal(false)}>
      Cerrar
    </Button>
    <Button
      variant="success"
      onClick={handleAgregarHistorial}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <Spinner animation="border" size="sm" />
      ) : (
        "Agregar Historial"
      )}
    </Button>
  </Modal.Footer>
</Modal>
      <div>
        <Modal
          show={showOrigenDestinoModal}
          onHide={handleCloseOrigenDestinoModal}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Origen y Destino</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {idOrigenDestino ? (
              <OrigenDestino id={idOrigenDestino} />
            ) : (
              <p>Cargando datos...</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseOrigenDestinoModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CRM;
