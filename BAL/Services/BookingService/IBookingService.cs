using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BAL.Services.BookingService
{
    public interface IBookingService
    {
        public IEnumerable<CarBooking> GetAllBookingByUserId(string userId);
        public IEnumerable<CarBooking> GetExistingBookingByUserId(int cardId);
    }
}
