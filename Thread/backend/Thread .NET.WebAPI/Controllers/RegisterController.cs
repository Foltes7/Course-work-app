using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Thread_.NET.BLL.Services;
using Thread_.NET.Common.DTO.User;
using Thread_.NET.DAL.Entities;
namespace Thread_.NET.WebAPI.Controllers
{


    [Route("api/[controller]")]
    [AllowAnonymous]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly AuthService _authService;

        private readonly UserManager<Common.Model.User> _userManager;
        private readonly EmailService emailService;

        public RegisterController(UserService userService, AuthService authService, EmailService emailService, UserManager<Common.Model.User> _userManager)
        {
            _userService = userService;
            _authService = authService;
            this.emailService = emailService;
            this._userManager = _userManager;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] UserRegisterDTO user)
        {
            var createdUser = await _userService.CreateUser(user);
            var token = await _authService.GenerateAccessToken(createdUser.Id, createdUser.UserName, createdUser.Email);

            Common.Model.User tempUser = new Common.Model.User() { Email = createdUser.Email, UserName = createdUser.UserName};
            var code = await _userManager.GenerateEmailConfirmationTokenAsync(tempUser);
            var callbackUrl = Url.Action(
                "ConfirmEmail",
                "Register",
                new { userId = createdUser.Id, code = code },
                protocol: HttpContext.Request.Scheme);

            try
            {
                await emailService.SendEmailAsync(createdUser.Email, "Confirm your account",
                    $"Подтвердите регистрацию, перейдя по ссылке: <a href='{callbackUrl}'>link</a>");
            }
            catch(Exception e)
            {
                Console.WriteLine(e);
            }


            var result = new AuthUserDTO
            {
                User = createdUser,
                Token = token
            };

            return CreatedAtAction("GetById", "users", new { id = createdUser.Id }, result);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task ConfirmEmail(int userId, string code)
        {
            if (code == null)
            {
                return;
            }
            
            await _userService.ConfirmEmail(userId);
            
            return;
        }
    }
}