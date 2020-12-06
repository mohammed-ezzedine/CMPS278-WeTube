using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

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

        public async static Task<string> AddFileToSystemAsync(IFormFile file, IWebHostEnvironment env)
        {
            if (file == null)
            {
                return null;
            }

            var extension = file.FileName.Substring(file.FileName.LastIndexOf('.') + 1);
            // Add unique name to avoid possible name conflicts
            var uniquefileName = DateTime.Now.Ticks + "." + extension;
            var filePath = Path.Combine(env.WebRootPath, uniquefileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write))
            {
                // Copy the file to storage
                await file.CopyToAsync(fileStream);
            }

            return filePath;
        }
    }
}
