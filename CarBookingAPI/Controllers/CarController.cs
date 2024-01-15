using AutoMapper;
using BAL.Services.BookingService;
using BAL.Services.CarService;
using DAL.ModelDTO;
using DAL.Models;
using DAL.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CarBookingAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController, Authorize(AuthenticationSchemes = "Bearer")]
    public class CarController : ControllerBase
    {
        private readonly IGenericRepository<Car> _carRepository;
        private readonly IGenericRepository<Company> _companyRepository;
        private readonly IGenericRepository<CountryTimeZones> _timezoneRepository;
        private readonly ICarService _carService;
        private readonly IBookingService _bookingService;
        private readonly IMapper _mapper;

        public CarController(IGenericRepository<Car> carRepository, IGenericRepository<Company> companyRepository, ICarService carService, IMapper mapper, IGenericRepository<CountryTimeZones> timezoneRepository, IBookingService bookingService)
        {
            _carRepository = carRepository;
            _companyRepository = companyRepository;
            _carService = carService;
            _mapper = mapper;
            _timezoneRepository = timezoneRepository;
            _bookingService = bookingService;
        }

        [HttpGet]
        public IActionResult GetAllTimezones()
        {
            try
            {
                var timezones = _timezoneRepository.GetAll().ToList();
                if (timezones == null)
                {
                    return NotFound(new { message = "No Country timezone Found" });
                }
                else
                {
                    return Ok(timezones);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetTotalCars(string userId)
        {
            try
            {
                var totalCars = _carService.GetCars(userId).Result.Count();
                return Ok(new { totalCars });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetAllCompanies()
        {
            try
            {
                var companies = _companyRepository.GetAll();
                if (companies == null)
                {
                    return NotFound(new { message = "No Company Found" });
                }
                else
                {
                    return Ok(await companies.ToListAsync());
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCarsByUserId(string userId)
        {
            try
            {
                IEnumerable<Car> cars = await _carService.GetCars(userId);
                if (cars == null)
                {
                    return NotFound(new { message = "No Car Found" });
                }
                else
                {
                    return Ok(cars);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{carId}")]
        public async Task<IActionResult> GetCarById(int carId)
        {
            try
            {
                if (carId == 0)
                {
                    return NotFound(new { message = "Id not Found" });
                }
                else
                {
                    Car car = await _carRepository.GetById(carId);
                    return Ok(car);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



        [HttpPost("{offset}")]
        public async Task<IActionResult> Create(CarDTO carModel, int offset)
        {
            try
            {
                DateRange dates = new DateRange();
                carModel.StartDate = carModel.Availability.StartDate.AddMinutes(offset);
                carModel.EndDate = carModel.Availability.EndDate.AddMinutes(offset);

                var car = _mapper.Map<Car>(carModel);
                //string userId = 
                car.CreatedOn = DateTime.UtcNow;
                car.CreatedBy = carModel.UserId;
                car.IsBookingActive = true;
                car.IsDeleted = false;
                await _carRepository.CreateAsync(car);
                await _carRepository.SaveAsync();
                return Ok(new { message = "Car Created Successfully" });
            }
            catch (DbUpdateException ex)
            {
                // Check for unique constraint violation
                if (ex.InnerException is SqlException sqlException && sqlException.Number == 2601)
                {
                    return BadRequest(new { message = "Error: Duplicate CarNumber detected with Same CarName." });
                }
                else
                {
                    return BadRequest();
                }

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{companyName}")]
        public async Task<IActionResult> GetCarsByCompanyName(string companyName)
        {
            try
            {
                var cars = await _carService.GetCarsByCompanyName(companyName);
                return Ok(new { cars });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{carId}")]
        public async Task<IActionResult> Update(int carId, CarDTO carModel, int offset)
        {
            try
            {
                var existCar = await _carRepository.GetById(carId);
                if (existCar == null)
                {
                    return NotFound(new { message = "Id not Found" });
                }
                else
                {
                    DateRange dates = new DateRange();
                    carModel.StartDate = carModel.Availability.StartDate.AddMinutes(offset);
                    carModel.EndDate = carModel.Availability.EndDate.AddMinutes(offset);

                    Car car = _mapper.Map<Car>(carModel);
                    car.CreatedOn = existCar.CreatedOn;
                    car.CreatedBy = existCar.CreatedBy;
                    if (car.Slots > 0)
                    {
                        car.IsBookingActive = true;
                    }
                    car.IsDeleted = false;
                    car.UpdatedOn = DateTime.UtcNow;
                    string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                    car.UpdatedBy = userId;
                    await _carRepository.UpdateAsync(carId, car);
                    await _carRepository.SaveAsync();
                    return Ok(new { message = "Car Updated Successfully" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{carId}")]
        public async Task<IActionResult> Delete(int carId)
        {
            if (carId == 0)
            {
                return NotFound(new { message = "Id not Found" });
            }
            try
            {
                
                Car car = await _carRepository.GetById(carId);
                var bookingCar = _bookingService.GetExistingBookingByUserId(car.CarId);
                if(bookingCar.Count() == 0)
                {
                    car.IsDeleted = true;
                }
                else
                {
                    return BadRequest(new { message = "car record not deleted because it is booked" });
                }



                await _carRepository.UpdateAsync(car.CarId, car);
                await _carRepository.SaveAsync();
                return Ok(new { message = "Car Data Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }



    }
}
