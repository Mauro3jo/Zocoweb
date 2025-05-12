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
    public class FormularioModificacionService : IFormularioModificacionService
    {
        private readonly IGenericRepository<FormularioModificacione> _repoFormularioModificacione;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public FormularioModificacionService(IGenericRepository<FormularioModificacione> FormularioBaja, IGenericRepository<Usuario> repoUsuarios)
        {
            _repoFormularioModificacione = FormularioBaja;
            _repoUsuario = repoUsuarios;
        }
        public async Task<FormularioModificacione> CrearFormularioModificacionesAsync(FormularioModificacione formularioModificacione)
        {
            if (formularioModificacione == null)
                throw new ArgumentNullException(nameof(formularioModificacione));

            return await _repoFormularioModificacione.Crear(formularioModificacione);
        }

        public async Task<FormularioModificacione> EditarFormularioModificacionesAsync(FormularioModificacione formularioModificacione)
        {
           
                if (formularioModificacione == null)
                    throw new ArgumentNullException(nameof(formularioModificacione));

                var resultado = await _repoFormularioModificacione.Editar(formularioModificacione);
                if (!resultado)
                {
                    throw new Exception("La edición del formulario no fue exitosa.");
                }

                return formularioModificacione;  
          

        }

        public async Task<FormularioModificacione> EditarFueUtilizado(int id)
        {
            var formularioAlta = await _repoFormularioModificacione.Obtener(b => b.Id == id);
            formularioAlta.FueUtilizado = true;

            var resultado = await _repoFormularioModificacione.Editar(formularioAlta);
            return formularioAlta;
        }

        public async Task<FormularioModificacione> ListarFormulariosAModificacionesAsyncPordId(int id)
        {
            var formularioModificacione = await _repoFormularioModificacione.Obtener(b => b.Id == id);

            return formularioModificacione;
        }

      

        public async Task<List<FormularioModificacione>> ListarFormulariosModificacionesAsync()
        {
            IQueryable<FormularioModificacione> query = await _repoFormularioModificacione.Consultar();
            return query.ToList();
        }

        async Task<FormularioModificacione> IFormularioModificacionService.ListarFormulariosModificacionAsyncId(int id)
        {
            var formularioModificacione = await _repoFormularioModificacione.Obtener(b => b.Id == id);

            return formularioModificacione;
        }
    }
}
