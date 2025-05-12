using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class ReceivedEmail
    {
        public int Id { get; set; }
        public string FromEmail { get; set; } = null!;
        public string ToEmail { get; set; } = null!;
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public DateTime ReceivedDate { get; set; }
        public int EmailConfigurationId { get; set; }
        public bool? IsReplied { get; set; }
        public string? MessageId { get; set; }

        public virtual EmailConfiguration EmailConfiguration { get; set; } = null!;
    }
}
