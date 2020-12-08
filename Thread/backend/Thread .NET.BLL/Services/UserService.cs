using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Thread_.NET.BLL.Exceptions;
using Thread_.NET.BLL.Services.Abstract;
using Thread_.NET.Common.DTO.User;
using Thread_.NET.Common.Security;
using Thread_.NET.DAL.Context;
using Thread_.NET.DAL.Entities;

namespace Thread_.NET.BLL.Services
{
    public sealed class UserService : BaseService
    {
        public UserService(ThreadContext context, IMapper mapper) : base(context, mapper) { }

        public async Task<ICollection<UserDTO>> GetUsers()
        {
            var users = await _context.Users2
                .Include(x => x.Avatar)
                .ToListAsync();

            return _mapper.Map<ICollection<UserDTO>>(users);
        }

        public async Task ConfirmEmail(int Id)
        {
            var userEntity = await GetUserByIdInternal(Id);
            if (userEntity == null)
            {
                throw new NotFoundException(nameof(User), Id);
            }
            userEntity.EmailConfirmed = true;
            _context.Users2.Update(userEntity);
            await _context.SaveChangesAsync();
        }
        public async Task<UserDTO> GetUserById(int id)
        {
            var user = await GetUserByIdInternal(id);
            if (user == null)
            {
                throw new NotFoundException(nameof(User), id);
            }

            return _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> CreateUser(UserRegisterDTO userDto)
        {
            var userEntity = _mapper.Map<User>(userDto);
            var salt = SecurityHelper.GetRandomBytes();

            userEntity.Salt = Convert.ToBase64String(salt);
            userEntity.Password = SecurityHelper.HashPassword(userDto.Password, salt);

            _context.Users2.Add(userEntity);
            await _context.SaveChangesAsync();

            return _mapper.Map<UserDTO>(userEntity);
        }

        public async Task UpdateUser(UserDTO userDto)
        {
            var userEntity = await GetUserByIdInternal(userDto.Id);
            if (userEntity == null)
            {
                throw new NotFoundException(nameof(User), userDto.Id);
            }

            var timeNow = DateTime.Now;

            userEntity.Email = userDto.Email;
            userEntity.UserName = userDto.UserName;
            userEntity.UpdatedAt = timeNow;

            if (!string.IsNullOrEmpty(userDto.Avatar))
            {
                if (userEntity.Avatar == null)
                {
                    userEntity.Avatar = new Image
                    {
                        URL = userDto.Avatar
                    };
                }
                else
                {
                    userEntity.Avatar.URL = userDto.Avatar;
                    userEntity.Avatar.UpdatedAt = timeNow;
                }
            }
            else
            {
                if (userEntity.Avatar != null)
                {
                    _context.Images.Remove(userEntity.Avatar);
                }
            }

            _context.Users2.Update(userEntity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUser(int userId)
        {
            var userEntity = await _context.Users2.FirstOrDefaultAsync(u => u.Id == userId);

            if (userEntity == null)
            {
                throw new NotFoundException(nameof(User), userId);
            }

            _context.Users2.Remove(userEntity);
            await _context.SaveChangesAsync();
        }

        private async Task<User> GetUserByIdInternal(int id)
        {
            return await _context.Users2
                .Include(u => u.Avatar)
                .FirstOrDefaultAsync(u => u.Id == id);
        }
    }
}
