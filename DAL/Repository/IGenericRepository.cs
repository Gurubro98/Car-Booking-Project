using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository
{
    public interface IGenericRepository<T> where T : class
    {
        IQueryable<T> GetAll();
        Task<T> GetById(object id);
        Task CreateAsync(T obj);
        Task UpdateAsync(object id, T obj);
        Task DeleteAsync(object id);
        Task SaveAsync();
    }
}
