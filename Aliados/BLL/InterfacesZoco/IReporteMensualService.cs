using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IReporteMensualService
    {
        Task<ReporteMensual> NuevoReporte(ReporteMensual reporteMensual);
        Task<List<ReporteMensual>> ObtenerListaReporte();
        Task<List<ReporteMensual>> ObtenerListaReporteMes(DateTime? fechames);


        Task<bool> ExisteReporteFecha( DateTime? fecha);

    }
}
