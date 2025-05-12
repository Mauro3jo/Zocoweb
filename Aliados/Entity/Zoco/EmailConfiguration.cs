using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class EmailConfiguration
    {
        public EmailConfiguration()
        {
            ReceivedEmails = new HashSet<ReceivedEmail>();
            SentEmails = new HashSet<SentEmail>();
        }

        public int Id { get; set; }
        public string Host { get; set; } = null!;
        public int Port { get; set; }
        public bool EnableSsl { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public bool IsDefault { get; set; }
        public string? DisplayName { get; set; }
        public string? ReplyToEmail { get; set; }
        public bool? IsActive { get; set; }

        public virtual ICollection<ReceivedEmail> ReceivedEmails { get; set; }
        public virtual ICollection<SentEmail> SentEmails { get; set; }
    }
}
