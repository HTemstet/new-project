using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BLL.Data_management;
namespace Web_API.Controllers
{
    [RoutePrefix("api/Area")]
    public class AreaController : ApiController
    {
        //קבלת התחומים הקיימים במאגר לצורך הוספת תחום או בחירת תחום לבקשה מסוימת
        [Route("getAllAreas")]
        public IHttpActionResult getAllAreas()
        {
            return Ok(new AreasBLL().getAllAreas());
        }
    }
}
