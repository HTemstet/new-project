using BLL.Data_management;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Logical_calculations
{
    public class JobOfferEmail
    {
        public string Email { get; set; }
        //כאן יהיה לכאורה string שיכיל את התוכן הרצוי ולאו דווקא object 
        public string PreliminaryLetter { get; set; }
        public string CV { get; set; }
        public void SendOfferEmail(string Area)
        {
            SendEmail.SendEmailtoClient(Email,$"הודעה מעובד רלוונטי לגבי משרה שפרסמת בתחום {Area}", PreliminaryLetter,CV);
        }
    }
}
