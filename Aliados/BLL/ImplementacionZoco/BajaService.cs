using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class BajaService : IBajaService
    {
        private readonly IGenericRepository<Baja> _repoBaja;
        private readonly IGenericRepository<Alta> _repoAlta;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public BajaService(IGenericRepository<Baja> Baja, IGenericRepository<Usuario> repoUsuarios, IGenericRepository<Alta> repoAlta)
        {
            _repoBaja = Baja;
            _repoUsuario = repoUsuarios;
            _repoAlta = repoAlta;
        }

        public async Task EditarAbm(Baja entidad)
        {
            if (entidad == null)
            {
                throw new ArgumentNullException(nameof(entidad));
            }

            var alta = await _repoBaja.Obtener(a => a.Id == entidad.Id);
            if (alta == null)
            {
                throw new KeyNotFoundException("La actividad no fue encontrada.");
            }

            // Asignar todos los campos de la entidad recibida a la entidad obtenida
            alta.Estado = entidad.Estado;
            alta.NDeTerminal = entidad.NDeTerminal;
            alta.NDeComercio = entidad.NDeComercio;
            alta.NroLocal = entidad.NroLocal;
            alta.Legajo = entidad.Legajo;
            alta.NombreDeFantasia = entidad.NombreDeFantasia;
            alta.Domicilio = entidad.Domicilio;
            alta.Localidad = entidad.Localidad;
            alta.CodigoPostal = entidad.CodigoPostal;
            alta.Telefono = entidad.Telefono;
            alta.LinkDePago = entidad.LinkDePago;
            alta.Rubro = entidad.Rubro;
            alta.RubroSecundario = entidad.RubroSecundario;
            alta.AltaAhora12 = entidad.AltaAhora12;
            alta.FechaDeAlta = entidad.FechaDeAlta;
            alta.FechaDeBaja = entidad.FechaDeBaja;
            alta.TipoDeBaja = entidad.TipoDeBaja;
            alta.ProgramacionBaja = entidad.ProgramacionBaja;
            alta.DiasParaAlta = entidad.DiasParaAlta;
            alta.Provincia = entidad.Provincia;
            alta.NombreDelAsesor = entidad.NombreDelAsesor;
            alta.Titular = entidad.Titular;
            alta.CuitCuil = entidad.CuitCuil;
            alta.Banco = entidad.Banco;
            alta.TipoDeCuenta = entidad.TipoDeCuenta;
            alta.CbuCvu = entidad.CbuCvu;
            alta.NDeCuenta = entidad.NDeCuenta;
            alta.LetraCbu = entidad.LetraCbu;
            alta.LargoCbu = entidad.LargoCbu;
            alta.Alias = entidad.Alias;
            alta.Mail = entidad.Mail;
            alta.RazonSocial = entidad.RazonSocial;
            alta.CuitRazonSocial = entidad.CuitRazonSocial;
            alta.EstadoAfip = entidad.EstadoAfip;
            alta.CodActividad = entidad.CodActividad;
            alta.Actividad = entidad.Actividad;
            alta.Exento = entidad.Exento;
            alta.EstadoRentas = entidad.EstadoRentas;
            alta.Actividad2 = entidad.Actividad2;
            alta.DomicilioFiscal = entidad.DomicilioFiscal;
            alta.Provincia3 = entidad.Provincia3;
            alta.Alicuota = entidad.Alicuota;
            alta.Observacion = entidad.Observacion;
            alta.OrigenDeLaTerminal = entidad.OrigenDeLaTerminal;
            alta.DestinoDeLaTerminal = entidad.DestinoDeLaTerminal;
            alta.ReUbicacion = entidad.ReUbicacion;
            alta.DiasSinAltaDeTerminal = entidad.DiasSinAltaDeTerminal;
            alta.AutorizadoPorTitular = entidad.AutorizadoPorTitular;
            alta.FechaDeCargaAbm = entidad.FechaDeCargaAbm;
            alta.FechaDeModificacion = entidad.FechaDeModificacion;
            alta.AbmObservacionesDeCarga = entidad.AbmObservacionesDeCarga;
            alta.ParaInforme = entidad.ParaInforme;
            alta.EnPausa = entidad.EnPausa;
            alta.FechaDeInicioDePausa = entidad.FechaDeInicioDePausa;
            alta.FechaDeFinalizacionDePausa = entidad.FechaDeFinalizacionDePausa;
            alta.Backup = entidad.Backup;
            alta.Altas = entidad.Altas;
            alta.Baja1 = entidad.Baja1;
            alta.IngresoASstt = entidad.IngresoASstt;
            alta.EgresoDeSstt = entidad.EgresoDeSstt;
            alta.MotivoSstt = entidad.MotivoSstt;
            alta._2IngresoASstt = entidad._2IngresoASstt;
            alta._2EgresoDeSstt = entidad._2EgresoDeSstt;
            alta._2MotivoSstt = entidad._2MotivoSstt;
            alta.FechaSsttMes = entidad.FechaSsttMes;
            alta.CodActividadRentas = entidad.CodActividadRentas;
            alta.ActividadRentas = entidad.ActividadRentas;

            await _repoBaja.Editar(alta);
        }

        public async Task<Baja> NuevaALta(Baja Baja)
        {
            try
            {
                return await _repoBaja.Crear(Baja);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el Alta", ex);
            }
        }

        public async Task<List<Baja>> ObtenerCRMBaja()
        {
            try
            {
                var documentos = await _repoBaja.Consultar();

                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los documentos de AFIP", ex);
            }
        }

        public async Task<Baja> ObtenerPorid(int? id)
        {
            Baja Alta = await _repoBaja.Obtener(u => u.Id == id);

            if (Alta == null)
            {
                return null;
            }

            return Alta;
        }

        public async Task<Baja> ObtenerPorNroTerminal(string? NumeroTerminal)
        {
            Baja Alta = await _repoBaja.Obtener(u => u.NDeTerminal == NumeroTerminal);

            if (Alta == null)
            {
                return null;
            }

            return Alta;
        }


        public async Task<bool> TerminalAlta(string? NumeroTerminal)
        {
            if (NumeroTerminal == null)
            {
                return false;
            }
            var numeroterminal = Convert.ToDouble(NumeroTerminal);
            var query = await _repoAlta.Consultar(d => d.NDeTerminal == numeroterminal && d.Estado != "BAJA");

            var Terminal = await query.ToListAsync();

            return Terminal.Any();
        }
    }
}
