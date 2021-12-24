using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
namespace DTO
{
    //מחלקה עליה יערכו החישובים על בקשות כשלא צריך לנגוע גם בקריטריונים לבקשה שלהם לצורך מניעת ניפוח הנתונים
    //כמו למשל בהבאת אנשים שהיו בבקשות תחום מסוים בעבר הלא רחוק כמעסיקים לצורך בחירת מעסיקים מועדפים
    //או בבדיקת הבקשות המתאימות מבחינת התחום לבקשה מסוימת עוד לפני חישוב רמת ההתאמה באחוזים על פי הקריטריונים לבקשה זו ועוד
    public class RequestsDTO
    {
        public RequestsDTO() { }
        public RequestsDTO(short RequestCode, Nullable<short> PeopleCode,
            Nullable<short> AreaCode, string AreaTitles, string Place, Nullable<double> EmployTravelTime,
            Nullable<bool> Employee,
            Nullable<bool> SendingJobOffersOnceaDay,
            Nullable<bool> SendingJobOffersWheneverThereIsaSuitableOffer)
        {
            this.RequestCode = RequestCode;
            this.PeopleCode = PeopleCode;
            this.AreaCode = AreaCode;
            this.AreaTitles = AreaTitles;
            this.Place = Place;
            this.EmployTravelTime = EmployTravelTime;
            this.Employee = Employee;
            this.SendingJobOffersOnceaDay = SendingJobOffersOnceaDay;
            this.SendingJobOffersWheneverThereIsaSuitableOffer = SendingJobOffersWheneverThereIsaSuitableOffer;
        }
        public short RequestCode { get; set; }
        public Nullable<short> PeopleCode { get; set; }
        public Nullable<short> AreaCode { get; set; }
        public string AreaTitles { get; set; }
        public string Place { get; set; }
        public Nullable<double> EmployTravelTime { get; set; }
        public Nullable<bool> Employee { get; set; }
        public Nullable<bool> SendingJobOffersOnceaDay { get; set; }
        public Nullable<bool> SendingJobOffersWheneverThereIsaSuitableOffer { get; set; }
        public static RequestsDTO convertDBsetToDTO(Requests Request)
        {
            return new RequestsDTO(Request.RequestCode, Request.PeopleCode, Request.AreaCode, Request.AreaTitles,
                Request.Place, Request.EmployTravelTime, Request.Employee
                , Request.SendingJobOffersWheneverThereIsaSuitableOffer, Request.SendingJobOffersOnceaDay);
        }
        public static List<RequestsDTO> convertDBsetToDTO(List<Requests> RequestList)
        {
            List<RequestsDTO> DTOlist = new List<RequestsDTO>();
            RequestList.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
        public static Requests convertDTOsetToDB(RequestsDTO Requset)
        {
            return new Requests()
            {
                RequestCode = Requset.RequestCode,
                PeopleCode = Requset.PeopleCode,
                AreaCode = Requset.AreaCode,
                AreaTitles = Requset.AreaTitles,
                Place=Requset.Place,
                EmployTravelTime=Requset.EmployTravelTime,
                Employee = Requset.Employee,
                SendingJobOffersOnceaDay = Requset.SendingJobOffersOnceaDay,
                SendingJobOffersWheneverThereIsaSuitableOffer = Requset.SendingJobOffersWheneverThereIsaSuitableOffer };
        }
        public static List<Requests> convertDTOsetToDB(List<RequestsDTO> RequestsList)
        {
            List<Requests> DBlist = new List<Requests>();
            RequestsList.ForEach(a => DBlist.Add(convertDTOsetToDB(a)));
            return DBlist;
        }
    }
}
