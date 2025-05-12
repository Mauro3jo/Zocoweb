import React, { useContext, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faCaretLeft,
  faCaretRight,
  faCircle,
  faCirclePlus,
  faClock,
  faSpinner,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Form } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
moment.locale("es");
const localizer = momentLocalizer(moment);

function MyCalendar() {
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  
  const [showModal, setShowModal] = React.useState(false);
  const [events, setEvents] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    resetFormData();
  };

  const [showSecond, setShowSecond] = useState(false);
  const handleShowSecond = () => setShowSecond(true);
  const handleCloseSecond = () => {
    setShow(true);
    setShowSecond(false);
  };

  const [showThird, setShowThird] = useState(false);
  const handleShowThird = () => setShowThird(true);
  const handleCloseThird = () => {
    setShowThird(false);
  };

  useEffect(() => {
    localStorage.setItem("eventosCalendario", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("eventosCalendario"));
    if (storedEvents && storedEvents.length > 0) {
      setEvents(storedEvents);
    }
  }, []);

  // funcion para settear los datos en cada uno de los dias del calendario
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
    setFormData({
      tipo: event.category || "",
      titulo: event.title || "",
      comentario: event.description || "",
      fecha: moment(event.start).format("YYYY-MM-DD") || "",
      hora: moment(event.start).format("HH:mm") || "",
      estado: event.estado || "pendiente",
    });
  };
  const closeAndReset = () => {
    setSelectedEvent(null);
    setShowModal(false);
  };

  // funcion para darle color segun el tipo de categoria del evento
  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad";
    if (event.category === "recordatorio") {
      backgroundColor = "#E24444";
    } else if (event.category === "tarea") {
      backgroundColor = "#AAb000";
    } else if (event.category === "notas") {
      backgroundColor = "#292B2F ";
    } else if (event.category === "prospecto") {
      backgroundColor = "#B3B5BF";
    }
    return {
      style: {
        backgroundColor,
      },
    };
  };

  // datos capturados por el formulario

  const initialFormData = {
    tipo: "notas",
    titulo: "",
    comentario: "",
    fecha: "",
    hora: "",
    estado: "pendiente",
  };

  const [formData, setFormData] = useState(initialFormData);
  const resetFormData = () => {
    setFormData(initialFormData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // toma los datos ingresado en el formulario y los reflejas en el calendario.

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("eventosCalendario"));

    if (!storedEvents || storedEvents.length === 0) {
      const initialEvents = [
        {
          title: "Reunión importante",
          start: new Date(2023, 10, 8, 11, 11), // Año, mes (0-indexado), día, hora, minuto
          end: new Date(2023, 10, 8, 11, 11), // Año, mes (0-indexado), día, hora, minuto
          description: "Reunión para discutir los detalles del proyecto",
          category: "tarea",
        },
        {
          title: "Entrega del proyecto",
          start: new Date(2023, 10, 15, 14, 0),
          end: new Date(2023, 10, 15, 14, 0),
          description: "Entrega final del proyecto a los clientes",
          category: "recordatorio",
        },
        // ... Añade más eventos aquí si es necesario
      ];

      setEvents(initialEvents);
      localStorage.setItem("eventosCalendario", JSON.stringify(initialEvents));
    } else {
      setEvents(storedEvents);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newEvent = {
      title: formData.titulo || "Título por defecto",
      start: moment(
        formData.fecha + " " + formData.hora,
        "YYYY-MM-DD HH:mm"
      ).toDate(),
      end: moment(
        formData.fecha + " " + formData.hora,
        "YYYY-MM-DD HH:mm"
      ).toDate(),
      description: formData.comentario || "Descripción por defecto",
      category: formData.tipo || "Categoría por defecto",
    };

    const updatedEvents = events.concat(newEvent); // O puedes usar [...events, newEvent]

    setEvents(updatedEvents);
    localStorage.setItem("eventosCalendario", JSON.stringify(updatedEvents));

    closeAndReset();
    handleClose();
    resetFormData();
  };
  // funcion para borrar un evento en el calendario
  const handleBorrarEvent = () => {
    if (selectedEvent) {
      const updatedEvents = events.filter((event) => event !== selectedEvent);
      setEvents(updatedEvents); // Actualizar el estado de events
      closeAndReset();
      handleClose();
      handleCloseSecond();
      handleCloseThird();
    }
  };

  // Función para editar un evento existente

  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitEdit = (event) => {
    event.preventDefault();
    const newEvent = {
      title: formData.titulo || "Título por defecto",
      start: moment(
        formData.fecha + " " + formData.hora,
        "YYYY-MM-DD HH:mm"
      ).toDate(),
      end: moment(
        formData.fecha + " " + formData.hora,
        "YYYY-MM-DD HH:mm"
      ).toDate(),
      description: formData.comentario || "Descripción por defecto",
      category: formData.tipo || "Categoría por defecto",
    };

    const updatedEvents = events.map((ev) => {
      if (ev === selectedEvent) {
        return {
          ...ev,
          ...newEvent,
        };
      }
      return ev;
    });

    setEvents(updatedEvents);
    localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
    closeAndReset();
    handleClose();
    resetFormData();
  };

  const handleEdit = (event) => {
    if (selectedEvent) {
      const updatedEvents = events.map((ev) => {
        if (ev === selectedEvent) {
          return {
            ...ev,
            title: formData.titulo || "Título por defecto",
            start: moment(
              formData.fecha + " " + formData.hora,
              "YYYY-MM-DD HH:mm"
            ).toDate(),
            end: moment(
              formData.fecha + " " + formData.hora,
              "YYYY-MM-DD HH:mm"
            ).toDate(),
            description: formData.comentario || "Descripción por defecto",
            category: formData.tipo || "Categoría por defecto",
          };
        }
        handleCloseThird();
        return ev;
      });

      setEvents(updatedEvents);
      localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
      closeAndReset();
      handleClose();
    }
  };

  // Para cambiar el css de los botones notas y prospecto
  // const [tipoSeleccionado, setTipoSeleccionado] = React.useState(null);

  // Customizar la barra superior de botones del calendario
  const CustomToolbar = (toolbar) => {
    const goToToday = () => {
      toolbar.onView("month");
      toolbar.onNavigate("TODAY");
    };

    const viewDayAgenda = () => {
      toolbar.onView("day");
      toolbar.onNavigate("TODAY");
    };

    const handleNavigate = (action) => {
      const { view, date } = toolbar;
      let newDate = date;
      if (action === "PREV" && view === "month") {
        const prevMonth = moment(date).subtract(1, "month");
        if (prevMonth.month() === 11) {
          newDate = prevMonth.endOf("month").toDate();
        }
      }

      toolbar.onNavigate(action, newDate);
    };

  

    const { darkMode } = useContext(DarkModeContext);
    // custom bar del calendario
    return (
      <section>
        {/* ESCRITORIO */}
        <article className="d-none d-lg-block">
          <div className="custom-toolbar d-flex flex-wrap  justify-content-between ">
            <div className="toolbar-buttons d-flex  mb-4">
              <button
                className="border-0 btn-transparent"
                onClick={() => handleNavigate("PREV")}
              >
                <FontAwesomeIcon icon={faCaretLeft} size="lg" />
              </button>
              <div className="toolbar-label mx-3 my-2">{toolbar.label}</div>

              <button
                className="border-0 btn-transparent"
                onClick={() => handleNavigate("NEXT")}
              >
                <FontAwesomeIcon icon={faCaretRight} size="lg" />
              </button>
            </div>
            <div className="d-flex ">
              <div className="d-flex my-3 me-5">
                <div>
                  <h6 className="mx-1 fs-14">
                    <FontAwesomeIcon
                      className="mx-2"
                      icon={faCircle}
                      style={{ color: "#E24444" }}
                    />
                    Recordatorio
                  </h6>
                </div>
                <div>
                  <h6 className="mx-1 fs-14">
                    <FontAwesomeIcon
                      className="mx-2"
                      icon={faCircle}
                      style={{ color: "#AAb000" }}
                    />
                    Tareas
                  </h6>
                </div>
                <div>
                  <h6 className="mx-1 fs-14">
                    <FontAwesomeIcon
                      className="mx-2"
                      icon={faCircle}
                      style={{ color: "#292B2" }}
                    />
                    Notas
                  </h6>
                </div>
                <div>
                  <h6 className="mx-1 fs-14">
                    <FontAwesomeIcon
                      className="mx-2"
                      icon={faCircle}
                      style={{ color: "#B3B5BF" }}
                    />
                    Prospecto
                  </h6>
                </div>
              </div>
              <div className="d-flex ">
                <div>
                  <Button
                    className="btn-mes-dia border-0 pb-2 d-flex justify-content-center align-items-center"
                    onClick={goToToday}
                  >
                    <span className="text-center lato-bold">Mes</span>
                  </Button>
                </div>
                <div className="mx-5">
                  <Button
                    className="btn-mes-dia border-0 pb-2 d-flex justify-content-center align-items-center"
                    onClick={viewDayAgenda}
                  >
                    <span className="text-center lato-bold">Día</span>
                  </Button>
                </div>
              </div>
              <div>
                <Button
                  className="btn-more-calendario border-0 pb-2 d-flex justify-content-center align-items-center"
                  onClick={handleShow}
                >
                  <FontAwesomeIcon
                    className="mx-2"
                    icon={faCirclePlus}
                    style={{ color: "#ffffff" }}
                  />
                  <span style={{ textAlign: "center" }}>Nuevo</span>
                </Button>
              </div>
            </div>
          </div>
        </article>
        {/* CELULAR */}
        <div className="custom-toolbar">
          <article className="d-lg-none d-block">
            <div className="d-flex justify-content-between ">
              <div>
                <article className="d-flex">
                  <div>
                    <h6 className="mx-1 fs-12">
                      <FontAwesomeIcon
                        className="mx-2"
                        icon={faCircle}
                        style={{ color: "#E24444" }}
                      />
                      Recordatorio
                    </h6>
                  </div>
                  <div>
                    <h6 className="mx-1 fs-12">
                      <FontAwesomeIcon
                        className="mx-2"
                        icon={faCircle}
                        style={{ color: "#AAb000" }}
                      />
                      Tareas
                    </h6>
                  </div>
                </article>
                <article className="d-flex">
                  <div>
                    <h6 className="mx-1 fs-12">
                      <FontAwesomeIcon
                        className="mx-2"
                        icon={faCircle}
                        style={{ color: "#292B2" }}
                      />
                      Notas
                    </h6>
                  </div>
                  <div>
                    <h6 className="mx-1 fs-12">
                      <FontAwesomeIcon
                        className="mx-2"
                        icon={faCircle}
                        style={{ color: "#B3B5BF" }}
                      />
                      Prospecto
                    </h6>
                  </div>
                </article>
              </div>
              <div>
                <div>
                  <Button
                    className="btn-more-calendario border-0 pb-2 d-flex centrado"
                    onClick={handleShow}
                  >
                    <FontAwesomeIcon
                      className="mx-2"
                      icon={faCirclePlus}
                      style={{ color: "#ffffff" }}
                    />
                    Nuevo
                  </Button>
                </div>
              </div>
            </div>
            <div >
              <div className="py-2">
                <div className="d-flex justify-content-center">
                  <Button
                    className="btn-mes-dia border-0 pb-2 d-flex justify-content-center align-items-center mx-1"
                    onClick={goToToday}
                  >
                    <span className="text-center lato-bold">Mes</span>
                  </Button>
                  <Button
                    className="btn-mes-dia border-0 pb-2 d-flex justify-content-center align-items-center mx-1"
                    onClick={viewDayAgenda}
                  >
                    <span className="text-center lato-bold">Día</span>
                  </Button>
                </div>
   
              </div>
            </div>
            <div className="toolbar-buttons d-flex justify-content-center">
              <button
                className="border-0 btn-transparent"
                onClick={() => handleNavigate("PREV")}
              >
                <FontAwesomeIcon icon={faCaretLeft} size="lg" />
              </button>
              <div className="toolbar-label mx-3 my-2">{toolbar.label}</div>

              <button
                className="border-0 btn-transparent"
                onClick={() => handleNavigate("NEXT")}
              >
                <FontAwesomeIcon icon={faCaretRight} size="lg" />
              </button>
            </div>
          </article>
        </div>
      </section>
    );
  };


  // contenido del componente
  return (
    <div className="container py-5 my-5 px-5 bg-tabla-calculadora">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 650 }}
        views={["month", "day"]}
        defaultView="month"  
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleEventClick}
        components={{
          toolbar: CustomToolbar,
        }}
      />
      <div>
        {/* MODAL PARA ABRIR EL FORMULARIO */}
        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={show}
          onHide={handleClose}
        >
          <Modal.Body>
          <section className="d-flex justify-content-between my-4">
          <div className="ocultar-div"></div>
          <div className="d-flex justify-content-center">
            <h6 className="fs-18 lato-bold  "> Editar prospecto</h6>
          </div>
          <div>
            <button className="border-0 btn-filtro-cruz" onClick={handleClose}>
              <FontAwesomeIcon className="fs-18 " icon={faXmark} />
            </button>
          </div>
        </section>
            <div>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="my-3" controlId="formBasicEmail">
                  <Form.Control
                    className="input-titulo-comentario-detalle "
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="my-3" controlId="formBasicEmail">
                  <Form.Control
                    className="input-titulo-comentario-detalle "
                    as="textarea"
                    style={{ height: "100px" }}
                    name="comentario"
                    value={formData.comentario}
                    onChange={handleChange}
                  />
                </Form.Group>

                <section className="d-flex justify-content-around flex-wrap">
                  <article>
                    <div>
                      <Form.Group
                        className="my-3 d-flex"
                        controlId="formBasicEmail"
                      >
                        <FontAwesomeIcon
                          className="my-2 mx-1"
                          icon={faCalendarDays}
                          size="lg"
                          style={{ color: "#b4be00" }}
                        />
                        <Form.Label className="my-2 mx-1"> Fecha:</Form.Label>
                        <Form.Control
                          className="input-fecha-hora-estado"
                          type="date"
                          name="fecha"
                          value={formData.fecha}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </div>
                    <div>
                      <Form.Group
                        className="my-3 d-flex"
                        controlId="formBasicEmail"
                      >
                        <FontAwesomeIcon
                          className="my-2 mx-1"
                          icon={faClock}
                          size="lg"
                          style={{ color: "#b4be00" }}
                        />
                        <Form.Label className="my-2 mx-1"> Hora:</Form.Label>
                        <Form.Control
                          className="input-fecha-hora-estado"
                          type="time"
                          name="hora"
                          value={formData.hora}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </div>
                  </article>
                  <article className="pt-3">
                    <div>
                      <Form.Group className="d-flex" controlId="formBasicEmail">
                        <FontAwesomeIcon
                          className="my-2 mx-1"
                          icon={faSpinner}
                          size="lg"
                          style={{ color: "#b4be00" }}
                        />
                        <Form.Label className="my-2 mx-1"> Estado:</Form.Label>
                        <Form.Select
                          className="form-select-formulario-alta"
                          aria-label="Default select example"
                          name="estado"
                          value={formData.estado}
                          onChange={handleChange}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en curso"> En curso</option>
                          <option value="completado">Completado</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </article>
                </section>
                <div className="d-flex justify-content-between py-3">
                  <div>
                    <Button
                      className="btn-borrar border-0"
                      onClick={handleShowSecond}
                    >
                      Borrar
                    </Button>
                  </div>
                  <div>
                    <Button
                      className="mx-1 btn-cancelar border-0"
                      variant="secondary"
                      onClick={handleClose}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="mx-1 btn-guardar border-0"
                      variant="primary"
                      type="submit"
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </Modal.Body>
        </Modal>
        {/* MODAL CONFIRMAR BORRADO DE MODAL NUEVO */}
        <Modal
          show={showSecond}
          onHide={handleCloseSecond}
          centered
          animation={true}
          size="lg"
        >
          <Modal.Body className="centrado" style={{ height: "500px" }}>
            <div>
              <h1 className="fs-14 text-center">
                ¿Seguro que quieres borrar esta nota?
              </h1>
              <div className="d-flex  mt-5">
                <div className="mx-3">
                  <Button
                    onClick={handleCloseSecond}
                    className="btn-notas border-0"
                  >
                    Cancelar
                  </Button>
                </div>
                <div className="mx-3">
                  <Button
                    className="btn-aceptar border-0"
                    onClick={handleBorrarEvent}
                  >
                    Aceptar
                  </Button>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
      {/* MODAL DETALLES VISTA CALENDARIO  */}
      <Modal
        show={showModal}
        onHide={closeAndReset}
        size="lg"
        className="px-1"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
       
        <Modal.Body>
        <section className="d-flex justify-content-between my-4">
          <div className="ocultar-div"></div>
          <div className="d-flex justify-content-center">
          <h5 className=" fs-14 py-3 text-center">Detalle de nota/prospecto</h5>
          </div>
          <div>
            <button className="border-0 btn-filtro-cruz" onClick={closeAndReset}>
              <FontAwesomeIcon className="fs-18 " icon={faXmark} />
            </button>
          </div>
        </section>
         
          <div>
            <div className="">
              <h6 className=" fs-16-a-14">{selectedEvent?.title}</h6>
            </div>
            <hr />
            <div>
              <h6 className=" fs-16-a-14">{selectedEvent?.description}</h6>
            </div>

            <section className="d-flex justify-content-around">
              <article>
                <div>
                  <h6 className=" fs-16-a-14">
                    Fecha: {moment(selectedEvent?.start).format("DD-MM-YYYY")}
                  </h6>
                </div>
                <div>
                  <h6 className=" fs-16-a-14">
                    Hora: {moment(selectedEvent?.start).format("HH:mm")}
                  </h6>
                </div>
              </article>
              <article className="pt-3">
                <div className=" fs-16-a-14">
                  <Form.Group className="d-flex" controlId="validationCustom01">
                    <Form.Label className="my-2 me-3">Estado:</Form.Label>
                    <Form.Select
                      disabled
                      className="form-select-formulario-alta fs-16-a-14"
                      aria-label="Default select example"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en curso"> En curso</option>
                      <option value="completado">Completado</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              </article>
            </section>
            <div className="d-flex justify-content-between py-5">
              <div>
                <Button
                  className="btn-borrar border-0"
                  onClick={handleShowSecond}
                >
                  Borrar
                </Button>
              </div>

              <div>
                <Button
                  className="mx-1 btn-cancelar border-0"
                  variant="secondary"
                  onClick={handleShowThird}
                >
                  Editar
                </Button>
                <Button
                  className="mx-1 btn-guardar border-0"
                  variant="primary"
                  type="submit"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* MODAL PARA EDITAR CADA EVENTO */}
      <Modal
        show={showThird}
        onHide={handleCloseThird}
        centered
        animation={true}
        size="lg"
      >

        <Modal.Body>
        <section className="d-flex justify-content-between my-4">
          <div className="ocultar-div"></div>
          <div className="d-flex justify-content-center">
          <h5 className=" fs-14 py-3 text-center">Detalle de nota/prospecto</h5>
          </div>
          <div>
            <button className="border-0 btn-filtro-cruz" onClick={handleCloseThird}>
              <FontAwesomeIcon className="fs-18 " icon={faXmark} />
            </button>
          </div>
        </section>
          <div>
            <Form onSubmit={handleSubmitEdit}>
              <Form.Group className="my-3" controlId="formBasicEmail">
                <Form.Control
                  className="input-titulo-comentario-detalle "
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChangeEdit}
                />
              </Form.Group>
              <Form.Group className="my-3" controlId="formBasicEmail">
                <Form.Control
                  className="input-titulo-comentario-detalle "
                  as="textarea"
                  style={{ height: "100px" }}
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChangeEdit}
                />
              </Form.Group>

              <section className="d-flex justify-content-around flex-wrap">
                <article>
                  <div>
                    <Form.Group
                      className="my-3 d-flex"
                      controlId="formBasicEmail"
                    >
                      <FontAwesomeIcon
                        className="my-2 mx-1"
                        icon={faCalendarDays}
                        size="lg"
                        style={{ color: "#b4be00" }}
                      />
                      <Form.Label className="my-2 mx-1"> Fecha:</Form.Label>
                      <Form.Control
                        className="input-fecha-hora-estado"
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleChangeEdit}
                      />
                    </Form.Group>
                  </div>
                  <div>
                    <Form.Group
                      className="my-3 d-flex"
                      controlId="formBasicEmail"
                    >
                      <FontAwesomeIcon
                        className="my-2 mx-1"
                        icon={faClock}
                        size="lg"
                        style={{ color: "#b4be00" }}
                      />
                      <Form.Label className="my-2 mx-1"> Hora:</Form.Label>
                      <Form.Control
                        className="input-fecha-hora-estado"
                        type="time"
                        name="hora"
                        value={formData.hora}
                        onChange={handleChangeEdit}
                      />
                    </Form.Group>
                  </div>
                </article>
                <article className="pt-3">
                  <div>
                    <Form.Group className="d-flex" controlId="formBasicEmail">
                      <FontAwesomeIcon
                        className="my-2 mx-1"
                        icon={faSpinner}
                        size="lg"
                        style={{ color: "#b4be00" }}
                      />
                      <Form.Label className="my-2 mx-1"> Estado:</Form.Label>
                      <Form.Select
                        className="form-select-formulario-alta"
                        aria-label="Default select example"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChangeEdit}
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en curso"> En curso</option>
                        <option value="completado">Completado</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </article>
              </section>
              <div className="d-flex justify-content-between py-3">
                <div>
                  <Button
                    className="btn-borrar border-0"
                    onClick={handleShowSecond}
                  >
                    Borrar
                  </Button>
                </div>
                <div>
                  <Button
                    className="mx-1 btn-cancelar border-0"
                    variant="secondary"
                    onClick={handleCloseThird}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="mx-1 btn-guardar border-0"
                    variant="primary"
                    onClick={() => handleEdit(selectedEvent)}
                  >
                    Guardar cambios
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MyCalendar;
