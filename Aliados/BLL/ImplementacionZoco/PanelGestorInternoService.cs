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
    public class PanelGestorInternoService : IPanelControlInterno
    {
        private readonly IGenericRepository<PanelGestorInterno> _repoPanelGestorInterno;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public PanelGestorInternoService(IGenericRepository<PanelGestorInterno> repopanelinterno, IGenericRepository<Usuario> repoUsuarios)
        {
            _repoPanelGestorInterno = repopanelinterno;
            _repoUsuario = repoUsuarios;

        }

        public async Task<PanelGestorInterno> Crear(PanelGestorInterno nuevodatopanel)
        {
            try
            {
                return await _repoPanelGestorInterno.Crear(nuevodatopanel);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el documento", ex);
            }
        }

        public async Task<DatosMesUsuarioResultado> datosmesusuario(DateTime fecha, int usuarioid)
        {
            var month = fecha.Month;
            var year = fecha.Year;

            // Consulta los datos filtrando por fecha y usuarioid
            var datos = await _repoPanelGestorInterno.Consultar(p => p.IdUser == usuarioid && p.FechaCarga.HasValue && p.FechaCarga.Value.Month == month && p.FechaCarga.Value.Year == year);

            // Obtén la lista de datos
            var listaDatos = await datos.ToListAsync();

            // Inicializa el objeto de resultado
            var resultado = new DatosMesUsuarioResultado
            {
                CantidadTotal = listaDatos.Count,
                CanalAtencionConteo = new Dictionary<string, int>(),
                EstadoConteo = new Dictionary<string, int>()
            };

            // Cuenta los diferentes valores de CanalAtencion y Estado
            foreach (var item in listaDatos)
            {
                if (!string.IsNullOrEmpty(item.CanalAtencion))
                {
                    if (resultado.CanalAtencionConteo.ContainsKey(item.CanalAtencion))
                    {
                        resultado.CanalAtencionConteo[item.CanalAtencion]++;
                    }
                    else
                    {
                        resultado.CanalAtencionConteo[item.CanalAtencion] = 1;
                    }
                }

                if (!string.IsNullOrEmpty(item.Estado))
                {
                    // Normalización del estado para tratar "Cerrado" y "Cerrada" como uno solo
                    var estadoNormalizado = item.Estado.ToLower().Trim();

                    if (estadoNormalizado == "cerrado" || estadoNormalizado == "cerrada")
                    {
                        estadoNormalizado = "cerrado";
                    }

                    if (resultado.EstadoConteo.ContainsKey(estadoNormalizado))
                    {
                        resultado.EstadoConteo[estadoNormalizado]++;
                    }
                    else
                    {
                        resultado.EstadoConteo[estadoNormalizado] = 1;
                    }
                }
            }

            return resultado;
        }

        public async Task<PanelGestorInterno> Editar(PanelGestorInterno nuevoDatoPanel)
        {
            // Buscar si existe el registro por Id
            var panelExistente = await _repoPanelGestorInterno.Obtener(p => p.Id == nuevoDatoPanel.Id);

            if (panelExistente == null)
            {
                throw new Exception("Registro no encontrado");
            }

            // Actualizar los campos
            panelExistente.CanalAtencion = nuevoDatoPanel.CanalAtencion;
            panelExistente.Tipo = nuevoDatoPanel.Tipo;
            panelExistente.Aliado = nuevoDatoPanel.Aliado;
            panelExistente.Motivo = nuevoDatoPanel.Motivo;
            panelExistente.Estado = nuevoDatoPanel.Estado;
            panelExistente.Observaciones = nuevoDatoPanel.Observaciones;
            panelExistente.FechaCarga = nuevoDatoPanel.FechaCarga;
            panelExistente.IdUser = nuevoDatoPanel.IdUser;
            panelExistente.IdAliado = nuevoDatoPanel.IdAliado;
            panelExistente.NroTerminal = nuevoDatoPanel.NroTerminal;

            // Guardar los cambios en el repositorio
            await _repoPanelGestorInterno.Editar(panelExistente);

            return panelExistente;
        }

        public async Task<IEnumerable<int?>> ListaUsuariosDiferentes(DateTime fecha)
        {
            var month = fecha.Month;
            var year = fecha.Year;

            // Espera a que la tarea de consultar se complete y obtén el IQueryable resultante
            var query = await _repoPanelGestorInterno.Consultar(p => p.IdUser.HasValue && p.FechaCarga.HasValue && p.FechaCarga.Value.Month == month && p.FechaCarga.Value.Year == year);

            // Aplica las operaciones de consulta sobre el IQueryable resultante
            var distinctUserIds = query
                .Select(p => p.IdUser)
                .Distinct();

            return await distinctUserIds.ToListAsync();
        }

        public async Task<List<PanelGestorInterno>> Obtenerdatosusuariopordia(int usuarioId, DateTime fecha)
        {
            // Definir el inicio y fin del día
            DateTime inicioDelDia = fecha.Date; // Esto te da la fecha con la hora 00:00:00
            DateTime finDelDia = fecha.Date.AddDays(1).AddTicks(-1); // Esto te da la fecha con la hora 23:59:59

            // Consultar los datos dentro del rango del día, ignorando la hora
            var query = await _repoPanelGestorInterno.Consultar(p =>
                p.FechaCarga >= inicioDelDia &&
                p.FechaCarga <= finDelDia);

            // Ordenar los resultados por la hora de forma descendente para que el más reciente esté primero
            var resultadosOrdenados = query.OrderByDescending(p => p.FechaCarga).ToList();

            return resultadosOrdenados;
        }

        public async Task<List<PanelGestorInterno>> ObtenerPorIdAliado(int IdAliado, DateTime fecha)
        {
            // Calcular el rango de fechas del mes anterior a la fecha proporcionada
            var fechaInicioMesAnterior = new DateTime(fecha.Year, fecha.Month, 1).AddMonths(-1);
            var fechaFinMesAnterior = fechaInicioMesAnterior.AddMonths(1).AddDays(-1);

            // Filtrar los registros en el rango de fechas y por IdAliado
            IQueryable<PanelGestorInterno> query = await _repoPanelGestorInterno.Consultar(u =>
                u.IdAliado == IdAliado &&
                u.FechaCarga >= fechaInicioMesAnterior &&
                u.FechaCarga <= fechaFinMesAnterior);

            // Convertir el resultado en una lista
            List<PanelGestorInterno> resultado = await query.ToListAsync();

            return resultado;
        }



        public async Task<List<PanelGestorInterno>> ObtenerPorusuariId(int usuarioid)
        {
            // Hacemos la consulta usando el filtro por el IdAliado
            IQueryable<PanelGestorInterno> query = await _repoPanelGestorInterno.Consultar(u => u.IdAliado == usuarioid);

            // Obtenemos la lista de resultados
            List<PanelGestorInterno> resultado = await query.ToListAsync();

            return resultado;
        }

        public class DatosMesUsuarioResultado
        {
            public int CantidadTotal { get; set; }
            public Dictionary<string, int> CanalAtencionConteo { get; set; }
            public Dictionary<string, int> EstadoConteo { get; set; }

            public DatosMesUsuarioResultado()
            {
                CanalAtencionConteo = new Dictionary<string, int>();
                EstadoConteo = new Dictionary<string, int>();
            }
        }




    }
}
