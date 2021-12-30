using BLL.Logical_calculations;
using DAL;
using DTO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BLL.Data_management
{
   public static class SendEmail
    {
        //שליחת מייל עם התוכן הרצוי השמור באוביקט המתקבל כפרמטר
        public static void SendEmailtoClient(string Email, string subject, string Send, string Attachment = "")
        {
            //יצירת אוביקט MailMessage
            MailMessage mail = new MailMessage();
            //למי לשלוח (יש אפשרות להוסיף כמה נמענים) 
            mail.To.Add(Email);
            //כתובת מייל לשלוח ממנה
            mail.From = new MailAddress("JOBBA.LH@gmail.com");
            // נושא ההודעה
            mail.Subject = subject;
            //תוכן ההודעה ב- HTML
            mail.Body = Send.Replace("\n", "<br />");
            if (Attachment != string.Empty)
            {
                string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, $"Files\\{Attachment}");
                mail.Attachments.Add(new Attachment(path));
            }
            //הגדרת תוכן ההודעה ל - HTML 
            mail.IsBodyHtml = true;
            // Smtp יצירת אוביקט 
            SmtpClient smtp = new SmtpClient("smtp.gmail.com");
            //SmtpServer.Port = 25;
            //הגדרת פרטי הכניסה לחשבון גימייל
            smtp.Credentials = new System.Net.NetworkCredential("JOBBA.LH@gmail.com", "LH9637!!");
            //אפשור SSL (חובה(
            smtp.EnableSsl = true;
            //שליחת ההודעה
            try
            {
                smtp.Send(mail);
            }
            catch(Exception x)
            {
                Console.WriteLine("Error occured while sending an email"+x);
            }
        }



        static CancellationTokenSource m_ctSource;
        public static void RunPrepareDaily(DateTime date)//מקבלת תאריך מדויק
        {
            JOBBAEntities db = new JOBBAEntities();
            m_ctSource = new CancellationTokenSource();
            var dateNow = DateTime.Now;
            TimeSpan ts;//אובייקט שמייצג את מרווח הזמן שנותר עד להפעלת התהליך
            if (date > dateNow)
                ts = date - dateNow;
            else//אם התאריך המבוקש עבר כבר-מקדם אותו למועד הבא
            {
                date = date.AddDays(1);//במקרה שלנו- קידום התאריך ביום(יכול להיות גם הוספת דקות/שעות)
                ts = date - dateNow;
            }
            //שימתין את פרק הזמן שנקבע, ואח"כ יקרא לפונקציה שרצינו שתופעל פעם ב... threadהפעלת ה 
            Task.Delay(ts).ContinueWith((x) =>
            {
                //קריאה לפונקציה המבוקשת
                Requests_FullDTO.convertDBsetToDTO(db.Requests.ToList()).Where(t => t.SendingJobOffersOnceaDay == true).ToList()
                .ForEach(
                    a => {
                        List<Requests_FullDTO> ljo = JobOffers.GetFittingOffers(a);
                        if (ljo.Count > 0)
                            SendEmailtoClient(PeopleDTO.convertDBsetToDTO(db.People.ToList()).Find(b => b.Code == a.PeopleCode).Email, $" נמצאו {ljo.Count} משרות חדשות עבורך ",
                               //כאן ישלח קוד HTML שיכיל את האוביטים הנשלחים כרגע
                               string.Join("<br><br>", ljo.Select(b => $@"<div style='text-align: right;margin-right: 150px;font-size: 18px;'>
                      <h1>פרטי המשרה</h1><br><br>
                      <label>שם משרה: { b.RequestOfferDetails.Name}</label><br>
                      <label>תאור משרה: { b.RequestOfferDetails.OfferDescription}</label><br>
                      <label>מיקום: { b.Place}</label><br>
                      <label>מס' דקות נסיעה: { b.EmployTravelTime}</label><br>
                      <label>פרטים נוספים: { b.RequestOfferDetails.MoreDetails}</label><br>
                      <a href='http://localhost:4200/joboffers?JobID=" + b.RequestCode + "'>צור קשר</a><br>" +
                                "<a href='http://localhost:4200/basicsearch/request/" + b.RequestCode + "'>הסר</a></div>")));
                    });
                RunPrepareDaily(date);//קריאה חוזרת לפונקציה...
            }, m_ctSource.Token);

        }
        public static void SendingJobOffersWheneverThereIsaSuitableOffer(Requests_FullDTO req ,Requests_FullDTO offer)
        {
            JOBBAEntities db = new JOBBAEntities();
            SendEmailtoClient(PeopleDTO.convertDBsetToDTO(db.People.ToList()).Find(b => b.Code == req.PeopleCode).Email, $" מעסיק העלה ברדע זה משרה חמה עברך! ",
   //כאן ישלח קוד HTML שיכיל את האוביטים הנשלחים כרגע
   $@"<br><br><div style='text-align: right;margin-right: 150px;font-size: 18px;'>
                      <h1>פרטי המשרה</h1><br><br>
                      <label>שם משרה: { offer.RequestOfferDetails.Name}</label><br>
                      <label>תאור משרה: { offer.RequestOfferDetails.OfferDescription}</label><br>
                      <label>מיקום: { offer.Place}</label><br>
                      <label>מס' דקות נסיעה: { offer.EmployTravelTime}</label><br>
                      <label>פרטים נוספים: { offer.RequestOfferDetails.MoreDetails}</label><br>
                      <a href='http://localhost:4200/joboffers?JobID=" + offer.RequestCode + "'>צור קשר</a><br>" +
    "<a href='http://localhost:4200/basicsearch/request/" + offer.RequestCode + "'>הסר</a></div>");
        }
    }
}
