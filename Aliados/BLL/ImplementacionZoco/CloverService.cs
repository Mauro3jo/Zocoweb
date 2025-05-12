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
    public class CloverService : ICloverService
    {
        private readonly IGenericRepository<Clover> _repoClover;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public CloverService(IGenericRepository<Clover> repoclover, IGenericRepository<Usuario> repoUsuarios)
        {
            _repoClover = repoclover;
            _repoUsuario = repoUsuarios;

        }
        public async Task<Clover> CrearNuevaClover(Clover Clover)
        {

            try
            {
                return await _repoClover.Crear(Clover);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear la clover", ex);
            }
        }

        public async Task<List<Clover>> ListarClover()
        {
            try
            {
                var documentos = await _repoClover.Consultar();

                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos las Clover", ex);
            }
        }
    }
}
