import React from 'react'
import ContenidoInicioVacio from '../../components/ZocoConect/ContenidoInicioVacio'
import ContenidoInicioCelularVacio from '../../components/ZocoConect/ContenidoInicioCelularVacio'
import Footer from '../../components/Footer'
import BienvenidaZocoConect from '../../components/ZocoConect/BienvenidoPanelZocoConect';


const PruebaVacios = () => {
  return (
    <>
    <div className='pt-5'>
                <BienvenidaZocoConect />
            </div>
    <div className="py-4 d-xl-block d-none">
      <ContenidoInicioVacio/>
    </div>
    <div className="py-4 d-block d-xl-none">
      <ContenidoInicioCelularVacio/>
    </div>
    <div className='pt-5'>
                <Footer />
            </div>
  </>
  )
}

export default PruebaVacios