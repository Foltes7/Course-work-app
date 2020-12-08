using Newtonsoft.Json;
using System;

namespace Thread_.NET.Common.DTO.Auth
{
    public sealed class RefreshTokenDTO
    {
        public RefreshTokenDTO()
        {
            SigningKey = JWT_SECRET.Key;
        }

        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }

        [JsonIgnore]
        public string SigningKey { get; private set; }
    }
}
