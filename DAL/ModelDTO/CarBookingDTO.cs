using DAL.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.ModelDTO
{
    public class CarBookingDTO
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "CarId is required")]
        public int CarId { get; set; }

        [Required(ErrorMessage = "CompanyId is required")]
        public int CompanyId { get; set; }

        [Required(ErrorMessage = "UserId is required")]
        public string UserId { get; set; }

        [Required(ErrorMessage = "TotalPrice is required")]
        public double TotalPrice { get; set; }
        [Required(ErrorMessage = "DateRange is required")]
        [NotMapped]
        public DateRange DateRange { get; set; }
        public DateTime StartDate { get; set; }


        public DateTime EndDate { get; set; }
    }
}
