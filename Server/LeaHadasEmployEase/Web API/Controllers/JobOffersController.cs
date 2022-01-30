using BLL.Data_management;
using BLL.Logical_calculations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Web_API.Controllers
{
    [RoutePrefix("api/JobOffers")]
    public class JobOffersController : ApiController
    {
        //שליחת אימייל למעסיק עם קורות חיים או מידע אחר וכן שמירת הפניה במסד הנתונים
        [Route("SendOfferEmail/{Area}/{PeoppleCode}/{RequestCode}")]
        public void PostSendOfferEmail(short? Area,short? PeoppleCode,short? RequestCode,JobOfferEmail JobOfferEmail)
        {
            new JobsAppliedForBLL().AddJobsAppliedFor(PeoppleCode,RequestCode);
            JobOfferEmail.SendOfferEmail(Area, RequestCode);
        }
    }
}
