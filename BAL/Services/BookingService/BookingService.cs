using DAL.Models;
using DAL.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAL.Services.BookingService
{
    public class BookingService : IBookingService
    {
        private readonly IGenericRepository<CarBooking> _genericRepoisitory;
        public BookingService(IGenericRepository<CarBooking> genericRepoisitory)
        {
            _genericRepoisitory = genericRepoisitory;
        }
        public IEnumerable<CarBooking> GetAllBookingByUserId(string userId)
        {
            return _genericRepoisitory.GetAll().Where(x => x.UserId == userId).ToList();
        }

        public IEnumerable<CarBooking> GetExistingBookingByUserId(int cardId)
        {
            return _genericRepoisitory.GetAll().Where(x => x.Car.CarId == cardId).ToList();
        }


    }
}
