using Microsoft.EntityFrameworkCore;
using YouTubeClone.Models;

namespace YouTubeClone.Data
{
    public class YouTubeContext : DbContext
    {
        public YouTubeContext(DbContextOptions<YouTubeContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Channel>()
                .HasMany(c => c.Videos)
                .WithOne(v => v.Author)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Channel>()
                .HasMany(c => c.Playlists)
                .WithOne(v => v.Channel)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Channel>()
                .HasMany(c => c.Subscribers)
                .WithOne(s => s.Channel)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Playlist>()
                .HasMany(p => p.Videos)
                .WithOne(v => v.Playlist)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Playlist>()
                .HasOne(p => p.Channel)
                .WithMany(c => c.Playlists)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<PlaylistVideo>()
                .HasOne(pv => pv.Playlist)
                .WithMany(p => p.Videos);

            builder.Entity<PlaylistVideo>()
                .HasOne(pv => pv.Video)
                .WithMany(v => v.Playlists);

            builder.Entity<User>()
                .HasMany(u => u.Subscriptions)
                .WithOne(c => c.User)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<User>()
                .HasMany(u => u.WatchLater)
                .WithOne(v => v.User)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserChannelSubscription>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.Subscriptions);

            builder.Entity<UserChannelSubscription>()
                .HasOne(uc => uc.Channel)
                .WithMany(c => c.Subscribers);

            builder.Entity<UserCommentReaction>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.UserCommentReactions);

            builder.Entity<UserCommentReaction>()
                .HasOne(uc => uc.Comment)
                .WithMany(c => c.UserCommentReactions);

            builder.Entity<UserCommentReply>()
                .HasOne(uc => uc.User)
                .WithMany(u => u.UserCommentReplies);

            builder.Entity<UserCommentReply>()
                .HasOne(uc => uc.Comment)
                .WithMany(c => c.UserCommentReplies);

            builder.Entity<UserVideoComment>()
                .HasOne(uv => uv.User)
                .WithMany(u => u.UserVideoComments);

            builder.Entity<UserVideoComment>()
                .HasOne(uv => uv.Video)
                .WithMany(v => v.UserVideoComments);

            builder.Entity<UserVideoReaction>()
                .HasOne(uv => uv.User)
                .WithMany(u => u.UserVideoReactions);

            builder.Entity<UserVideoReaction>()
                .HasOne(uv => uv.Video)
                .WithMany(v => v.UserVideoReactions);

            builder.Entity<UserVideoReport>()
                .HasOne(uv => uv.User)
                .WithMany(u => u.UserVideoReports);

            builder.Entity<UserVideoReport>()
                .HasOne(uv => uv.Video)
                .WithMany(v => v.UserVideoReports);

            builder.Entity<UserVideoView>()
                .HasOne(uv => uv.User)
                .WithMany(u => u.UserVideoViews);

            builder.Entity<UserVideoView>()
                .HasOne(uv => uv.Video)
                .WithMany(v => v.UserVideoViews);

            builder.Entity<UserVideoWatchLater>()
                .HasOne(uv => uv.User)
                .WithMany(u => u.WatchLater);

            builder.Entity<UserVideoWatchLater>()
                .HasOne(uv => uv.Video)
                .WithMany(v => v.UserVideoWatchLater);

            builder.Entity<Video>()
                .HasOne(v => v.Author)
                .WithMany(c => c.Videos)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Video>()
                .HasMany(v => v.Playlists)
                .WithOne(p => p.Video)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Video>()
                .HasMany(v => v.UserVideoComments)
                .WithOne(p => p.Video)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Video>()
                .HasMany(v => v.UserVideoReactions)
                .WithOne(p => p.Video)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Video>()
                .HasMany(v => v.UserVideoReports)
                .WithOne(p => p.Video)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Video>()
                .HasMany(v => v.UserVideoViews)
                .WithOne(p => p.Video)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Video>()
                .HasMany(v => v.UserVideoWatchLater)
                .WithOne(p => p.Video)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public DbSet<Channel> Channel { get; set; }
        
        public DbSet<Playlist> Playlist { get; set; }

        public DbSet<PlaylistVideo> PlaylistVideo { get; set; }
        
        public DbSet<User> User { get; set; }
        
        public DbSet<UserChannelSubscription> UserChannelSubscription { get; set; }

        public DbSet<UserCommentReaction> UserCommentReaction { get; set; }
        
        public DbSet<UserCommentReply> UserCommentReply { get; set; }
        
        public DbSet<UserVideoComment> UserVideoComment { get; set; }
        
        public DbSet<UserVideoReaction> UserVideoReaction { get; set; }
        
        public DbSet<UserVideoReport> UserVideoReport { get; set; }
        
        public DbSet<UserVideoView> UserVideoViews { get; set; }

        public DbSet<UserVideoWatchLater> UserVideoWatchLater { get; set; }
        
        public DbSet<Video> Video { get; set; }
    }
}
