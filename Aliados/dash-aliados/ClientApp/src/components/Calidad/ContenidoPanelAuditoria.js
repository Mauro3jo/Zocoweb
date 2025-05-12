import React from 'react'
import FormularioAuditoria from './FormularioAuditoria'
import TablaAuditoria from './TablaAuditoria'
import TituloPagina from '../TituloPagina'

const ContenidoPanelAuditoria = () => {
  return (
    <div className="container">
            <div>
                <FormularioAuditoria />
            </div>
            <div>
                <TituloPagina title="Historial" />
            </div>
            <div>
                <TablaAuditoria/> 
            </div>
        </div>
  )
}

export default ContenidoPanelAuditoria