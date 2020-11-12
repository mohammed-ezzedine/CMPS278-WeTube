using System;
using System.Security.Cryptography;
using System.Text;

namespace YouTubeClone.Services
{
    public static class HelperFunctions
    {
        public static string HashPassword(this string password, string salt)
        {
            byte[] textWithSaltBytes = Encoding.UTF8.GetBytes(string.Concat(password, salt.ToUpper()));
            var hasher = new MD5CryptoServiceProvider();
            byte[] hashedBytes = hasher.ComputeHash(textWithSaltBytes);
            hasher.Clear();
            return Convert.ToBase64String(hashedBytes);
        }
    }
}
