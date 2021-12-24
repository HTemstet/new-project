using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO;
using DAL;
using System.IO;

namespace BLL.Data_management
{
  public class PeopleBLL
    {
        public JOBBAEntities db = new JOBBAEntities();
        const short LogosNumber = 16;
        //בדיקת שם משתמש וסיסמה קבועה
        public  PeopleDTO checkpeoplePassword(string Email, string Password)
        {
            //החזרת השורה המתאימה, לאחר המרת אוביקטי האנשים מטיפוס די בי קונטקסט לטיפוס די טי או
            return PeopleDTO.convertDBsetToDTO(db.People.ToList()).Find(
                x => x.Email == Email && x.PeoplePassword == Password);
        }
        //זיהוי שם משתמש וסיסמה זמנית
        public  bool checkpeopleTempPassword(string Email, string Password)
        {
            //בדיקת השורה המתאימה, לאחר המרת אוביקטי האנשים מטיפוס די בי קונטקסט לטיפוס די טי או
            return PeopleDTO.convertDBsetToDTO(db.People.ToList()).Find(
                x => x.Email == Email && x.TempPassword == Password) !=null;
        }
        //החלפת סיסמה זמנית לקבועה והחזרת המשתמש
        public  PeopleDTO changePassword(string Email, string TempPassword, string PeoplePassword)
        {
            //מציאת השורה המתאימה, לאחר המרת אוביקטי האנשים מטיפוס די בי קונטקסט לטיפוס די טי או
            PeopleDTO P =PeopleDTO.convertDBsetToDTO(db.People.ToList()).Find(x =>x.Email == Email &&
            x.TempPassword == TempPassword);
            //בדיקת נכונות פרטי האימות
            if(P!=null)
            {
                //עדכון סיסמה קבועה
                P.PeoplePassword = PeoplePassword;
                //איפוס סיסמה זמנית
                P.TempPassword = null;
                //חיפוש השורה המתאימה במסד נתונים ושינויה בהתאם לשינוי באוביקט הדי טי או כך שנוגעים בשדה המפתח הראשי של טבלת המסד בלבד לצורך בידוד השכבוד בצורה המקסימלית
                db.Entry(db.People.Find(P.Code)).CurrentValues.SetValues(PeopleDTO.convertDTOsetToDB(P));
                db.SaveChanges();
                return P;
            }
            return null;
        }
        //שינוי פרטי איש מסוים
        public void setPeopleDetails(PeopleDTO p)
        {
            //חיפוש השורה המתאימה במסד נתונים ושינויה בהתאם לשינוי באוביקט הדי טי או
            //כך שנוגעים בשדה המפתח הראשי של טבלת המסד בלבד לצורך בידוד השכבות בצורה המקסימלית
            db.Entry(db.People.Find(p.Code)).CurrentValues.SetValues(PeopleDTO.convertDTOsetToDB(p));
            db.SaveChanges();
        }
        //החזרת רשימת הלוגואים של מעסיקים באתר, והפניה לאתר שלהם- באם קיים אתר כזה
        public Dictionary<string,string> GetLogosAndSites()
        {
            List<PeopleDTO> lp = PeopleDTO.convertDBsetToDTO(db.People.ToList()).Where(a => a.Logo != string.Empty && a.Logo != null).ToList();
            //רשימת התמונות שיוחזרו מהפונקציה
            Dictionary<string, string> d = new Dictionary<string, string>();
            short logos_number = LogosNumber;
            if (lp.Count < LogosNumber)
                logos_number = (short)lp.Count();
            //מופע המאפשר הגרלות מספרים שונים
            Random r = new Random();
            //רשימה לשמירת קוד לוגואים שכבר הוחזרו 
            List<short> i = new List<short>();
            //מעבר בלולאה כל עוד לא נכנס מספר התמונות הרצוי לרשימת התמונות שיוחזרו 
            while (d.Count < logos_number)
            {
                //הגרלת שורה מרשימת האנשים 
                var a = lp[r.Next(0, lp.Count())];
                //בדיקה האם נלקח משורה זו לוגו
                if (i.IndexOf(a.Code) == -1)
                {
                    //הגרלת פרסומת אחת מרשימת הפרסומות לתחום איש מסוים והוספה לרשימה המוחזרת בתוספת הנתיב לצורך הצגת התמונה השמורה בשרת
                    d[a.Code + "/Logo/" + a.Logo] = a.SiteLink;
                    //הוספת השורה לרשימת השורות שכבר נלקח מהם לוגו או אין בהם לוגו
                    i.Add(a.Code);
                }
            }
            return d;
        }

        //הבאת לוגו של איש מסוים
        public string GetPeopleLogo(short pCode)
        {
            PeopleDTO p = PeopleDTO.convertDBsetToDTO(db.People.ToList())
                   .Find(x => x.Code == pCode);
            if (p.Logo == null)
                return null;
            //החזרת קורות החיים בתוספת נתיב לצורך הצגת הקובץ השמור בשרת
            return p.Code + "/Logo/" + p.Logo;
        }
        //הבאת קו"ח של איש מסוים
        public string GetPeopleCV(short pCode)
        {
            PeopleDTO p = PeopleDTO.convertDBsetToDTO(db.People.ToList())
                   .Find(x => x.Code == pCode);
            if (p.CV == null)
                return null;
            //החזרת קורות החיים בתוספת נתיב לצורך הצגת הקובץ השמור בשרת
            return p.Code + "/CV/" + p.CV;
        }
        //שמירת לוגו או קו"ח או לינק לאתר או המלצה לאיש בתחום מסוים
        public void SaveProphilInDB(short pCode, string kind, string change)
        {
            //שליפת התחום לאיש מסוים לצורך שינוי אחד השדות בתחום זה
            PeopleDTO p = PeopleDTO.convertDBsetToDTO(db.People.ToList())
                .Find(x => x.Code == pCode);
            //בדיקת שדה השינוי הרצוי
            switch (kind)
            {
                //שמירת לוגו שנבחר במסד ומחיקת לוגו קודם מהשרת, אם היה כזה
                case "Logo":
                    if (p.Logo != null)
                        RemoveFile(p, kind, p.Logo);
                    p.Logo = change;
                    break;
                //שמירת קו"ח שנבחרו במסד ומחיקת קו"ח קודמים מהשרת, אם היו כאלה
                case "CV":
                    if (p.CV != null)
                        RemoveFile(p, kind, p.CV);
                    p.CV = change;
                    break;
                //הוספת המלצה
                case "About":
                    p.About = change;
                    break;
                case "SiteLink":
                    p.SiteLink = change;
                    break;
            }
            //חיפוש השורה המתאימה במסד נתונים ושינויה בהתאם לשינוי באוביקט הדי טי או כך שנוגעים בשדה המפתח הראשי של טבלת המסד בלבד לצורך בידוד השכבוד בצורה המקסימלית
            db.Entry(db.People.Find(p.Code)).CurrentValues.SetValues(PeopleDTO.convertDTOsetToDB(p));
            db.SaveChanges();
        }
        //מחיקת לינק לאתר או המלצה או לוגו או קורות חיים
        public void RemoveProphil(short pCode, string kind)
        {
            //שליפת התחום לאיש מסוים לצורך מחיקת אחד מערכי השדות בתחום זה
            PeopleDTO p = PeopleDTO.convertDBsetToDTO(db.People.ToList())
                .Find(x => x.Code == pCode);
            //בדיקת שדה המחיקה הרצוי
            switch (kind)
            {
                case "Logo":
                    RemoveFile(p, kind, p.Logo);
                    p.Logo = null;
                    break;
                default:
                    RemoveFile(p, kind, p.CV);
                    p.CV = null;
                    break;
            }
            //חיפוש השורה המתאימה במסד נתונים ושינויה בהתאם לשינוי באוביקט הדי טי או
            //כך שנוגעים בשדה המפתח הראשי של טבלת המסד בלבד לצורך בידוד השכבוד בצורה המקסימלית
            db.Entry(db.People.Find(p.Code)).CurrentValues.SetValues(PeopleDTO.convertDTOsetToDB(p));
            db.SaveChanges();
        }
        public void RemoveFile(PeopleDTO p, string kind, string delete)
        {
            string subPath = "Files\\" + p.Code + "\\" + kind + "\\" + delete;
            string path = AppDomain.CurrentDomain.BaseDirectory + subPath;
            if (System.IO.File.Exists(path))
            {
                try
                {
                    System.IO.File.Delete(path);
                }
                catch (System.IO.IOException e)
                {
                    Console.WriteLine(e.Message);
                    return;
                }
            }
        }
        public void SaveSiteLinkandAbout(short peopleCode, string siteLink, string about)
        {
            PeopleDTO p = PeopleDTO.convertDBsetToDTO(db.People.ToList())
                .Find(x => x.Code == peopleCode);
            //עדכון השדות הרצויים
            p.SiteLink = siteLink;
            p.About = about;
            //חיפוש השורה המתאימה במסד נתונים ושינויה בהתאם לשינוי באוביקט הדי טי או
            //כך שנוגעים בשדה המפתח הראשי של טבלת המסד בלבד לצורך בידוד השכבוד בצורה המקסימלית
            db.Entry(db.People.Find(p.Code)).CurrentValues.SetValues(PeopleDTO.convertDTOsetToDB(p));
            db.SaveChanges();
        }
    }
}
