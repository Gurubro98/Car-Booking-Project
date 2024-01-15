using DAL.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected ApplicationDbContext _context = null;
        protected DbSet<T> table = null;
        public GenericRepository(ApplicationDbContext context)
        {
            this._context = context;
            table = context.Set<T>();
        }

        public    IQueryable<T> GetAll()
        {
            return table;
        }


        public async Task<T> GetById(object id)
        {
            return await table.FindAsync(id);
        }
        public async Task CreateAsync(T obj)
        {
            await table.AddAsync(obj);
        }
        public async Task UpdateAsync(object id, T obj)
        {
            var exist = await table.FindAsync(id);
            if(exist != null)
            {
                _context.Entry(exist).State = EntityState.Detached;
                table.Attach(obj);
                _context.Entry(obj).State = EntityState.Modified;
            }
            
        }
        public async Task DeleteAsync(object id)
        {
            T existing = await table.FindAsync(id);
            table.Remove(existing);
        }
        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
