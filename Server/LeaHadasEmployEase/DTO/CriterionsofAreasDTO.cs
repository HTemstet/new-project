using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
namespace DTO
{
    //
    public class CriterionsofAreasDTO
    {
        public  CriterionsofAreasDTO(){}
        public CriterionsofAreasDTO(short CriterionofAreaCode, Nullable<short> CriterionCode,
           Nullable<short> CriterionsTitleCode,string Name, Nullable<short> CriterionsType,
           ComparisionOperators ComparisionOperator,
           Nullable<short> AreaCode, string FeildValidation, string PatternErrorMessage)
        {
            this.CriterionofAreaCode = CriterionofAreaCode;
            this.CriterionCode = CriterionCode;
            this.CriterionsTitleCode = CriterionsTitleCode;
            this.Name = Name;
            this.CriterionsType = CriterionsType;
            this.ComparisionOperator = ComparisionOperator;
            this.AreaCode = AreaCode;
            this.FeildValidation = FeildValidation;
            this.PatternErrorMessage = PatternErrorMessage;
            CriterionsofAreasTree = new List<CriterionsofAreasDTO>();
        }
        public short CriterionofAreaCode { get; set; }
        public Nullable<short> CriterionCode { get; set; }
        public Nullable<short> CriterionsTitleCode { get; set; }
        public string Name { get; set; }
        public Nullable<short> CriterionsType { get; set; }
        public ComparisionOperators ComparisionOperator { get; set; }
        public Nullable<short> AreaCode { get; set; }
        public string FeildValidation { get; set; }
        public string PatternErrorMessage { get; set; }
        public List<CriterionsofAreasDTO> CriterionsofAreasTree { get; set; }
        public static CriterionsofAreasDTO convertDBsetToDTO(CriterionsofAreas CriterionofArea)
        {
            return new CriterionsofAreasDTO(CriterionofArea.CriterionofAreaCode, CriterionofArea.CriterionCode,
             CriterionofArea.Criterions.CriterionsTitles.CriterionsTitleCode,
              CriterionofArea.Criterions.CriterionsName,
              CriterionofArea.Criterions.CriterionsType,
              (ComparisionOperators)CriterionofArea.Criterions.ComparisonOperator,
              CriterionofArea.AreaCode,CriterionofArea.FeildValidation, CriterionofArea.PatternErrorMessage);
        }
        public static List<CriterionsofAreasDTO> convertDBsetToDTO(List<CriterionsofAreas> CriterionsofAreaList)
        {
            List<CriterionsofAreasDTO> DTOlist = new List<CriterionsofAreasDTO>();
            CriterionsofAreaList.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
        public static CriterionsofAreas convertDTOsetToDB(CriterionsofAreasDTO CriterionofArea)
        {
            return new CriterionsofAreas() { CriterionofAreaCode = CriterionofArea.CriterionofAreaCode,
                CriterionCode = CriterionofArea.CriterionCode,
                AreaCode = CriterionofArea.AreaCode,
                FeildValidation = CriterionofArea.FeildValidation,
                PatternErrorMessage = CriterionofArea.PatternErrorMessage};
        }
        public static List<CriterionsofAreas> convertDTOsetToDB(List<CriterionsofAreasDTO> CriterionsofAreaList)
        {
            List<CriterionsofAreas> DBlist = new List<CriterionsofAreas>();
            CriterionsofAreaList.ForEach(a => DBlist.Add(convertDTOsetToDB(a)));
            return DBlist;
        }

    }
}
