using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DTO;
using BLL.Data_management;
using BLL.Logical_calculations;

namespace Web_API.Controllers
{
    [RoutePrefix("api/Request")]
    public class RequestController : ApiController
    {
        [Route("getAllCriterionsTitles")]
        public IHttpActionResult getAllCriterionsTitles()
        {
            return Ok(new RequestBLL().getAllCriterionsTitles());
        }
        //קבלת רשימת קריטריונים לתחום מסוים, הרשימה כוללת התחשבות בתלויות על ידי שימוש במחלקות די טי או מכילות, וכן רשימת אנשים שעובדים או מעסיקים בתחום זה בהתאם לאופי בקשת המשתמש
        [Route("getCriterions/{AreaCode}/{Employee}")]
        public IHttpActionResult getCriterionsofAreas(short AreaCode, Nullable<bool> Employee)
        {
            return Ok(new RequestBLL().getCriterionsofAreas(AreaCode,Employee));
        }
        //שמירת הבקשה וקבלת הצעות עבודה מתאימות
        [Route("SavemyRequest")]
        public IHttpActionResult postSavemyRequest(Requests_FullDTO request)
        {
            return Ok(new RequestBLL().SavemyRequest(request));
        }
        //חיפוש מהיר
        [Route("QuickSearch/{AreaCode}/{AreaTitleCode}/{Place}/{Minutes}/{FreeText}")]
        public IHttpActionResult GetQuickSearch(short AreaCode,string AreaTitleCode, string Place, short Minutes, string FreeText)
        {
            return Ok(new RequestBLL().QuickSearch(AreaCode, AreaTitleCode, Place, Minutes, FreeText));
        }
        //חיפוש עפ"י חברה
        [Route("CompanySearch/{Company}")]
        public IHttpActionResult GetCompanySearch(string Company)
        {
            return Ok(new RequestBLL().CompanySearch(Company));
        }
        //שליפת מחרוזות ממשרות קיימות לחיפוש 
        [Route("GetFreeList")]
        public IHttpActionResult GetFreeList()
        {
            return Ok(new RequestBLL().GetFreeList());
        }
        //קבלת בקשה מסוימת עפי קוד איש- לצורך תצוגת החיפושים למשתמש
        [Route("GetRequestsByPeople/{PeopleCode}/{Employee}")]
        public IHttpActionResult GetRequestsByPeople(short PeopleCode,bool Employee)
        {
            return Ok(new RequestBLL().GetRequestsByPeople(PeopleCode, Employee));
        }
        //בדיקת מרחקים בגוגל
        [Route("GetTravelTime")]
        public IHttpActionResult GetTravelTime(Requests_FullDTO request)
        {
            //return Ok(JobOffers.GetTravelTime("Antwerpen Airport", "Antwerpen"));
            return Ok(JobOffers.GetTravelTime("Jerusalem", "Tel-Aviv"));
        }
    }
}
