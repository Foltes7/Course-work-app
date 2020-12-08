FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src
COPY backend/ backend/

WORKDIR /src/backend/Thread .NET.WebAPI
RUN dotnet restore "Thread .NET.WebAPI.csproj"
RUN dotnet build "Thread .NET.WebAPI.csproj" -c Release -o app/build
RUN dotnet publish "Thread .NET.WebAPI.csproj" -c Release -o app/output

FROM base AS final
COPY --from=build ["/src/backend/Thread .NET.WebAPI/app/output", "."]
CMD ASPNETCORE_URLS=http://*:$PORT dotnet "Thread .NET".WebAPI.dll
# ENTRYPOINT ["dotnet", "Thread .NET.WebAPI.dll"]


