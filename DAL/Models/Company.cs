using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Company : BaseEntity
    {
        public int Id { get; set; }
        public string CompanyName { get; set; }
        public virtual ICollection<Car>? Cars { get; }
        public virtual ICollection<CarBooking>? Bookings { get; }
    }
}
