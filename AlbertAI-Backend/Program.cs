using AlbertAI.Data;
using AlbertAI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
<<<<<<< HEAD
using DotEnv.Net;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
DotEnv.Load();

=======

var builder = WebApplication.CreateBuilder(args);
>>>>>>> 664438bee1db649c97cad6b00972d948ab838e25
builder.Configuration
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

<<<<<<< HEAD
// Set Azure OpenAI API key from environment variable
builder.Configuration["AzureOpenAI:ApiKey"] = Environment.GetEnvironmentVariable("AZURE_OPENAI_API_KEY");
builder.Configuration["JwtSettings:Secret"] = Environment.GetEnvironmentVariable("JWT_SECRET");

=======
>>>>>>> 664438bee1db649c97cad6b00972d948ab838e25
// Add CORS services and define a policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost5173",
        builder =>
        {
            builder
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// Register your services
builder.Services.AddScoped<Authenticator>();


var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Database connection string is missing! Check appsettings.json.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddControllers();

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings.GetValue<string>("Secret");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false, // Set to true and specify if you have an issuer
        ValidateAudience = false, // Set to true and specify if you have an audience
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero // Optional: Reduce clock skew if needed
    };
});

// Add Swagger service with more detailed documentation
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "AlbertAI API",
        Version = "v1",
        Description = "API documentation for AlbertAI backend"
    });

    // Optional: Add JWT Authorization to Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement{
        {
            new OpenApiSecurityScheme{
                Reference = new OpenApiReference{
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});

var app = builder.Build();

app.UseRouting();

app.UseCors("AllowLocalhost5173");

app.UseAuthentication();
app.UseAuthorization();

// 7. Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AlbertAI API V1");
<<<<<<< HEAD
        c.RoutePrefix = "swagger"; // Set Swagger UI at /swagger
=======
        c.RoutePrefix = string.Empty; // Set Swagger UI at the root
>>>>>>> 664438bee1db649c97cad6b00972d948ab838e25
    });
}

app.MapControllers();

app.Run();
