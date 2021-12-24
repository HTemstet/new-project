using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BLL.Data_management;

namespace Web_API.Controllers
{
    [RoutePrefix("api/JobsManagement")]
    public class JobsManagementController : ApiController
    {
        //
        [Route("getJobsAppliedbyPeople/{PeopleCode}")]
        public IHttpActionResult GetJobsAppliedbyPeople(short PeopleCode)
        {
            return Ok(new JobsAppliedForBLL().GetJobsAppliedbyPeople(PeopleCode));
        }
    }
}
