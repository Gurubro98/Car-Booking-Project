using DAL.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.ModelDTO
{
    public class CarDTO
    {
        public int CarId { get; set; }
        [Required(ErrorMessage = "CarName is required")]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "CarName contains characters between 3 and 30")]
        //[RegularExpression("^[a-zA-Z0-9_.-]*$", ErrorMessage = "CarName doesn't contain any special characters")]
        public string CarName { get; set; }


        [Required(ErrorMessage = "Car Number is required")]
        //[RegularExpression("^[a-zA-Z0-9_.-]*$", ErrorMessage = "Car Number doesn't contain any special characters")]
        public string Number { get; set; }

        [Required(ErrorMessage = "Car Availability is required")]
        [NotMapped]
        public DateRange Availability { get; set; }

       

        public DateTime StartDate { get; set; }
       

        public DateTime EndDate { get; set; }

        [Required(ErrorMessage = "Slot is required")]
        public int Slots { get; set; }



        [Required(ErrorMessage = "Fare is required")]
        public int Fare { get; set; }

        public Boolean IsBookingActive { get; set; } 

        
        [Required(ErrorMessage = "companyId is required")]
        public int CompanyId { get; set; }
        public string UserId { get; set; }
    }
}
