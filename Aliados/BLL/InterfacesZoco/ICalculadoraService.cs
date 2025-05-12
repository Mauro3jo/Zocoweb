using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface ICalculadoraService
    {
        Task<List<ListaCuotum>> ListaCuota();
        Task<List<ListaIibbprovincium>> ListaIIBBProvincia();

        Task<List<ListaImpositiva>> ListaImpositiva();

        Task<List<ListaTasaPreferecial>> ListaPreferencial();
        Task<ListaTasaPreferecial> ObtenerPreferencial(int usuarioId);


    }
}
