using AutoMapper;
using DAL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Win32;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CarBookingAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IMapper _mapper;
        public readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        public AccountController(IMapper mapper, UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration config)
        {
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> Register(Register registerModel)
        {
            try
            {
                var existuser = await _userManager.FindByEmailAsync(registerModel.Email);
                if(existuser != null)
                {
                    return BadRequest(new { message = "Email is already registerd" });
                }
                var user = _mapper.Map<User>(registerModel);
                var result = await _userManager.CreateAsync(user, registerModel.Password);

                await _userManager.AddToRoleAsync(user, "User");
                return Ok(new { message = "User Registerd Successfully" });
            }
            catch (DbUpdateException ex)
            {
                return BadRequest(new { message = "Error: email is already registerd." });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Login(Login model)

        {
            try
            {
                User user = await _userManager.FindByEmailAsync(model.Email);
                if (user != null)
                {

                    if (!await _userManager.CheckPasswordAsync(user, model.Password))
                    {
                        return Unauthorized(new { message = "Invalid Credentials" });
                    }
                    var accessToken = GenerateToken(user);


                    return Ok(new { message = "User Logged-in Successfully!", token = accessToken });
                }
                else
                {
                    return NotFound(new { message = "User does n't exist" });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            try
            {
                await _signInManager.SignOutAsync();
                return StatusCode(201);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private string GenerateToken(User user)
        {
            List<string> roles = _userManager.GetRolesAsync(user).Result.ToList();
            var claims = new[] {
            new Claim(ClaimTypes.Name, user.Name),
            new Claim("Name", user.Name),
            new Claim("Id", user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, roles[0]),
            new Claim("Role", roles[0]),
            new Claim(ClaimTypes.NameIdentifier,
            user.Id)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(_config["Jwt:Issuer"], _config["Jwt:Audience"], claims,
                expires: DateTime.Now.AddDays(1), signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
