using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAL.Services.CarService
{
    public interface ICarService
    {
        public Task<IEnumerable<Car>> GetCars(string userId);
        public Task<IEnumerable<Car>> GetCarsByCompanyName(string companyName);
        public DateTime ConvertLocalToUtc(DateTime date);

    }
}
