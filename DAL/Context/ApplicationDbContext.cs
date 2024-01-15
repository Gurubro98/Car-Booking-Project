using DAL.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Context
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            this.SeedUsers(modelBuilder);
            this.SeedRoles(modelBuilder);
            this.SeedUserRoles(modelBuilder);
            this.SeedTimeZones(modelBuilder);
            this.SeedCarCompanies(modelBuilder);
            modelBuilder.Entity<Car>()
            .HasIndex(c => new { c.CarName, c.Number })
            .IsUnique();


            modelBuilder.Entity<CarBooking>()
                .HasOne(cb => cb.Car)
                .WithMany()
                .HasForeignKey(cb => cb.CarId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<CarBooking>()
                .HasOne(cb => cb.Company)
                .WithMany()
                .HasForeignKey(cb => cb.CompanyId)
                .OnDelete(DeleteBehavior.NoAction);

            



        }

        private void SeedCarCompanies(ModelBuilder builder)
        {
            var carCompanies = new List<Company>
    {
        new Company { Id = 1, CompanyName = "Toyota" },
        new Company { Id = 2, CompanyName = "Ford" },
        new Company { Id = 3, CompanyName = "Volkswagen" },
        new Company { Id = 4, CompanyName = "Honda" },
        new Company { Id = 5, CompanyName = "General Motors" },
        new Company { Id = 6, CompanyName = "Nissan" },
        new Company { Id = 7, CompanyName = "Hyundai" },
        new Company { Id = 8, CompanyName = "BMW" },
        new Company { Id = 9, CompanyName = "Mercedes-Benz" },
        new Company { Id = 10, CompanyName = "Chevrolet" },
        new Company { Id = 11, CompanyName = "Audi" },
        new Company { Id = 12, CompanyName = "Kia" },
        new Company { Id = 13, CompanyName = "Fiat" },
        new Company { Id = 14, CompanyName = "Tesla" },
        new Company { Id = 15, CompanyName = "Subaru" },
        new Company { Id = 16, CompanyName = "Jaguar" },
        new Company { Id = 17, CompanyName = "Volvo" },
        new Company { Id = 18, CompanyName = "Mazda" },
        new Company { Id = 19, CompanyName = "Porsche" },
        new Company { Id = 20, CompanyName = "Lexus" }
    };

            builder.Entity<Company>().HasData(carCompanies);
        }

        private void SeedTimeZones(ModelBuilder builder)
        {
            var timeZones = new List<CountryTimeZones>
    {
        new CountryTimeZones { Id = 1, Name = "America/New_York", Offset = "-05:00" },
        new CountryTimeZones { Id = 2, Name = "America/Los_Angeles", Offset = "-08:00" },
        new CountryTimeZones { Id = 3, Name = "Europe/London", Offset = "+00:00" },
        new CountryTimeZones { Id = 4, Name = "Europe/Paris", Offset = "+01:00" },
        new CountryTimeZones { Id = 5, Name = "Asia/Tokyo", Offset = "+09:00" },
        new CountryTimeZones { Id = 6, Name = "Australia/Sydney", Offset = "+11:00" },
        new CountryTimeZones { Id = 7, Name = "America/Mexico_City", Offset = "-06:00" },
        new CountryTimeZones { Id = 8, Name = "America/Buenos_Aires", Offset = "-03:00" },
        new CountryTimeZones { Id = 9, Name = "Asia/Dubai", Offset = "+04:00" },
        new CountryTimeZones { Id = 10, Name = "Asia/Kolkata", Offset = "+05:30" },
        new CountryTimeZones { Id = 11, Name = "Africa/Cairo", Offset = "+02:00" },
        new CountryTimeZones { Id = 12, Name = "Europe/Moscow", Offset = "+03:00" },
        new CountryTimeZones { Id = 13, Name = "Pacific/Auckland", Offset = "+13:00" },
        new CountryTimeZones { Id = 14, Name = "America/Toronto", Offset = "-05:00" },
        new CountryTimeZones { Id = 15, Name = "Asia/Hong_Kong", Offset = "+08:00" }
    };

            builder.Entity<CountryTimeZones>().HasData(timeZones);
        }
        private void SeedUsers(ModelBuilder builder)
        {
            PasswordHasher<User> passwordHasher = new PasswordHasher<User>();
            builder.Entity<User>().Property(p => p.Name).HasMaxLength(255).IsRequired();
            User Admin = new User()
            {
                Id = "1",
                Name = "Admin",
                Email = "admin@gmail.com",
                NormalizedEmail = "ADMIN@GMAIL.COM",
                UserName = "admin@gmail.com",
                NormalizedUserName = "ADMIN@GMAIL.COM",
                LockoutEnabled = true,
                PasswordHash = passwordHasher.HashPassword(null, "Admin@123")
            };
            User user = new User()
            {
                Id = "2",
                Name = "User",
                Email = "user@gmail.com",
                NormalizedEmail = "USER@GMAIL.COM",
                UserName = "user@gmail.com",
                NormalizedUserName = "USER@GMAIL.COM",
                LockoutEnabled = true,
                PasswordHash = passwordHasher.HashPassword(null, "User@123")
            };



            builder.Entity<User>().HasData(Admin);
            builder.Entity<User>().HasData(user);
        }
        private void SeedUserRoles(ModelBuilder builder)
        {
            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string>() { RoleId = "1", UserId = "1" },
                new IdentityUserRole<string>() { RoleId = "2", UserId = "2" }
                );
        }
        private void SeedRoles(ModelBuilder builder)
        {
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole() { Id = "1", Name = "Admin", ConcurrencyStamp = "1", NormalizedName = "ADMIN" },
                new IdentityRole() { Id = "2", Name = "User", ConcurrencyStamp = "2", NormalizedName = "USER" }
                );
        }


        public DbSet<User> Users { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<CountryTimeZones> TimeZones { get; set; }
        public DbSet<CarBooking> Bookings { get; set; }
        public DbSet<Company> companies { get; set; }
    }
}
