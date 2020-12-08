
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Thread_.NET.Common.Model;
using Thread_.NET.DAL.Entities;

namespace Thread_.NET.DAL.Context
{
    public sealed class ThreadContext : IdentityDbContext<Common.Model.User>
    {
        public ThreadContext(DbContextOptions<ThreadContext> options) : base(options)
        {
        }

        public DbSet<Comment> Comments { get; private set; }
        public DbSet<CommentReaction> CommentReactions { get; private set; }
        public DbSet<Image> Images { get; private set; }
        public DbSet<Post> Posts { get; private set; }
        public DbSet<PostReaction> PostReactions { get; private set; }
        public DbSet<RefreshToken> RefreshTokens { get; private set; }
        public DbSet<Entities.User> Users2 { get; private set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Setting up entities using extension method
            modelBuilder.Configure();

            // Seeding data using extension method
            // NOTE: this method will be called every time after adding a new migration, cuz we use Bogus for seed data
            // modelBuilder.Seed();
        }
    }
}
