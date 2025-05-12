using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class FormularioBajaService : IFormularioBajaService
    {
        private readonly IGenericRepository<FormularioBaja> _repoFormularioBaja;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public FormularioBajaService(IGenericRepository<FormularioBaja> FormularioBaja, IGenericRepository<Usuario> repoUsuarios)
        {
            _repoFormularioBaja = FormularioBaja;
            _repoUsuario = repoUsuarios;
        }
        public async Task<FormularioBaja> CrearFormularioBajaAsync(FormularioBaja formularioBaja)
        {
            if (formularioBaja == null)
                throw new ArgumentNullException(nameof(formularioBaja));

            return await _repoFormularioBaja.Crear(formularioBaja);
        }

        public async Task<FormularioBaja> EditarFormularioBajaAsync(FormularioBaja formularioBaja)
        {

            if (formularioBaja == null)
                throw new ArgumentNullException(nameof(formularioBaja));

            var resultado = await _repoFormularioBaja.Editar(formularioBaja);
            if (!resultado)
            {
                throw new Exception("La edición del formulario no fue exitosa.");
            }

            return formularioBaja; 
        }

        public async Task<FormularioBaja> ListarFormulariosBajaAsyncporId(int id)
        {
            var formularioBaja = await _repoFormularioBaja.Obtener(b => b.Id == id);

            return formularioBaja;
        }

        public async Task<List<FormularioBaja>> ListarFormulariosBajaAsync()
        {

            IQueryable<FormularioBaja> query = await _repoFormularioBaja.Consultar();
            return query.ToList();
        }

        public async Task<FormularioBaja> EditarFueUtilizado(int id)
        {
            var formularioAlta = await _repoFormularioBaja.Obtener(b => b.Id == id);
            formularioAlta.FueUtilizado = true;

            var resultado = await _repoFormularioBaja.Editar(formularioAlta);
            return formularioAlta;
        }
    }
}
