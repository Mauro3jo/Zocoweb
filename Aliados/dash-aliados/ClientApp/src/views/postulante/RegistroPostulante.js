import React from 'react'
import FooterLogin from "../../components/FooterLogin";
import ContenidoRegistro from '../../components/postulantes/ContenidoRegistro';

const RegistroPostulante = () => {
  return (
      <section translate="no" className="bg-view-registro ">
        <article className="">
            <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            
          }}>
            <ContenidoRegistro/>
            </div>
            
        </article>
      {/*   <div className="d-flex justify-content-center">*/}
      {/*  <FooterLogin />*/}
      {/*</div> */}

    </section>
  )
}

export default RegistroPostulante