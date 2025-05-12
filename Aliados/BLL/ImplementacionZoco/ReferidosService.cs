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
    public class ReferidosService : IReferidosService
    {
        private readonly IGenericRepository<Usuario> _repositorioUser;
        private readonly IGenericRepository<ZocoConect> _conectRepository;
        private readonly IGenericRepository<Referido> _repositorioReferido; 

        public ReferidosService(IGenericRepository<Usuario> repositorioUser,  
            IGenericRepository<ZocoConect> conectRepository, IGenericRepository<Referido> repositorioReferido)
        {
            _repositorioUser = repositorioUser;
            _conectRepository = conectRepository;
            _repositorioReferido = repositorioReferido;
        }

        public async Task<Referido> Crear(Referido referidos)
        {
            try
            {
                return await _repositorioReferido.Crear(referidos);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al agregar el referido", ex);
            }
        }

        public async Task EditarParaCierre(Referido referido)
        {
            if (referido == null)
            {
                throw new ArgumentNullException(nameof(referido));
            }

            var referidobase = await _repositorioReferido.Obtener(a => a.Id == referido.Id);
            if (referidobase == null)
            {
                throw new KeyNotFoundException("el referidobase no fue encontrada.");
            }

            referidobase.FechaCierre = referido.FechaCierre;
            referidobase.MontoComision =referido.MontoComision;

            await _repositorioReferido.Editar(referidobase);
            return;
        }

        public async Task<Referido> ObtenerPorId(int Id)
        {
            IQueryable<Referido> query = await _repositorioReferido.Consultar(u => u.Id == Id);

            Referido resultado = query.FirstOrDefault();

            return resultado;
        }

        public async Task<List<Referido>> ObtenerReferidos(int usuarioId)
        {
            IQueryable<Referido> query = await _repositorioReferido.Consultar(u => u.IdZocoConect == usuarioId);

            List<Referido> resultado = await query.ToListAsync();

            return resultado;
        }

        public async Task SubirComprobante(Referido referido)
        {
            if (referido == null)
            {
                throw new ArgumentNullException(nameof(referido));
            }

            var referidobase = await _repositorioReferido.Obtener(a => a.Id == referido.Id);
            if (referidobase == null)
            {
                throw new KeyNotFoundException("el referidobase no fue encontrada.");
            }
            referidobase.Comprobante = referido.Comprobante;
            referidobase.FechaPago = referido.FechaPago;
            referidobase.SePagon = referido.SePagon;
            await _repositorioReferido.Editar(referidobase);
            return;
        }
    }
}
