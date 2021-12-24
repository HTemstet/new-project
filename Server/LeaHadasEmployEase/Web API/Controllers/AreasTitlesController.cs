using BLL.Data_management;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Web_API.Controllers
{
    [RoutePrefix("api/AreasTitles")]
    public class AreasTitlesController : ApiController
    {
        //קבלת התחומים הקיימים במאגר לצורך הוספת תחום או בחירת תחום לבקשה מסוימת
        [Route("getAreasTitles/{AreaCode}")]
        public IHttpActionResult getAreasTitles(short AreaCode)
        {
            return Ok(new AreasTitles().getAllAreasTitles(AreaCode));
        }
    }
}
