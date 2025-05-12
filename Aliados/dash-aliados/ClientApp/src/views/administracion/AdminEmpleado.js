import React from "react";
import BienvenidoAdmin from "../../components/administracion/BienvenidoAdmin";
import BlanqueoEmpleados from "../../components/administracion/BlanqueoEmpleados";
import Footer from "../../components/Footer";
import TituloPagina from "../../components/TituloPagina";

const AdminEmpleado = () => {
  return (
    <div className="d-flex flex-column min-vh-100" translate="no">
      <div className="pt-5">
        <BienvenidoAdmin />
      </div>
      <div>
        <TituloPagina title="Blanqueos para empleados" />
      </div>
      <div className="container py-4">
        <BlanqueoEmpleados />
      </div>
      <div className="py-4 mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default AdminEmpleado;
