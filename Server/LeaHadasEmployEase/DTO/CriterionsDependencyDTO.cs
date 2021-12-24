using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
namespace DTO
{
    public class CriterionsDependencyDTO
    {
        public  CriterionsDependencyDTO(){}
        public CriterionsDependencyDTO(short CriterionsDependencyCode, Nullable<short> CriterionofAreaCode1,
         Nullable<short> CriterionofAreaCode2, Nullable<short> AreaCode)
        {
            this.CriterionsDependencyCode = CriterionsDependencyCode;
            this.CriterionofAreaCode1 = CriterionofAreaCode1;
            this.CriterionofAreaCode2 = CriterionofAreaCode2;
            this.AreaCode = AreaCode;
        }
        public short CriterionsDependencyCode { get; set; }
        public Nullable<short> CriterionofAreaCode1 { get; set; }
        public Nullable<short> CriterionofAreaCode2 { get; set; }
        public Nullable<short> AreaCode { get; set; }
        public static CriterionsDependencyDTO convertDBsetToDTO(CriterionsDependency CriterionsDependency)
        {
            return new CriterionsDependencyDTO(CriterionsDependency.CriterionsDependencyCode,
                CriterionsDependency.CriterionofAreaCode1,
                CriterionsDependency.CriterionofAreaCode2,
               (CriterionsDependency.CriterionsofAreas!=null)? CriterionsDependency.CriterionsofAreas.AreaCode
               : CriterionsDependency.CriterionsofAreas1.AreaCode);
        }
        public static List<CriterionsDependencyDTO> convertDBsetToDTO(List<CriterionsDependency> CriterionsDependencyList)
        {
            List<CriterionsDependencyDTO> DTOlist = new List<CriterionsDependencyDTO>();
            CriterionsDependencyList.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
        public static CriterionsDependency convertDTOsetToDB(CriterionsDependencyDTO CriterionsDependency)
        {
            return new CriterionsDependency() {
                CriterionsDependencyCode = CriterionsDependency.CriterionsDependencyCode,
                CriterionofAreaCode1 = CriterionsDependency.CriterionofAreaCode1,
                CriterionofAreaCode2 = CriterionsDependency.CriterionofAreaCode2
            };
        }
        public static List<CriterionsDependency> convertDTOsetToDB(List<CriterionsDependencyDTO> CriterionsDependencyList)
        {
            List<CriterionsDependency> DBlist = new List<CriterionsDependency>();
            CriterionsDependencyList.ForEach(a => DBlist.Add(convertDTOsetToDB(a)));
            return DBlist;
        }
    }
}
