using BLL.InterfacesZoco;
using DAL.DBContext;
using DAL.Interfaces;
using Entity.Zoco;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class AltaService : IAltaService
    {
        private readonly IGenericRepository<Alta> _repoALta;
        private readonly IGenericRepository<Usuario> _repoUsuario;
        private readonly zocowebContext _context;

        public AltaService(IGenericRepository<Alta> alta, IGenericRepository<Usuario> repoUsuarios, zocowebContext context)
        {
            _repoALta = alta;
            _repoUsuario = repoUsuarios;
            _context = context;
        }

        public async Task<Alta> Editar(Alta entidad)
        {
            if (entidad == null)
            {
                throw new ArgumentNullException(nameof(entidad));
            }

            var alta = await _repoALta.Obtener(a => a.Id == entidad.Id);
            if (alta == null)
            {
                throw new KeyNotFoundException("La actividad no fue encontrada.");
            }

            alta.Estado = entidad.Estado;
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
            alta.Altas = entidad.Altas;
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
            alta.Actividad = entidad.Actividad;
            alta.Exento = entidad.Exento;
            alta.EstadoRentas = entidad.EstadoRentas;
            alta.Actividad2 = entidad.Actividad2;
            alta.DomicilioFiscal = entidad.DomicilioFiscal;
            alta.Provincia3 = entidad.Provincia3;
            alta.Alicuota = entidad.Alicuota;
            alta.CodActividadRentas = entidad.CodActividadRentas;
            alta.ActividadRentas = entidad.ActividadRentas;

            await _repoALta.Editar(alta);
            return alta;
        }
        public async Task<Alta> EditarparaAlta(Alta entidad, int id)
        {
            if (entidad == null)
            {
                throw new ArgumentNullException(nameof(entidad));
            }

            var alta = await _repoALta.Obtener(a => a.Id == id);
            if (alta == null)
            {
                throw new KeyNotFoundException("La actividad no fue encontrada.");
            }
            entidad.Estado = alta.Estado;
            entidad.NDeComercio = alta.NDeComercio;
            entidad.NroLocal = alta.NroLocal;
            entidad.Legajo = alta.Legajo;
            entidad.NombreDeFantasia = alta.NombreDeFantasia;
            entidad.Domicilio = alta.Domicilio;
            entidad.Localidad = alta.Localidad;
            entidad.CodigoPostal = alta.CodigoPostal;
            entidad.Telefono = alta.Telefono;
            entidad.LinkDePago = alta.LinkDePago;
            entidad.Rubro = alta.Rubro;
            entidad.RubroSecundario = alta.RubroSecundario;
            entidad.AltaAhora12 = alta.AltaAhora12;
          //  entidad.FechaDeAlta = alta.FechaDeAlta;
            entidad.FechaDeBaja = null;
            entidad.NombreDelAsesor = alta.NombreDelAsesor;
            entidad.Titular = alta.Titular;
            entidad.CuitCuil = alta.CuitCuil;
            entidad.Banco = alta.Banco;
            entidad.TipoDeCuenta = alta.TipoDeCuenta;
            entidad.CbuCvu = alta.CbuCvu;
            entidad.NDeCuenta = alta.NDeCuenta;
            entidad.LetraCbu = alta.LetraCbu;
            entidad.LargoCbu = alta.LargoCbu;
            entidad.Alias = alta.Alias;
            entidad.Mail = alta.Mail;
            entidad.RazonSocial = alta.RazonSocial;
            entidad.CuitRazonSocial = alta.CuitRazonSocial;
            entidad.EstadoAfip = alta.EstadoAfip;
            entidad.Actividad = alta.Actividad;
            entidad.Exento = alta.Exento;
            entidad.EstadoRentas = alta.EstadoRentas;
            entidad.Actividad2 = alta.Actividad2;
            entidad.DomicilioFiscal = alta.DomicilioFiscal;
            entidad.CodActividadRentas = alta.CodActividadRentas;
            entidad.ActividadRentas = alta.ActividadRentas;

            await _repoALta.Editar(entidad);
            return alta;
        }
        public async Task<bool> EditarSimple(int altaId, DateTime FechaBaja)
        {
            try
            {
                var alta = await _context.Set<Alta>().FindAsync(altaId);
                if (alta == null)
                {
                    throw new KeyNotFoundException("La actividad no fue encontrada.");
                }

                alta.Estado = "BAJA";
                alta.NDeComercio = null;
                alta.NroLocal = null;
                alta.Legajo = null;
                alta.NombreDeFantasia = "ZOCO";
                alta.Domicilio = null;
                alta.Localidad = null;
                alta.CodigoPostal = null;
                alta.Telefono = null;
                alta.LinkDePago = null;
                alta.Rubro = null;
                alta.RubroSecundario  = null;
                alta.AltaAhora12 = null;
            
                // Cuando estés asignando la fecha de alta en base a la fecha de baja:
                alta.FechaDeAlta = FechaBaja.AddDays(1);
                alta.FechaDeBaja = null;

                alta.TipoDeBaja = null;
                alta.ProgramacionBaja = null;
                alta.DiasParaAlta = null;
                alta.NombreDelAsesor = null;
                alta.Titular=null;
                alta.CuitCuil = null;
                alta.Banco = null;
                alta.TipoDeCuenta = null;
                alta.CbuCvu = null;
                alta.NDeCuenta = null;
                alta.LetraCbu = null;
                alta.LargoCbu = null;
                alta.Alias = null;
                alta.Mail = null;
                alta.RazonSocial = null;
                alta.CuitRazonSocial = null;
                alta.EstadoAfip = null;
                alta.CodActividad = null;
                alta.Actividad = null;
                alta.Exento = null;
                alta.EstadoRentas   = null;
                alta.Actividad2 = null;
                alta.DomicilioFiscal = null;
           
                alta.FechaDeCargaAbm = null;
                alta.FechaDeModificacion = null;
           
          
                alta.Altas = null;
                alta.Baja = null;
            
                alta.CodActividadRentas = null;
                alta.ActividadRentas = null;
                _context.Entry(alta).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Manejo de errores
                throw new Exception("Error al actualizar el estado", ex);
            }
        }
        public async Task<bool> EditarSimpleServicioTecnico(int altaId)
        {
            try
            {
                var alta = await _context.Set<Alta>().FindAsync(altaId);
                if (alta == null)
                {
                    throw new KeyNotFoundException("La actividad no fue encontrada.");
                }

                alta.Estado = "SERVICIO.TECNICO";
                alta.NDeComercio = null;
                alta.NroLocal = null;
                alta.Legajo = null;
                alta.NombreDeFantasia = "ZOCO";
                alta.Domicilio = null;
                alta.Localidad = null;
                alta.CodigoPostal = null;
                alta.Telefono = null;
                alta.LinkDePago = null;
                alta.Rubro = null;
                alta.RubroSecundario = null;
                alta.AltaAhora12 = null;
        

                alta.TipoDeBaja = null;
                alta.ProgramacionBaja = null;
                alta.DiasParaAlta = null;
                alta.NombreDelAsesor = null;
                alta.Titular = null;
                alta.CuitCuil = null;
                alta.Banco = null;
                alta.TipoDeCuenta = null;
                alta.CbuCvu = null;
                alta.NDeCuenta = null;
                alta.LetraCbu = null;
                alta.LargoCbu = null;
                alta.Alias = null;
                alta.Mail = null;
                alta.RazonSocial = null;
                alta.CuitRazonSocial = null;
                alta.EstadoAfip = null;
                alta.CodActividad = null;
                alta.Actividad = null;
                alta.Exento = null;
                alta.EstadoRentas = null;
                alta.Actividad2 = null;
                alta.DomicilioFiscal = null;
             
                alta.Altas = null;
                alta.Baja = null;
          
                alta.CodActividadRentas = null;
                alta.ActividadRentas = null;
                _context.Entry(alta).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Manejo de errores
                throw new Exception("Error al actualizar el estado", ex);
            }
        }
        public async Task<Alta> EditarNull(int altaId)
        {
            // Obtener la entidad Alta por su ID
            var alta = await _repoALta.Obtener(a => a.Id == altaId);
            if (alta == null)
            {
                throw new Exception("Alta no encontrada");
            }

            // Cambiar el estado a "BAJA"
            alta.Estado = "BAJA";

            // Editar la entidad
            var result = await _repoALta.Editar(alta);
            if (!result)
            {
                throw new Exception("No se pudo actualizar el estado");
            }

            return alta;
        }

        public async Task<Alta> NuevaALta(Alta Alta)
        {
            try
            {
                return await _repoALta.Crear(Alta);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el Alta", ex);
            }

        }

        public async Task<List<Alta>> ObtenerCRM()
        {
            try
            {
                var documentos = await _repoALta.Consultar();
                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los documentos de AFIP", ex);
            }
        }

        public async Task<Alta> ObtenerPorNroTerminal(string? NumeroTerminal)
        {
            var nrcomercio = Convert.ToDouble(NumeroTerminal);
            Alta Alta = await _repoALta.Obtener(u => u.NDeTerminal == nrcomercio);

            if (Alta == null)
            {
                return null;
            }

            return Alta;
        }

        public async Task<bool> TerminalBaja(string? NumeroTerminal)
        {
            if (NumeroTerminal == null)
            {
                return false;
            }
            var numeroterminal = Convert.ToDouble(NumeroTerminal);
            var query = await _repoALta.Consultar(d => d.NDeTerminal == numeroterminal && d.Estado != "ALTA");

            var Terminal = await query.ToListAsync();
            return Terminal.Any();
        }

        public async Task<Alta> EditarAltaModificar(Alta entidad)
        {
            if (entidad == null)
            {
                throw new ArgumentNullException(nameof(entidad));
            }

            var alta = await _repoALta.Obtener(a => a.Id == entidad.Id);
            if (alta == null)
            {
                throw new KeyNotFoundException("La actividad no fue encontrada.");
            }

            alta.NombreDeFantasia = entidad.NombreDeFantasia;
            alta.Domicilio = entidad.Domicilio;
            alta.Provincia = entidad.Provincia;
            alta.Localidad = entidad.Localidad;
            alta.CodigoPostal = entidad.CodigoPostal;
            alta.Banco = entidad.Banco;
            alta.CbuCvu= entidad.CbuCvu;
            alta.Alias = entidad.Alias;
            alta.Mail = entidad.Mail;
            alta.EstadoAfip = entidad.EstadoAfip;
            alta.Exento = alta.Exento;
            alta.EstadoRentas = alta.EstadoRentas;

            await _repoALta.Editar(alta);
            return alta;
        }

        public async Task<bool> EditarSimpleAltaClover(int altaId, double numeroterminal)
        {
            try
            {
                var alta = await _context.Set<Alta>().FindAsync(altaId);
                if (alta == null)
                {
                    throw new KeyNotFoundException("La actividad no fue encontrada.");
                }
                alta.NDeTerminal = numeroterminal;
                _context.Entry(alta).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Manejo de errores
                throw new Exception("Error al actualizar el estado", ex);
            }
        }

      

        public async Task EditarAbm(Alta entidad)
        {
            if (entidad == null)
            {
                throw new ArgumentNullException(nameof(entidad));
            }

            var alta = await _repoALta.Obtener(a => a.Id == entidad.Id);
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
            alta.Baja = entidad.Baja;
            alta.IngresoASstt = entidad.IngresoASstt;
            alta.EgresoDeSstt = entidad.EgresoDeSstt;
            alta.MotivoSstt = entidad.MotivoSstt;
            alta._2IngresoASstt = entidad._2IngresoASstt;
            alta._2EgresoDeSstt = entidad._2EgresoDeSstt;
            alta._2MotivoSstt = entidad._2MotivoSstt;
            alta.FechaSsttMes = entidad.FechaSsttMes;
            alta.CodActividadRentas = entidad.CodActividadRentas;
            alta.ActividadRentas = entidad.ActividadRentas;

            await _repoALta.Editar(alta);
        }

        public async Task<List<string>> ObtenerAliadosCRM()
        {
            try
            {
                var documentos = await _repoALta.Consultar();
                // Seleccionar solo los nombres de fantasía y ordenarlos alfabéticamente
                var nombresDeFantasia = documentos
                    .Select(d => d.NombreDeFantasia)
                    .OrderBy(nombre => nombre) // Ordenar alfabéticamente
                    .ToList();

                return nombresDeFantasia;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los nombres de fantasía de AFIP", ex);
            }
        }

        public async Task<Alta> ObtenerPorId(int Idalta)
        {
            IQueryable<Alta> query = await _repoALta.Consultar(u => u.Id == Idalta);

            Alta resultado = query.FirstOrDefault();

            return resultado;
        }

        public async Task<bool> EditarDestinoUOrigen(string tipo, string nuevaProvinciaODestino, int altaId)
        {
            // Obtener la alta correspondiente por Id
            var alta = await _context.Altas.FirstOrDefaultAsync(a => a.Id == altaId);
            if (alta == null)
            {
                return false;
            }

            // Modificar el campo dependiendo del tipo
            if (tipo == "Origen")
            {
                alta.OrigenDeLaTerminal = nuevaProvinciaODestino;
            }
            else if (tipo == "Destino")
            {
                alta.DestinoDeLaTerminal = nuevaProvinciaODestino;
            }
            else
            {
                // Si el tipo no es válido, retornamos false
                return false;
            }

            // Guardar los cambios en la base de datos
            _context.Entry(alta).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<string>> ObtenerComerciosCRM()
        {
            try
            {
                var documentos = await _repoALta.Consultar();

                // Convertir a IEnumerable para que la concatenación ocurra en memoria
                var nombresDeFantasia = documentos
                    .AsEnumerable() // Cambiar a evaluación en memoria
                    .Select(d => $"{d.NombreDeFantasia} {d.NDeTerminal}") // Concatenar nombre de fantasía y número de terminal
                    .OrderBy(nombre => nombre) // Ordenar alfabéticamente
                    .ToList();

                return nombresDeFantasia;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los nombres de fantasía ", ex);
            }
        }

        public async Task<List<Alta>> ObtenerTerminalesPorCuit(string cuit)
        {
            // Convertir el cuit a double ya que en tu modelo el campo es de tipo double
            if (double.TryParse(cuit, out double cuitDouble))
            {
                // Utilizar el método Consultar para obtener todas las terminales con el Cuit dado
                var terminales = await _repoALta.Consultar(a => a.CuitCuil == cuitDouble);
                return terminales.ToList();
            }
            else
            {
                throw new ArgumentException("El formato del CUIT proporcionado no es válido.");
            }
        }

    }
}
