using AutoMapper;
using BAL.Services.BookingService;
using BAL.Services.CarService;
using DAL.ModelDTO;
using DAL.Models;
using DAL.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarBookingAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController, Authorize(AuthenticationSchemes = "Bearer")]
    public class BookingController : ControllerBase
    {
        private readonly IGenericRepository<CarBooking> _bookingRepository;
        private readonly IGenericRepository<Car> _carRepository;
        private readonly IBookingService _bookingService;
        private readonly ICarService _carService;
        private readonly IMapper _mapper;
        public BookingController(IGenericRepository<CarBooking> bookingRepository, IMapper mapper, ICarService carService, IBookingService bookingService, IGenericRepository<Car> carRepository)
        {
            _bookingRepository = bookingRepository;
            _mapper = mapper;
            _carService = carService;
            _bookingService = bookingService;
            _carRepository = carRepository;
        }

        [HttpGet("{userId}")]
        public IActionResult GetTotalCars(string userId)
        {
            try
            {
                var totalBookings = _bookingService.GetAllBookingByUserId(userId).Count();
                return Ok(new { totalBookings });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{Id}")]
        public IActionResult GetAllBookings(string Id) 
        {
            try
            {
                var booking = _bookingService.GetAllBookingByUserId(Id);
                if (booking == null)
                {
                    return NotFound(new { message = "No Booking Found" });
                }
                else
                {
                    return Ok(booking);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }
        [HttpPost("{offset}")]

        public async Task<IActionResult> Booking(CarBookingDTO model, int offset)
        {
            try
            {
                DateRange dates = new DateRange();
                model.StartDate = model.DateRange.StartDate.AddMinutes(offset);
                model.EndDate = model.DateRange.EndDate.AddMinutes(offset);
                CarBooking carBooking = _mapper.Map<CarBooking>(model);
                await _bookingRepository.CreateAsync(carBooking);
                await _bookingRepository.SaveAsync();
                Car car = await _carRepository.GetById(model.CarId);
                car.Slots--;
                if(car.Slots == 0)
                {
                    car.IsBookingActive = false;
                }
               
                await _carRepository.UpdateAsync(car.CarId, car);
                await _carRepository.SaveAsync();
                return Ok(new { message = "Booking Suuceesfully" });
            }
            catch (Exception ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
