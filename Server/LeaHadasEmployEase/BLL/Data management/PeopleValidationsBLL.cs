using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using DTO;
using System.Data.Entity;

namespace BLL.Data_management
{
    public  class PeopleValidationsBLL
    {
        public JOBBAEntities db = new JOBBAEntities();
        //מספר פרטי האימות הרצוי להגרלה
        const short N = 2;
        //הגרלת פרטי אימות למשתמש ששכח סיסמה
        public  List<ValidationsDTO> getRandomofPeopleValidation()
        {
            //מופע המאפשר הגרלות מספרים שונים
            Random r = new Random();
            //רשימת פרטי האימות הקיימים במאגר
            List<ValidationsDTO> lpv = ValidationsDTO.convertDBsetToDTO(db.Validations.ToList());
            //רשימת פרטי האימות שיוחזרו לאחר ההגרלה
            List<ValidationsDTO> lpvtosend = new List<ValidationsDTO>();
            //רשימה לשמירת קוד פרטי האימות שכבר הוגרלו על מנת שלא יוחזר אותו פרט אימות יותר מפעם אחת ותיווצר כפילות 
            List<short> i = new List<short>();
            //מעבר בלולאה כל עוד לא נכנס מספר פרטי האימות הרצוי לרשימת פרטי האימות שיוחזרו 
            while (lpvtosend.Count() < N)
            {
                //הגרלת פרט אימות מרשימת פרטי האימות הקיימים במאגר 
                ValidationsDTO v = lpv[r.Next(0, lpv.Count)];
                //בדיקה האם פרט אימות זה לא הוגרל עדיין
                if (i.IndexOf(v.Code) == -1)
                {
                    //הוספת פרט האימות שהוגרל לרשימת פרטי האימות שיוחזרו
                    lpvtosend.Add(v);
                    //הוספה לרשימת הקודים של פרטי האימות שכבר הוגרלו לצורך מניעת החזרת פרטי אימות כפולים
                    i.Add(v.Code);
                }
            }
            return lpvtosend;
        }
        //החזרת כל פרטי האימות למשתמש חדש
        public List<ValidationsDTO> getAllPeopleValidation()
        {
            return ValidationsDTO.convertDBsetToDTO(db.Validations.ToList());
        }
        //הגרלת סיסמה זמנית למשתמש ששכח סיסמה או משתמש חדש
        public string getRandom()
        {
            //סוג התוים המוגרלים
            const string valid = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890()!#*&^%$";
            StringBuilder res = new StringBuilder();
            //מופע המאפשר הגרלות מספרים שונים
            Random rnd = new Random();
            //אורך הסיסמה המוגרלת
            int length = 8;
            while (0 < length--)
            {
                res.Append(valid[rnd.Next(valid.Length)]);
            }
            return res.ToString();
        }
        //בדיקת פרטי אימות למשתמש ששכח סיסמה ושליחת סיסמה זמנית במקרה והפרטים תקינים
        public bool checkpeoplevallidation(PeopleDTO EmailandPeopleValidationList)
        {
           //בדיקת נכונות פרטי האימות שהוגרלו, ושמירת המשתמש המתאים אם נמצא
            PeopleDTO i = PeopleDTO.convertDBsetToDTO(db.People.ToList()).
              Find(x=> EmailandPeopleValidationList.PeopleValidation.Where(y=>x.PeopleValidation.ToList().
              Find(z=>z.Code== y.Code&& z.Name == y.Name)!=null).Count()==N);
            //בדיקה האם נמצא משתמש מתאים 
            if (i != null)
            {
                //שמירת הסיסמה הזמנית המוגרלת למשתמש על ידי פניה לפונקצית הגרלת סיסמה המתאים לצורך זיהוי בכניסה עם סיסמה זו
                i.TempPassword = getRandom();
                //חיפוש השורה המתאימה במסד נתונים ושינויה בהתאם לשינוי באוביקט הדי טי או כך שנוגעים בשדה המפתח 
                //הראשי של טבלת המסד בלבד לצורך בידוד השכבות בצורה המקסימלית
                db.Entry(db.People.Find(i.Code)).CurrentValues.SetValues(PeopleDTO.convertDTOsetToDB(i));
                db.SaveChanges();
                //פניה לפונקציה השולחת מייל למשתמש עם הסיסמה הזמנית, על פי כתובת המייל שהכניס בפרטי האימות
                SendEmail.SendEmailtoClient(EmailandPeopleValidationList.Email,"סיסמה להתחברות JOBBA", i.TempPassword);
                return true;
            }
            return false;
        }
        //בדיקת האם משתמש כבר קיים, שמירתו במאגר ושליחת סיסמה זמנית במקרה והוא חדש
        public bool AddPeople(PeopleDTO EmailandPeopleValidationList)
        {
            //בדיקה האם שם המשתמש, הסיסמה והמייל של המשתמש עוד לא מופיעים במאגר
            if (PeopleDTO.convertDBsetToDTO(db.People.ToList())
                .Find(x =>x.Email== EmailandPeopleValidationList.Email) ==null)
            {
                //שמירת הסיסמה הזמנית המוגרלת למשתמש החדש על ידי פניה לפונקצית הגרלת סיסמה המתאים לצורך זיהוי בכניסה עם סיסמה זו
                EmailandPeopleValidationList.TempPassword = getRandom();
                //הוספת האיש למאגר ושמירת הקוד שלו לצורך שמירתו בפרטי האימות לאיש
                db.People.Add(PeopleDTO.convertDTOsetToDB(EmailandPeopleValidationList));
                db.SaveChanges();
                //פניה לפונקציה השולחת מייל למשתמש עם הסיסמה הזמנית, על פי כתובת המייל שהכניס בפרטי האימות
                SendEmail.SendEmailtoClient(EmailandPeopleValidationList.Email, "סיסמה להתחברות JOBBA", EmailandPeopleValidationList.TempPassword);
                return true;
            }
            return false;
        }
        public List<PeopleValidationDTO> GetPeopleValidation(short PeopleCode)
        {
            return PeopleValidationDTO.convertDBsetToDTO(db.PeopleValidation.ToList()).Where(
                x => x.PeopleCode == PeopleCode).ToList();
        }
        public void SavePeopleValidations(List<PeopleValidationDTO> PeopleValidationsList)
        {
            PeopleValidationsList.ForEach(x =>
            db.Entry(db.PeopleValidation.Find(x.PeopleValidationCode)).CurrentValues.SetValues(PeopleValidationDTO.convertDTOsetToDB(x))
            );
            db.SaveChanges();
        }
    }
}
