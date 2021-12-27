using BLL.Logical_calculations;
using DAL;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Data_management
{
    public class RequestBLL
    {
        public JOBBAEntities db = new JOBBAEntities();
        //החזרת כותרות הקריטריונים הקיימות במאגר לצורך עיצוב נח יותר למשתמש
        public List<CriterionsTitlesDTO> getAllCriterionsTitles()
        {
            return CriterionsTitlesDTO.convertDBsetToDTO(db.CriterionsTitles.ToList());
        }
        //בנית עץ תלויות של קריטריונים לתחום כך שראש העץ לא תלוי באף קריטריון וכל אלו שתחתיו תלויים בו או גם זה בזה
        private void MakeTree(CriterionsofAreasDTO ca, List<CriterionsofAreasDTO> CriterionsList,
            List<CriterionsDependencyDTO> CriterionsDependency)
        {
            List<CriterionsDependencyDTO> cdl = CriterionsDependency.
               Where(y => y.CriterionofAreaCode1 == ca.CriterionofAreaCode).ToList();
            //אתחול רשימת הקריטריונים לתחום שתלויים בקשר ראשון בקריטריון לתחום שנשלח
            ca.CriterionsofAreasTree = CriterionsList.Where(x =>
            cdl.Find(y => y.CriterionofAreaCode2 == x.CriterionofAreaCode) != null).ToList();
            //בדיקה האם נכנסו לרשימה הנל קריטריונים שתלויים בו
            if (ca.CriterionsofAreasTree != null)
            {
                //מעבר על כל אחד מהקריטריונים לתחום שתלויים בו
                //בנית עץ תלויות מכל אחד מהאיברים כאשר הוא מהווה את ראש העץ
                //מחיקת כל אחד מהאיברים התלויים בקריטריון לתחום שנשלח מרשימת הקריטריונים לתחום מסוים לפני הכנסת חלק מהם לתוך אחרים בעקבות התלות 
                ca.CriterionsofAreasTree.ForEach(x => { MakeTree(x, CriterionsList, CriterionsDependency); CriterionsList.Remove(x); });
            }
        }
        //החזרת קריטריונים לתחום מסוים
        public List<CriterionsofAreasDTO> getCriterionsofAreas(short AreaCode, Nullable<bool> Employee)
        {
            //רשימת הקריטריונים לתחום שיוחזרו ללקוח, כאשר כל קריטריון מכיל בתוכו עוד קריטריונים שתלויים בו
            List<CriterionsofAreasDTO> CriterionsofAreaList = new List<CriterionsofAreasDTO>();
            //רשימת הקריטריונים לתחום מסוים לפני הכנסת חלק מהם לתוך אחרים בעקבות התלות
            List<CriterionsofAreasDTO> CriterionsList = CriterionsofAreasDTO.convertDBsetToDTO(db.CriterionsofAreas.ToList()).Where(
                x => x.AreaCode == AreaCode).ToList();
            //רשימת תלות הקריטריונים לתחום מסוים, לצורך מעבר על הקריטריונים לתחום והכנסת התלויים לתוך אחרים
            List<CriterionsDependencyDTO> CriterionsDependency = CriterionsDependencyDTO.convertDBsetToDTO(
                db.CriterionsDependency.ToList()).Where(x => x.AreaCode == AreaCode).ToList();
            //שמירת הקריטריון שהקריטריון שעומדים עליו תלוי בו, אם קיים דבר כזה
            CriterionsDependencyDTO cd;
            //הקריטריון הנוכחי להוספה לרשימת הקריטריונים לתחום להחזרה
            CriterionsofAreasDTO ca;
            //מעבר בלולאה כל עוד לא נכנסו הקריטריונים לתחום לרשימת הקריטריונים לתחום שיוחזרו 
            while (CriterionsList.Count > 0)
            {
                //התחלה בכל פעם מהאיבר הראשון שנותר ברשימה
                ca = CriterionsList[0];
                //מציאת השורה ברשימת התלויות בה הוא מופיע כתלוי במישהו
                cd = CriterionsDependency.Find(x => x.CriterionofAreaCode2 ==
                                 ca.CriterionofAreaCode);
                //מעבר בלולאה כל עוד נמצא קריטריון או ערך לקריטריון שהוא תלוי בו
                while (cd != null)
                {
                    //מציאת הקריטריון שהוא תלוי בו או הקריטריון שהוא תלוי בערך שלו 
                    ca = CriterionsList.Find(x => x.CriterionofAreaCode == cd.CriterionofAreaCode1);
                    //מציאת השורה ברשימת התלויות בה הקריטריון שנמצא מופיע כתלוי במישהו
                    cd = CriterionsDependency.Find(x => x.CriterionofAreaCode2 == ca.CriterionofAreaCode);
                }
                //הוספת הקריטריון לתחום לרשימת הקריטריונים לתחום להחזרה
                CriterionsofAreaList.Add(ca);
                //מחיקת הקרירטיון לתחום מרשימת הקריטריונים לתחום מסוים לפני הכנסת חלק מהם לתוך אחרים בעקבות התלות
                CriterionsList.Remove(ca);
                //פניה לפונקציה הבונה עץ תלויות כאשר הקריטריון הנוכחי הוא ראש העץ, כלומר: ראש התלות
                MakeTree(ca, CriterionsList, CriterionsDependency);
            }
            //החזרת רשימת הקריטריונים לתחום ללקוח
            return CriterionsofAreaList;
        }
        //שמירת בקשה מסוימת וכן קריטריונים לבקשה זו, והחזרת הצעות מתאימות, אם מדובר בבקשה של עובד 
        public List<Requests_FullDTO> SavemyRequest(Requests_FullDTO request)
        {
            if (request.PeopleCode != 0)
            {
                Requests r = Requests_FullDTO.convertDTOsetToDB(request);
                CriterionsofRequestsDTO.DBlist = new List<CriterionsofRequests>();
                if(request.RequestCode!=0)
                {
                  db.Entry(db.Requests.Find(request.RequestCode)).CurrentValues.SetValues(Requests_FullDTO.convertDTOsetToDB(request));
                    db.CriterionsofRequests.ToList().ForEach(x =>
                    {
                        if (x.RequestCode == request.RequestCode)
                            db.CriterionsofRequests.Remove(x);
                    });
                }
                else
                {
                  db.Requests.Add(r);
                }
                db.CriterionsofRequests.AddRange(r.CriterionsofRequests);
                db.SaveChanges();
                db.CriterionsofRequests.AddRange(r.CriterionsofRequests);

                if (r.Employee == false) return new List<Requests_FullDTO>();
            }
           List<Requests_FullDTO> l=JobOffers.GetFittingOffers(request);
            return l;
        }
        public List<Requests_FullDTO> QuickSearch(short? AreaCode, string AreaTitleCode, string Place, double? Minutes, string FreeText)
        {
            List<short> lvr= JobOffers.getListValues(AreaTitleCode);
            List<Requests_FullDTO> lq = Requests_FullDTO.convertDBsetToDTO(db.Requests.ToList())
                .Where(x => x.Employee == false && x.AreaCode == AreaCode && lvr.Intersect(JobOffers.getListValues(x.AreaTitles)).Any()
                 &&(
                 x.RequestOfferDetails != null&&(Minutes==0|| Place == "\"\""|| JobOffers.GetTravelTime(x.Place, Place)< (Nullable.Compare(x.EmployTravelTime, Minutes) > 0 ?Minutes : x.EmployTravelTime ))  
                 && (FreeText== "\"\""||(x.RequestOfferDetails.Name.Contains(FreeText)|| x.RequestOfferDetails.OfferDescription.Contains(FreeText)||
                 x.RequestOfferDetails.MoreDetails.Contains(FreeText)))
                 )).ToList();
            lq.ForEach(offer =>
            {
                offer.CriterionsofRequests = JobOffers.getCriterionsofRequests(offer.AreaCode, offer.CriterionsofRequests.ToList());
                offer.PeopleOffer = PeopleDTO.convertDBsetToDTO(db.People.ToList().Find(x => x.PeopleCode == offer.PeopleCode));
            });
            return lq;
        }
        public List<Requests_FullDTO> CompanySearch(string Company)
        {
            List<Requests_FullDTO> lq = Requests_FullDTO.convertDBsetToDTO(db.Requests.ToList()).Where(x => x.Employee == false).ToList();
            lq.ForEach(offer =>
            {
                offer.CriterionsofRequests = JobOffers.getCriterionsofRequests(offer.AreaCode, offer.CriterionsofRequests.ToList());
                offer.PeopleOffer = PeopleDTO.convertDBsetToDTO(db.People.ToList().Find(x => x.PeopleCode == offer.PeopleCode));
            });
            return lq.Where(x=>x.PeopleOffer.FirstName.Contains(Company) || x.PeopleOffer.Name.Contains(Company)).ToList();
        }
        public List<string> GetFreeList()
        {
            List<string> ls = new List<string>();
            OfferDetailsDTO.convertDBsetToDTO(db.OfferDetails.ToList()).ForEach(x => {
                if (!string.IsNullOrEmpty(x.Name)) ls.Add(x.Name);
                if (!string.IsNullOrEmpty(x.OfferDescription)) ls.Add(x.OfferDescription);
                if (!string.IsNullOrEmpty(x.MoreDetails)) ls.Add(x.MoreDetails); });
            return ls;
        }
        //קבלת בקשה מסוימת עפי קוד - שימושי לצורך יצירת קשר דרך משרה שנשלחה למייל
        public List<Requests_FullDTO> GetRequestByCode(short RequestCode)
        {
            List<Requests_FullDTO> lq = Requests_FullDTO.convertDBsetToDTO(db.Requests.ToList())
                .Where(x => x.Employee == false&& x.RequestCode == RequestCode).ToList();
            if (lq.Count > 0)
            {
                Requests_FullDTO q = lq[0];
                q.CriterionsofRequests = JobOffers.getCriterionsofRequests(q.AreaCode, q.CriterionsofRequests.ToList());
                q.PeopleOffer = PeopleDTO.convertDBsetToDTO(db.People.ToList().Find(x => x.PeopleCode == q.PeopleCode));
                return lq;
            }
            else
                return null;
        }
        //קבלת בקשה מסוימת עפי קוד איש- לצורך תצוגת החיפושים למשתמש
        public List<Requests_FullDTO> GetRequestsByPeople(short PeopleCode,bool Employee)
        {
            List<Requests_FullDTO> lq = Requests_FullDTO.convertDBsetToDTO(db.Requests.ToList())
                .Where(x => x.Employee == Employee && x.PeopleCode == PeopleCode).ToList();
            if (lq.Count > 0)
            {
                lq.ForEach(q =>
                {
                    q.CriterionsofRequests = JobOffers.getCriterionsofRequests(q.AreaCode, q.CriterionsofRequests.ToList());
                    q.PeopleOffer = PeopleDTO.convertDBsetToDTO(db.People.ToList().Find(x => x.PeopleCode == q.PeopleCode));
                });
                return lq;
            }
            else
                return null;
        }
        //קבלת בקשה מסוימת עפי קוד בקשה
        public Requests_FullDTO GetRequestByRequestId(short requestId)
        { 
            Requests_FullDTO q = Requests_FullDTO.convertDBsetToDTO(db.Requests.ToList())
                .Find(x => x.RequestCode == requestId);
            if (q!=null)
                q.CriterionsofRequests = JobOffers.getCriterionsofRequests(q.AreaCode, q.CriterionsofRequests.ToList());
            return q;
        }
        //קבלת בקשה מסוימת עפי קוד בקשה
        public void RemoveRequest(short requestId)
        {
            db.Requests.Remove(db.Requests.ToList().Find(r => r.RequestCode == requestId));
            db.CriterionsofRequests.RemoveRange(db.CriterionsofRequests.ToList().Where(r => r.RequestCode == requestId));
            db.SaveChanges();
         }

    }
}
