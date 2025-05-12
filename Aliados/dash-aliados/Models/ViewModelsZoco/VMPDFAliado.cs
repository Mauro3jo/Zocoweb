namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMPDFAliado
    {
        public List<FileData> Files { get; set; } = new List<FileData>();
    }

    public class FileData
    {
        public string Content { get; set; }
        public string Name { get; set; }
    }
}
