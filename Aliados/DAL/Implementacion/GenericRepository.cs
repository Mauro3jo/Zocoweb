using DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using DAL.DBContext;
using System.Threading.Tasks;
using System.Linq;

namespace DAL.Implementacion
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
    {
        private readonly zocowebContext _dbContext;

        public GenericRepository(zocowebContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<TEntity> Obtener(Expression<Func<TEntity, bool>> filtro)
        {
            try
            {
                TEntity entidad = await _dbContext.Set<TEntity>().FirstOrDefaultAsync(filtro);
                return entidad;
            }
            catch
            {
                throw;
            }
        }

        public async Task<TEntity> Crear(TEntity entidad)
        {
            try
            {
                _dbContext.Set<TEntity>().Add(entidad);
                await _dbContext.SaveChangesAsync();
                return entidad;
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> Editar(TEntity entidad)
        {
            try
            {
                _dbContext.Entry(entidad).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw;
            }
        }


        public async Task<bool> Eliminar(TEntity entidad)
        {
            try
            {
                _dbContext.Remove(entidad);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                throw;
            }
        }

        public async Task<IQueryable<TEntity>> Consultar(Expression<Func<TEntity, bool>> filtro = null)
        {
            IQueryable<TEntity> queryEntidad = filtro == null ? _dbContext.Set<TEntity>() : _dbContext.Set<TEntity>().Where(filtro);
            return await Task.FromResult(queryEntidad);
        }

        public async Task<bool> EliminarRango(IEnumerable<TEntity> entidades)
        {
            try
            {
                _dbContext.Set<TEntity>().RemoveRange(entidades); // 🔹 Elimina múltiples registros en un solo paso
                await _dbContext.SaveChangesAsync(); // 🔹 Guarda los cambios en la base de datos
                return true; // ✅ Indica que la operación fue exitosa
            }
            catch
            {
                throw;
            }
        }

        public async Task<List<TEntity>> ConsultarListaAsync(Expression<Func<TEntity, bool>> filtro = null)
        {
            return filtro == null
                ? await _dbContext.Set<TEntity>().ToListAsync() // 🔹 Devuelve toda la tabla en forma de lista
                : await _dbContext.Set<TEntity>().Where(filtro).ToListAsync(); // 🔹 Aplica el filtro y convierte en lista
        }

    }
}
