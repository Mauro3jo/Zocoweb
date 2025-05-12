// import hooks 
import { useContext } from "react";

// import context 
import { DatosInicioContext } from "../../context/DatosInicioContext";

// import componentes 
import ContenidoLogin from "../../components/ContenidoLogin";
import FooterLogin from "../../components/FooterLogin";

const Login = () => {
  // context para extraer del datos inicio context 
  const {
    onSubmit,
    datosMandados,
    setDatosMandados,
    setIsLoading,
    setButtonText,
    isLoading,
    buttonTex,
  } = useContext(DatosInicioContext);
  
  return (
    <section translate="no" className="bg-view-login ">
      <article className="">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <ContenidoLogin
            onSubmit={onSubmit}
            datosMandados={datosMandados}
            setDatosMandados={setDatosMandados}
            setIsLoading={setIsLoading}
            setButtonText={setButtonText}
            isLoading={isLoading}
            buttonTex={buttonTex}
          />
        </div>
      </article>
      <div className="d-flex justify-content-center">
        <FooterLogin />
      </div>
    </section>
  );
};

export default Login;
