using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class AreasTitlesDTO
    {
        public AreasTitlesDTO() { }
        public AreasTitlesDTO(short Code, Nullable<short> AreaCode, string Name)
        {
            this.Code = Code;
            this.AreaCode = AreaCode;
            this.Name = Name;
        }
        public short Code { get; set; }
        public Nullable<short> AreaCode { get; set; }
        public string Name { get; set; }
        public static AreasTitlesDTO convertDBsetToDTO(AreasTitles AreasTitles)
        {
            return new AreasTitlesDTO(AreasTitles.AreaTitleCode, AreasTitles.AreaCode, AreasTitles.AreasTitlesName);
        }
        public static List<AreasTitlesDTO> convertDBsetToDTO(List<AreasTitles> AreasTitlesList)
        {
            List<AreasTitlesDTO> DTOlist = new List<AreasTitlesDTO>();
            AreasTitlesList.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
        public static AreasTitles convertDTOsetToDB(AreasTitlesDTO AreasTitles)
        {
            return new AreasTitles() { AreaTitleCode = AreasTitles.Code, AreaCode = AreasTitles.AreaCode, AreasTitlesName = AreasTitles.Name };
        }
        public static List<AreasTitles> convertDTOsetToDB(List<AreasTitlesDTO> Validaionslist)
        {
            List<AreasTitles> DBlist = new List<AreasTitles>();
            Validaionslist.ForEach(a => DBlist.Add(convertDTOsetToDB(a)));
            return DBlist;
        }
    }
}
