using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
namespace DTO
{
    //מחלקה עליה יערכו החישובים על קריטריונים לבקשות כשלא צריך לנגוע גם בבקשה הבסיסית שלהם לצורך מניעת ניפוח הנתונים
    //כמו למשל בבדיקת רמת ההתאמה של הקריטריונים לבקשה מסוימת מבלי להשתמש כל הזמן באוביקט נפוח המכיל גם את תחום הבקשה
    //קוד האיש של הבקשה וכו' לאחר שכבר יודעים(על ידי בדיקה קודמת עם שימוש בטבלת רקווסט די טי או) שזה מתאים לבקשה הרצויה ועוד
    public class CriterionsofRequestsDTO
    {
        public  CriterionsofRequestsDTO(){}
        public CriterionsofRequestsDTO(short CriterionsofRequestsCode, Nullable<short> RequestCode,
           Nullable<short> CriterionofAreaCode, string ValueofCriterion, Nullable<short> LevelofImportance)
        {
            this.CriterionsofRequestsCode = CriterionsofRequestsCode;
            this.RequestCode = RequestCode;
            this.CriterionofAreaCode = CriterionofAreaCode;
            this.ValueofCriterion = ValueofCriterion;
            this.LevelofImportance = LevelofImportance;
        }
        public short CriterionsofRequestsCode { get; set; }
        public Nullable<short> RequestCode { get; set; }
        public Nullable<short> CriterionofAreaCode { get; set; }
        public string ValueofCriterion { get; set; }
        public Nullable<short> LevelofImportance { get; set; }
        //שורה זו נוספה בגלל שמירת הבקשה בצורת פירוק רקורסיבי- אולי כדאי לשנות
        public List<CriterionsofRequestsDTO> CriterionsofAreasTree { get; set; }
        public static CriterionsofRequestsDTO convertDBsetToDTO(CriterionsofRequests CriterionofRequest)
        {
            return new CriterionsofRequestsDTO(CriterionofRequest.CriterionsofRequestsCode, CriterionofRequest.RequestCode,
               CriterionofRequest.CriterionofAreaCode,
               CriterionofRequest.ValueofCriterion, CriterionofRequest.LevelofImportance);
        }
        public static List<CriterionsofRequestsDTO> convertDBsetToDTO(List<CriterionsofRequests> CriterionsofRequestList)
        {
            List<CriterionsofRequestsDTO> DTOlist = new List<CriterionsofRequestsDTO>();
            CriterionsofRequestList.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
        public static CriterionsofRequests convertDTOsetToDB(CriterionsofRequestsDTO CriterionofRequest)
        {
            return new CriterionsofRequests()
            {
                CriterionsofRequestsCode = CriterionofRequest.CriterionsofRequestsCode,
                RequestCode = CriterionofRequest.RequestCode,
                CriterionofAreaCode = CriterionofRequest.CriterionofAreaCode,
                ValueofCriterion = CriterionofRequest.ValueofCriterion,
                LevelofImportance = CriterionofRequest.LevelofImportance
            };
        }
        public static List<CriterionsofRequests> DBlist = new List<CriterionsofRequests>();
        public static List<CriterionsofRequests> convertDTOsetToDB(List<CriterionsofRequestsDTO> CriterionsofRequestList)
        {
            CriterionsofRequestList.ForEach(a => {
                DBlist.Add(convertDTOsetToDB(a));
                if(a.CriterionsofAreasTree!=null)
                  convertDTOsetToDB(a.CriterionsofAreasTree); });
            return DBlist;
        }

    }
}
