using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Thread_.NET.BLL.Hubs;
using Thread_.NET.DAL.Context;
using Thread_.NET.Extensions;
using Thread_.NET.Filters;

namespace Thread_.NET
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ThreadContext>(options => {
                options.UseNpgsql(Configuration.GetConnectionString("ThreadDBConnection"));
                options.EnableSensitiveDataLogging();
                });
            services.RegisterAutoMapper();

            services.RegisterCustomServices();
            services.RegisterCustomValidators();

            services.ConfigureJwt(Configuration);
            services.AddCors();

            services.AddSignalR();

            services.AddScoped<CustomExceptionFilterAttribute>();
            services.AddControllers(opt => {
                opt.Filters.Add(typeof(CustomExceptionFilterAttribute));
                    })
                .AddFluentValidation()
                .AddNewtonsoftJson();

            services.ConfigureCustomValidationErrors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseCors(builder => builder
            .AllowAnyMethod()
            .AllowAnyHeader()
            .WithExposedHeaders("Token-Expired")
            .AllowCredentials()
            .WithOrigins("http://localhost:4200", "http://localhost:8080", "http://localhost", "http://coursework-app.westeurope.cloudapp.azure.com"));

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<PostHub>("/notifications/post");
            });
        }
    }
}
