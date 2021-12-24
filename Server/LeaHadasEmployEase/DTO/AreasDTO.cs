using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
namespace DTO
{
    public class AreasDTO
    {
        public AreasDTO(){ }
        public AreasDTO(short AreaCode, string AreaName)
        {
            this.Code = AreaCode;
            this.Name = AreaName;
        }
        public short Code { get; set; }
        public string Name { get; set; }
        public static AreasDTO convertDBsetToDTO(Areas Area)
        {
            return new AreasDTO(Area.AreaCode, Area.AreaName);
        }
        public static List<AreasDTO> convertDBsetToDTO(List<Areas> Areaslist)
        {
            List<AreasDTO> DTOlist = new List<AreasDTO>();
            Areaslist.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
        public static List<Areas> convertDTOsetToDB(List<AreasDTO> Areaslist)
        {
            List<Areas> DBlist = new List<Areas>();
            Areaslist.ForEach(a => DBlist.Add(new Areas() { AreaCode = a.Code, AreaName = a.Name }));
            return DBlist;
        }
    }
}
