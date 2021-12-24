using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
namespace DTO
{
   public class CriterionsTitlesDTO
    {
        public CriterionsTitlesDTO(short CriterionsTitleCode, string Title)
        {
            this.Code = CriterionsTitleCode;
            this.Name = Title;
        }
        public short Code { get; set; }
        public string Name { get; set; }
        public static CriterionsTitlesDTO convertDBsetToDTO(CriterionsTitles CriterionsTitles)
        {
            return new CriterionsTitlesDTO(CriterionsTitles.CriterionsTitleCode, CriterionsTitles.Title);
        }
        public static List<CriterionsTitlesDTO> convertDBsetToDTO(List<CriterionsTitles> CriterionsTitlesList)
        {
            List<CriterionsTitlesDTO> DTOlist = new List<CriterionsTitlesDTO>();
            CriterionsTitlesList.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
    }
}
