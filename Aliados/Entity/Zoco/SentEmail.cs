using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class SentEmail
    {
        public int Id { get; set; }
        public string FromEmail { get; set; } = null!;
        public string ToEmail { get; set; } = null!;
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public DateTime SentDate { get; set; }
        public int EmailConfigurationId { get; set; }
        public string? InReplyToMessageId { get; set; }

        public virtual EmailConfiguration EmailConfiguration { get; set; } = null!;
    }
}
