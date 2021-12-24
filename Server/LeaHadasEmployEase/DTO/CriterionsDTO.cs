using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;

namespace DTO
{
    //אולי לשים את זה בדף נפרד למען הסדר הטוב (אולי יחד עם עוד אינומים - אם יהיו)
    public enum ComparisionOperators { BigEqual,Big,Equal,LessEqual,Less,And}
    public class CriterionsDTO
    {
        public CriterionsDTO() { }
        public CriterionsDTO(short CriterionCode, Nullable<short> CriterionsTitleCode,
            string CriterionsName, Nullable<short> CriterionsType, ComparisionOperators ComparisonOperator)
        {
            this.CriterionCode = CriterionCode;
            this.CriterionsTitleCode = CriterionsTitleCode;
            this.CriterionsName = CriterionsName;
            this.CriterionsType = CriterionsType;
            this.ComparisonOperator = ComparisonOperator;
        }
        public short CriterionCode { get; set; }
        public Nullable<short> CriterionsTitleCode { get; set; }
        public string CriterionsName { get; set; }
        public Nullable<short> CriterionsType { get; set; }
        public ComparisionOperators ComparisonOperator { get; set; }
        public static CriterionsDTO convertDBsetToDTO(Criterions Criterion)
        {
            return new CriterionsDTO(Criterion.CriterionCode, Criterion.CriterionsTitleCode,
                Criterion.CriterionsName,Criterion.CriterionsType,(ComparisionOperators)Criterion.ComparisonOperator);
        }
        public static List<CriterionsDTO> convertDBsetToDTO(List<Criterions> CriterionsList)
        {
            List<CriterionsDTO> DTOlist = new List<CriterionsDTO>();
            CriterionsList.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
        public static Criterions convertDTOsetToDB(CriterionsDTO Criterion)
        {
            return new Criterions() { CriterionCode = Criterion.CriterionCode,
                CriterionsName=Criterion.CriterionsName,
                CriterionsType = Criterion.CriterionsType,
                ComparisonOperator =(short?)Criterion.ComparisonOperator
            };
        }
        public static List<Criterions> convertDTOsetToDB(List<CriterionsDTO> Criterionslist)
        {
            List<Criterions> DBlist = new List<Criterions>();
            Criterionslist.ForEach(a => DBlist.Add(convertDTOsetToDB(a)));
            return DBlist;
        }
    }
}
