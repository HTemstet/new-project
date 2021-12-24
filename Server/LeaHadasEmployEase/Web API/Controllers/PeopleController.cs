using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using BLL.Data_management;
using DTO;
namespace Web_API.Controllers
{
    [RoutePrefix("api/People")]
    public class PeopleController : ApiController
    {
        //בדיקת מייל וסיסמה קבועה של משתמש והחזרת המשתמש אם נמצא מתאים
        [Route("ExistsPeoplePassword")]
        public IHttpActionResult PostExistsPeoplePassword(PeopleDTO p)
        {
            return Ok(new PeopleBLL().checkpeoplePassword(p.Email, p.PeoplePassword));
        }
        //בדיקת מייל וסיסמה זמנית של משתמש
        [Route("ExistsPeopleTempPassword")]
        public IHttpActionResult PostExistsPeopleTempPassword(PeopleDTO p)
        {
            return Ok(new PeopleBLL().checkpeopleTempPassword(p.Email, p.PeoplePassword));
        }
        //שינוי סיסמה זמנית לקבועה
        [Route("changePassword")]
        public IHttpActionResult PostchangePassword(PeopleDTO p)
        {
            return Ok(new PeopleBLL().changePassword(p.Email,p.TempPassword,p.PeoplePassword));
        }
        //שינוי פרטים אישיים ופרטי אימות של משתמש מסוים
        [Route("PutPeopleDetails")]
        public void PutPeopleDetails(PeopleDTO p)
        {
             new PeopleBLL().setPeopleDetails(p);
        }
        //החזרת רשימת הלוגואים של מעסיקים באתר, והפניה לאתר שלהם- באם קיים אתר כזה
        [Route("GetLogosAndSites")]
        public IHttpActionResult GetLogosAndSites()
        {
            return Ok(new PeopleBLL().GetLogosAndSites());
        }
        //קבלת לוגו של מעסיק מסוים
        [Route("GetPeopleLogo/{Code}")]
        public IHttpActionResult GetPeopleLogo(short Code)
        {
            return Ok(new PeopleBLL().GetPeopleLogo(Code));
        }
        //קבלת קורות חיים של עובד מסוים
        [Route("GetCVByPeople/{Code}")]
        public IHttpActionResult GetCVByPeople(short Code)
        {
            return Ok(new PeopleBLL().GetPeopleCV(Code));
        }
        //בחירת לוגו וקורות חיים של משתמש מסוים
        [Route("PostFile/{PeopleCode}/{FolderName}")]
        public void PostFile(short PeopleCode, string FolderName)
        {
            //אובייקט המכיל את מאפייני בקשת הלקוח
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                //הנתיב לשמירת הקובץ
                string subPath = "~/Files/" + PeopleCode + "/" + FolderName;
                //בדיקה האם קיימת תיקיה על שם זה בפרויקט
                bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath(subPath));
                //יצירת תיקיה מתאימה אם אינה קיימת עדיין
                if (!exists)
                    System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath(subPath));
                //גישה לקובץ שנשלח מהלקוח
                var postedFile = httpRequest.Files["uploadFile"];
                //שמירת הקובץ בתיקיה הרצויה
                postedFile.SaveAs(HttpContext.Current.Server.MapPath(subPath + "/" + postedFile.FileName));
                //שמירת נתיב הקובץ במסד הנתונים
                new PeopleBLL().SaveProphilInDB(PeopleCode, FolderName, postedFile.FileName);
            }
        }
        //מחיקת לוגו, קורות חיים של של משתמש מסוים
        [Route("RemoveFile/{PeopleCode}/{FolderName}")]
        public void DeleteFile(short PeopleCode, string FolderName)
        {
            new PeopleBLL().RemoveProphil(PeopleCode, FolderName);
        }
        //שמירת קישור לאתר ואודות העסק של משתמש מסוים
        [Route("SaveSiteLinkandAbout")]
        public void PostSaveSiteLinkandAbout(PeopleDTO surf)
        {
            //שמירת קישור לאתר ואודות העסק במסד הנתונים
            new PeopleBLL().SaveSiteLinkandAbout(surf.Code, surf.SiteLink, surf.About);
        }
    }
}
