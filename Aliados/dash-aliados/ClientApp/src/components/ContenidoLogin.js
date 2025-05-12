// import hoja de estilos css
import "./ContenidoLogin.css";

// import hooks
import React, { useContext, useState } from "react";

// import context
import { DarkModeContext } from "../context/DarkModeContext";

// import librerias
import { Form, Button, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import {
  faEye,
  faEyeSlash,
  faUser,
  faLock,
  faCaretLeft,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// import assets
import logo from "../assets/img/logo.png";

const ContenidoLogin = ({ setDatosMandados }) => {
  // estado para controlar el recuperar el pass
  const [recuperar, setRecuperar] = useState(false);

  // estado para mostrar el pass
  const [showPassword, setShowPassword] = useState(false);

  // estado para controlar el usuario
  const [usuario, setUsuario] = useState("");

  // estado para controlar el pass
  const [password, setPassword] = useState("");

  // estado para controlar el activado o desactivado
  const [isActive, setIsActive] = useState(0);

  // estado para controlar el spinner de carga
  const [isLoading, setIsLoading] = useState(false);

  // estado para controlar el texto del boton
  const [buttonText, setButtonText] = useState("Conectar");

  // hook useNavigate
  const navigate = useNavigate();

  // estado para manejar el contador
  const [contador, setContador] = useState(0);

  // context para la modalidad del claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // hooks que extraigo del useForm()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // funcion para modificar el cursor
  const handleMouseDown = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  // funcion para limpiar el formulario
  const handleLimpiarFormulario = () => {
    reset();
  };

  // funcion para recargar la pagina
  function recargarPagina() {
    window.location.reload();
  }

  // api url para el login
  const apiUrlLogin = process.env.REACT_APP_API_LOGIN;

  // con este obsubmit hago la consulta al login
  // aqui esta la logica para determinar por rol
  // del num del 1 al 9 y dependiendo del usuario.rol
  // le va a dar acceso a los distintos paneles.
  const onSubmit2 = () => {
    fetch(apiUrlLogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Usuario: usuario,
        Password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDatosMandados(data);

        if (data.rol === 0) {
          setIsActive(1);
          navigate("/aliados/inicio");
          recargarPagina();
          // Almacenar el token y el ID del usuario en sessionStorage
          sessionStorage.setItem("token", data.token);
        } else if (data.rol === 1) {
          // Este redireccionamiento queda pendiente para cuando exista la vistas de los asesores
          navigate("/asesores/check");
          recargarPagina();
          // Almacenar el token y el ID del usuario en sessionStorage
          sessionStorage.setItem("token", data.token);
        } else if (data.rol === 2) {
          navigate("/liquidaciones");
          recargarPagina();
            // Almacenar el token y el ID del usuario en sessionStorage /Calidad/Admin
          sessionStorage.setItem("token", data.token);
        } else if (data.rol === 3) {
            navigate("/Calidad/Admin");
            recargarPagina();
            // Almacenar el token y el ID del usuario en sessionStorage /Calidad/Admin
            sessionStorage.setItem("token", data.token);
        } else if (data.rol === 4) {
          navigate("/reclutamiento/busqueda");
          recargarPagina();
          // Almacenar el token y el ID del usuario en sessionStorage
          sessionStorage.setItem("token", data.token);
        } else if (data.rol === 5) {
            navigate("/facturacion/reporte");
            recargarPagina();
            // Almacenar el token y el ID del usuario en sessionStorage
            sessionStorage.setItem("token", data.token);
        } else if (data.rol === 6) {
          navigate("/gestor/check");
          recargarPagina();
            // Almacenar el token y el ID del usuario en sessionStorage/ZocoConect/Inicio" 
          sessionStorage.setItem("token", data.token);
        } else if (data.rol === 7) {
            navigate("/ZocoConect/Inicio");
            recargarPagina();
            // Almacenar el token y el ID del usuario en sessionStorage/ZocoConect/Inicio" 
            sessionStorage.setItem("token", data.token);
        } else if (data.rol === 8) {
          navigate("/administracion");
          recargarPagina();
          // Almacenar el token y el ID del usuario en sessionStorage
          sessionStorage.setItem("token", data.token);
        } else if (data.rol === 11) {
          navigate("/cajero/inicio");
          recargarPagina();
          // Almacenar el token y el ID del usuario en sessionStorage
          sessionStorage.setItem("token", data.token);
        }
        else if(data.rol===12){
          navigate("/abmtest/panelinterno");
          recargarPagina();
          // Almacenar el token y el ID del usuario en sessionStorage
          sessionStorage.setItem("token", data.token);
        }
        else if(data.rol===9){
          navigate("/postulante/inicio")
          recargarPagina();
          // Almacenar el token y el ID del usuario en sessionStorage
          sessionStorage.setItem("token", data.token);
        }
         else {
          Swal.fire({
            title: "Revisar Usuario o Contraseña",
            text: "Usuario o Contraseña incorrecta.",
            imageUrl: logo,
            imageWidth: 100,
            imageHeight: 30,
            imageAlt: "Logo",
            confirmButtonText: "Ok",
            timer: 5000,
            allowOutsideClick: true,
            customClass: {
              container: darkMode
                ? "swal2-container--dark"
                : "swal2-container--light",
              confirmButton: "my-swal-button",
            },
          });
          setButtonText("Conectar");
          setIsLoading(false);
          setContador(contador + 1);
        }
      })
      .catch((error) => {});
  };

  // funcion para manejar los caracteres ingresado por el usuario
  const handleInputChange = (e) => {
    const value = e.target.value;
    const maxLength = 11;

    // Permite solo valores numéricos y limita la longitud
    if (!isNaN(value) && value.length <= maxLength) {
      setUsuario(value);
    }
  };

  return (
    <div>
      <div>
        {recuperar ? (
          // RECUPERAR PASSWORD
          <div className="bg-login py-5">
            <div className=" pb-3 text-center ">
              <h6 className="lato-bold fs-24 mb-3">Recuperar contraseña</h6>
              <h6 className="lato-regular fs-16 text-center mb-0">
                Ingresá tu email y te enviaremos un <br /> correo para
                cambiar tu contraseña
              </h6>
            </div>
            <div>
              <Form onSubmit={handleSubmit(onSubmit2)}>
                <article className="d-flex justify-content-center ">
                  <div>
                    <div className="d-flex  justify-content-center align-items-center input-formulario-user ">
                      <div>
                        <Form.Text>
                          <FontAwesomeIcon
                            className="fs-18"
                            icon={faEnvelope}
                          />
                        </Form.Text>
                      </div>
                      <div>
                        <Form.Group
                          className="d-flex justify-content-center "
                          controlId="formBasicEmail"
                        >
                          <Form.Control
                            className="border-0 input-transparente"
                            type="email"
                            placeholder="Email"
                            {...register("email", {
                              required: "El email es un dato obligatorio",
                              pattern: {
                                value:
                                  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
                                message:
                                  "El email debe cumplir con un formato valido como el siguiente mail@mail.com ",
                              },
                            })}
                          />
                        </Form.Group>
                      </div>
                      <div className="ocultar-div">
                        <Button
                          className="border-0 "
                          onMouseDown={handleMouseDown}
                          variant="link"
                        >
                          {showPassword ? (
                            <FontAwesomeIcon icon={faEye} />
                          ) : (
                            <FontAwesomeIcon icon={faEyeSlash} />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
                <Form.Text className="text-danger d-flex justify-content-center">
                  {errors.email?.message}
                </Form.Text>
                <div className="d-flex justify-content-center">
                  <Button
                    className="my-3 btn-login lato-bold border-0"
                    type="submit"
                  >
                    Enviar
                  </Button>
                </div>
              </Form>
            </div>
            <div className="text-center d-md-block d-none">
              <div className="d-flex justify-content-center">
                <h6 className="fs-16 mb-0">
                  {" "}
                  ¿Olvidaste tu correo electrónico?{" "}
                </h6>
              </div>
              <div>
                <h6>
                  <a
                    className="enlace lato-bold text-decoration-none fs-16"
                    href="https://api.whatsapp.com/send/?phone=543813545650&text=Buenos%2Fas+d%C3%ADas%2Ftardes%2Cmi+CUIT+es%3A++tengo+una+consulta+sobre&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Tocá aquí para contactarnos.
                  </a>
                </h6>
                <div className="d-flex justify-content-center">
                  <button
                    className="regresar border-0 "
                    onClick={() => setRecuperar(!recuperar)}
                  >
                    <FontAwesomeIcon className="me-1" icon={faCaretLeft} />
                    Regresar
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center d-block d-md-none">
              <div className="d-flex  justify-content-center">
                <h6 className="fs-16 mb-0">
                  {" "}
                  ¿Olvidaste tu correo electrónico?{" "}
                </h6>
              </div>
              <div>
                <h6>
                  <a
                    className="enlace lato-bold fs-16 text-decoration-none"
                    href="https://api.whatsapp.com/send/?phone=543813545650&text=Buenos%2Fas+d%C3%ADas%2Ftardes%2Cmi+CUIT+es%3A++tengo+una+consulta+sobre&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Tocá aquí para contactarnos.
                  </a>
                </h6>
                <div className="d-flex justify-content-center">
                  <button
                    className="regresar border-0 "
                    onClick={() => setRecuperar(!recuperar)}
                  >
                    <FontAwesomeIcon className="me-1" icon={faCaretLeft} />
                    Regresar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // LOGIN
          <div className="bg-login  s py-5">
            <div className=" pb-3 text-center ">
              <h6 className="lato-bold fs-24 ">Inicio de sesión</h6>
            </div>
            <div>
              <Form onSubmit={handleSubmit(onSubmit2)}>
                <article className="d-flex justify-content-center my-3">
                  <div>
                    <div className="d-flex  justify-content-center align-items-center input-formulario-user ">
                      <div>
                        <Form.Text>
                          <FontAwesomeIcon className="fs-18" icon={faUser} />
                        </Form.Text>
                      </div>
                      <div>
                        <Form.Group
                          className="d-flex justify-content-center "
                          controlId="formBasicEmail"
                        >
                          <Form.Control
                            className="border-0 input-transparente"
                            maxLength={11}
                            type="text" // Se mantiene como texto para evitar problemas de compatibilidad
                            pattern="[0-9]*" // Asegura que solo se puedan ingresar números
                            inputMode="numeric" // Muestra el teclado numérico en dispositivos móviles
                            required
                            placeholder="Usuario"
                            value={usuario}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="ocultar-div">
                        <Button
                          className="border-0 "
                          onMouseDown={handleMouseDown}
                          variant="link"
                        >
                          {showPassword ? (
                            <FontAwesomeIcon icon={faEye} />
                          ) : (
                            <FontAwesomeIcon icon={faEyeSlash} />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>

                <article className="d-flex justify-content-center my-2">
                  <div>
                    <div className="d-flex  justify-content-center align-items-center input-formulario-user ">
                      <div>
                        <Form.Text className="">
                          <FontAwesomeIcon className="fs-18" icon={faLock} />
                        </Form.Text>
                      </div>
                      <div>
                        <Form.Group
                          className="d-flex justify-content-center "
                          controlId="formBasicPass"
                        >
                          <Form.Control
                            className=" border-0 input-transparente"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            maxLength={20}
                          />
                        </Form.Group>
                      </div>
                      <div>
                        <Button
                          className="border-0 "
                          onMouseDown={handleMouseDown}
                          variant="link"
                        >
                          {showPassword ? (
                            <FontAwesomeIcon icon={faEye} />
                          ) : (
                            <FontAwesomeIcon icon={faEyeSlash} />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
                <Form.Text className="text-danger d-flex justify-content-center">
                  {errors.password?.message}
                </Form.Text>
                <div className="d-flex justify-content-center">
                  <Button
                    disabled={contador === 4} // Deshabilitar si contador es 4
                    onClick={() => {
                      if (usuario && password) {
                        setIsLoading(true); // Cambiar al estado de carga si los campos no están vacíos
                        setButtonText("Conectar"); // Restablecer el texto del botón
                      } else {
                        // Realizar acciones si los campos están vacíos
                        // alert("Por favor, ingresa usuario y contraseña");
                      }
                    }}
                    className={
                      contador === 4
                        ? "my-4 btn-login-disabled lato-bold border-0"
                        : "my-4 btn-login lato-bold border-0"
                    }
                    type="submit"
                  >
                    {isLoading ? ( // Mostrar "Loading..." si isLoading es true, de lo contrario, el estado del botón
                      <>
                        Loading...
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      </>
                    ) : (
                      buttonText // Mostrar el texto del botón dinámicamente
                    )}
                  </Button>
                </div>
                {contador === 1 && (
                  <div className="d-flex justify-content-center text-center">
                    <h6 className="text-danger  fs-16-a-14 mx-5">
                      Te quedan 3 intentos más antes de restringir el acceso por
                      motivos de seguridad.
                    </h6>
                  </div>
                )}

                {contador === 2 && (
                  <div className="d-flex justify-content-center text-center">
                    <h6 className="text-danger  fs-16-a-14 mx-5">
                      Te quedan 2 intentos más antes de restringir el acceso por
                      motivos de seguridad.
                    </h6>
                  </div>
                )}

                {contador === 3 && (
                  <div className="d-flex justify-content-center text-center">
                    <h6 className="text-danger  fs-16-a-14 mx-5">
                      Te queda 1 intento más antes de restringir el acceso por
                      motivos de seguridad.
                    </h6>
                  </div>
                )}
                {contador === 4 && (
                  <div className="d-flex justify-content-center text-center">
                    <h6 className="text-danger  fs-16-a-14 mx-5">
                      LLegaste al límite de intentos posible. Te hemos
                      restringido el acceso por motivos de seguridad. Por favor
                      comunicate con el departamento de Liquidaciones para
                      resolver el problema.
                    </h6>
                  </div>
                )}
              </Form>
            </div>
            <div className="text-center d-md-block d-none">
              <div className="d-flex justify-content-center">
                <h6 className="fs-16 mb-1 me-2"> ¿Problemas para ingresar? </h6>
                <a
                  className="enlace lato-bold text-decoration-none fs-16"
                  href="https://api.whatsapp.com/send/?phone=543813545650&text=Buenos%2Fas+d%C3%ADas%2Ftardes%2Cmi+CUIT+es%3A++tengo+una+consulta+sobre&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noreferrer"
                >
                  Tocá aquí.
                </a>
              </div>
            </div>
            <div className="text-center d-block d-md-none">
              <div className="d-flex justify-content-center">
                <h6 className="fs-16 mb-1">
                  {" "}
                  ¿Problemas para ingresar?{" "}
                  <button
                    className="border-0 enlace lato-bold"
                    onClick={() => {
                      setRecuperar(!recuperar);
                      handleLimpiarFormulario();
                    }}
                  >
                    Tocá aquí.
                  </button>
                </h6>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContenidoLogin;
