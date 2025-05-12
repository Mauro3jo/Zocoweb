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
    public class FilasCloverQrService : IFilasCloverQrService
    {
        private readonly IGenericRepository<FilasCloverQr> _repoFilasCloverQrService;

        public FilasCloverQrService(IGenericRepository<FilasCloverQr> repoFilasCloverQrService)
        {
            _repoFilasCloverQrService = repoFilasCloverQrService;

        }
        public async Task<FilasCloverQr> Crear(FilasCloverQr QR)
        {
            try
            {
                return await _repoFilasCloverQrService.Crear(QR);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el QR", ex);
            }
        }

        public async Task<List<FilasCloverQr>> ObtenerListaQR()
        {
            try
            {
                var documentos = await _repoFilasCloverQrService.Consultar();

                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los QR", ex);
            }
        }
    }
}
