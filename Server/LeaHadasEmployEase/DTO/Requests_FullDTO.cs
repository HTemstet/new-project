using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
namespace DTO
{
    //מחלקה שמאפשרת קבלת בקשה וקריטריונים לבקשה בפנית שרת אחת משום שאי אפשר לשלוח שני אוביקטים בבקשה אחת
    //וכן כך אפשר להוסיף בהמרה פשוטה את הקריטריונים לבקשה עם קוד הבקשה הרצוי בלי לשמור אותו ואז להוסיף
    //כי בהמרה לטבלת הבקשה של המסד זה מתרחש אוטומטית בגלל הנווגיישן פרופרטי
   public class Requests_FullDTO
    {
        public Requests_FullDTO() { }
        public Requests_FullDTO(short RequestCode, Nullable<short> PeopleCode, 
            Nullable<short> AreaCode, string AreaTitles,
             string Place, Nullable<double> EmployTravelTime, Nullable<bool> Employee,
            ICollection<CriterionsofRequestsDTO> CriterionsofRequests,
            Nullable<bool> SendingJobOffersOnceaDay,
            Nullable<bool> SendingJobOffersWheneverThereIsaSuitableOffer,
            OfferDetailsDTO OfferDetails)
        {
            this.RequestCode = RequestCode;
            this.PeopleCode = PeopleCode;
            this.AreaCode = AreaCode;
            this.AreaTitles = AreaTitles;
            this.Place = Place;
            this.EmployTravelTime = EmployTravelTime;
            this.Employee = Employee;
            this.CriterionsofRequests = CriterionsofRequests;
            this.SendingJobOffersOnceaDay = SendingJobOffersOnceaDay;
            this.SendingJobOffersWheneverThereIsaSuitableOffer = SendingJobOffersWheneverThereIsaSuitableOffer;
            RequestOfferDetails = OfferDetails;
        }
        public short RequestCode { get; set; }
        public Nullable<short> PeopleCode { get; set; }
        //שימושי כנראה רק להצעות העבודה שחוזרות לעובד
        public PeopleDTO PeopleOffer { get; set; }
        public Nullable<short> AreaCode { get; set; }
        public string AreaTitles { get; set; }
        public string Place { get; set; }
        public Nullable<double> EmployTravelTime { get; set; }
        public Nullable<bool> Employee { get; set; }
        public Nullable<bool> SendingJobOffersOnceaDay { get; set; }
        public Nullable<bool> SendingJobOffersWheneverThereIsaSuitableOffer { get; set; }
        public OfferDetailsDTO RequestOfferDetails { get; set; }
        public ICollection<CriterionsofRequestsDTO> CriterionsofRequests { get; set; }
        //שימושי כנראה רק להצעות העבודה שחוזרות לעובד
        public double AdjustmentPercentages { get; set; }
        public static Requests_FullDTO convertDBsetToDTO(Requests Request)
        {
            return new Requests_FullDTO(Request.RequestCode, Request.PeopleCode,Request.AreaCode, Request.AreaTitles,
              Request.Place, Request.EmployTravelTime, Request.Employee,
             CriterionsofRequestsDTO.convertDBsetToDTO(Request.CriterionsofRequests.ToList()),Request.SendingJobOffersOnceaDay, Request.SendingJobOffersWheneverThereIsaSuitableOffer,
            (Request.OfferDetails != null&& Request.OfferDetails.Count>0)? OfferDetailsDTO.convertDBsetToDTO(Request.OfferDetails.ToList()[0]):null);
        }
        public static List<Requests_FullDTO> convertDBsetToDTO(List<Requests> RequestList)
        {
            List<Requests_FullDTO> DTOlist = new List<Requests_FullDTO>();
            RequestList.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
        public static Requests convertDTOsetToDB(Requests_FullDTO Requset)
        {
            return new Requests() {
                RequestCode = Requset.RequestCode,
                PeopleCode = Requset.PeopleCode,
                AreaCode = Requset.AreaCode,
                AreaTitles = Requset.AreaTitles,
                Place = Requset.Place,
                EmployTravelTime = Requset.EmployTravelTime,
                Employee = Requset.Employee,
                SendingJobOffersOnceaDay = Requset.SendingJobOffersOnceaDay,
                SendingJobOffersWheneverThereIsaSuitableOffer = Requset.SendingJobOffersWheneverThereIsaSuitableOffer,
                OfferDetails = new List<OfferDetails>() { Requset.RequestOfferDetails != null ? OfferDetailsDTO.convertDTOsetToDB(Requset.RequestOfferDetails) : null },
                CriterionsofRequests = CriterionsofRequestsDTO.convertDTOsetToDB(Requset.CriterionsofRequests.ToList())
            };
        }
    }
}
