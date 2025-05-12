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
    public class FormularioAltaService : IFormularioAltaService
    {
        private readonly IGenericRepository<FormularioAlta> _repoFormularioAlta;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public FormularioAltaService(IGenericRepository<FormularioAlta> FormularioAlta, IGenericRepository<Usuario> repoUsuarios)
        {
            _repoFormularioAlta = FormularioAlta;
            _repoUsuario = repoUsuarios;
        }
        public async Task<FormularioAlta> CrearFormularioAltaAsync(FormularioAlta formularioAlta)
        {

            if (formularioAlta == null)
                throw new ArgumentNullException(nameof(formularioAlta));

            return await _repoFormularioAlta.Crear(formularioAlta);
        }

        public async Task<FormularioAlta> EditarFormularioAltaAsync(FormularioAlta formularioAlta)
        {
            if (formularioAlta == null)
                throw new ArgumentNullException(nameof(formularioAlta));

            var resultado = await _repoFormularioAlta.Editar(formularioAlta);
            if (!resultado)
            {
                throw new Exception("La edición del formulario no fue exitosa.");
            }

            return formularioAlta;  
        }

        public async Task<FormularioAlta> EditarFueUtilizado(int id)
        {
            var formularioAlta = await _repoFormularioAlta.Obtener(b => b.Id == id);
            formularioAlta.FueUtilizado = true;

            var resultado = await _repoFormularioAlta.Editar(formularioAlta);
          return formularioAlta;
        }

        public async Task<FormularioAlta> ListarFormulariosAltaAsyncId(int id)
        {
            var formularioAlta = await _repoFormularioAlta.Obtener(b => b.Id == id);

            return formularioAlta;
        }

        public async Task<List<FormularioAlta>> ListarFormulariosAltasAsync()
        {

            IQueryable<FormularioAlta> query = await _repoFormularioAlta.Consultar();
            return query.ToList();
        }
    }
}
