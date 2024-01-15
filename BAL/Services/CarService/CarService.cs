using DAL.Models;
using DAL.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAL.Services.CarService
{
    public class CarService : ICarService
    {
        private readonly IGenericRepository<Car> _genericRepoisitory;
        public CarService(IGenericRepository<Car> genericRepoisitory)
        {
            _genericRepoisitory = genericRepoisitory;
        }

        public async Task<IEnumerable<Car>> GetCars(string userId)
        {
            var cars =  _genericRepoisitory.GetAll().Where(x => x.UserId == userId && x.IsDeleted != true);
            return await cars.ToListAsync();
        }

        public async Task<IEnumerable<Car>> GetCarsByCompanyName(string companyName)
        {
            var cars = _genericRepoisitory.GetAll().Where(x => x.Company.CompanyName.ToLower() == companyName.ToLower() && x.IsBookingActive != false);
            return await cars.ToListAsync();
        }

        public DateTime ConvertLocalToUtc(DateTime date)
        {
            DateTime localDateTime = DateTime.Parse(date.ToString());
            return localDateTime.ToUniversalTime();
        }
    }
}
