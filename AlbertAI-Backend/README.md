# AlbertAI Backend Setup

This guide will help you set up the AlbertAI Backend and database on your local machine.

## Prerequisites

Ensure you have the following installed:

- .NET 8.0 SDK
- MySQL 8.4.3

## Setting Up MySQL Database

1. Log in to MySQL as Root

```
sudo mysql -u root -p
```

Enter your MySQL root password when prompted.

2. Create the Database

```
CREATE DATABASE AlbertAIDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Create the `admin` User and Grant Privileges

```
CREATE USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'AlbertAI';
GRANT ALL PRIVILEGES ON AlbertAIDB.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
```

4. Verify the User and Database

```
SHOW DATABASES;
SHOW GRANTS FOR 'admin'@'localhost';
```

## Configuring the Backend

1. Ensure the `appsettings.json` file contains the correct database connection string:

   \*\*File: \*\***appsettings.json**

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=127.0.0.1;Database=AlbertAIDB;User=admin;Password=AlbertAI;"
     }
   }
   ```

2. Check `Program.cs` for proper configuration:

   ```csharp
   var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
   builder.Services.AddDbContext<AppDbContext>(options =>
       options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
   ```

## Installing Dependencies

Before running the project, restore the dependencies:

```
dotnet restore
```

## Applying Database Migrations

If you are setting up the database for the first time, run:

```
dotnet ef migrations add InitialCreate
```

Then apply migrations to the database:

```
dotnet ef database update
```

Verify that tables were created:

```
sudo mysql -u admin -p
USE AlbertAIDB;
SHOW TABLES;
```

## Running the Backend

To start the backend server, run:

```
dotnet run
```

The API should be accessible at:

```
http://localhost:5000/api
```

For Swagger UI (API documentation):

```
http://localhost:5000/swagger
```

## Troubleshooting

### Connection Issues with MySQL

1. Ensure MySQL is running:
   ```
   sudo systemctl start mysql  # Linux
   brew services start mysql   # MacOS
   ```
2. Check MySQL user permissions:
   ```
   SHOW GRANTS FOR 'admin'@'localhost';
   ```
3. If `admin` user isn't working, try using `root` instead in `appsettings.json`.

### EF Core Still Using Old Database Credentials

Run the following to clear caches and rebuild:

```
dotnet clean
dotnet restore
dotnet build
```

Then rerun:

```
dotnet ef database update
```
