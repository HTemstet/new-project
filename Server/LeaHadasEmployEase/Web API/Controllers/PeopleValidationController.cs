using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BLL.Data_management;
using DTO;
namespace Web_API.Controllers
{
    [RoutePrefix("api/PeopleValidation")]
    public class PeopleValidationController : ApiController
    {
        //הגרלת מספר רצוי של פרטי אימות למשתמש ששכח סיסמא
        [Route("getRandomValidations")]
        public IHttpActionResult getRandomValidations()
        {
            return Ok(new PeopleValidationsBLL().getRandomofPeopleValidation());
        }
        //קבלת כל פרטי האימות למשתמש חדש
        [Route("getAllValidations")]
        public IHttpActionResult getAllValidations()
        {
            return Ok(new PeopleValidationsBLL().getAllPeopleValidation());
        }
        //בדיקת אימות פרטים למשתמש ששכח סיסמה
        [Route("ValidPeople")]
        public IHttpActionResult PostValidPeople(PeopleDTO EmailandPeopleValidationList)
        {
            return Ok(new PeopleValidationsBLL().checkpeoplevallidation(EmailandPeopleValidationList));
        }
        //הוספת משתמש חדש למאגר, תוך שמירת פרטי האימות שלו
        [Route("AddNewPeople")]
        public IHttpActionResult PostAddNewPeople(PeopleDTO EmailandPeopleValidationList)
        {
           return Ok(new PeopleValidationsBLL().AddPeople(EmailandPeopleValidationList));
        }
       
        [Route("GetPeopleValidation/{PeopleCode}")]
        public IHttpActionResult GetPeopleValidation(short PeopleCode)
        {
            return Ok(new PeopleValidationsBLL().GetPeopleValidation(PeopleCode));
        }
       
        [Route("SavePeopleValidations")]
        public void PostSavePeopleValidations(List<PeopleValidationDTO> SurfValidations)
        {
            new PeopleValidationsBLL().SavePeopleValidations(SurfValidations);
        }
    }
}
