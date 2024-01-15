using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class User : IdentityUser
    {
        public string Name { get; set; } 
       
        public virtual ICollection<Car>? Cars { get;}
        public virtual ICollection<CarBooking>? Bookings { get; }

    }
}
