using BLL.Data_management;
using DAL;
using DTO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace BLL.Logical_calculations
{
    //מחלקה המציגה ללקוח את ההצעות הרלוונטיות- יתכן והיא לא נצרכת או לא מדויקת מספיק
    //אולי להעביר אותה לתיקית bll-חישובים לוגיים
    public static class JobOffers
    {
        const double Percent = 60;
        //אולי מיקום 2 הפונקציות הבאות הוא בכלל לא פה
        //ויתכן מאוד שאפשר לבטל אותם בכלל ולהשתמש
        //בפונקציות ההמרה של קריטריונים לתחומים לעץ
        //וגם אולי להעביר את פונקציות ההמרה למחלקה נפרדת - אולי ב DTO
        private static void MakeTree(CriterionsofRequestsDTO ca, List<CriterionsofRequestsDTO> CriterionsList, List<CriterionsDependencyDTO> CriterionsDependency)
        {
            List<CriterionsDependencyDTO> cdl = CriterionsDependency.
               Where(y => y.CriterionofAreaCode1 == ca.CriterionofAreaCode).ToList();
            ca.CriterionsofAreasTree = CriterionsList.Where(x =>
            cdl.Find(y => y.CriterionofAreaCode2 == x.CriterionofAreaCode) != null).ToList();
            if (ca.CriterionsofAreasTree != null)
                ca.CriterionsofAreasTree.ForEach(x => { MakeTree(x, CriterionsList, CriterionsDependency); CriterionsList.Remove(x); });
        }
        public static List<CriterionsofRequestsDTO> getCriterionsofRequests(short? AreaCode, List<CriterionsofRequestsDTO> CriterionsList)
        {
            List<CriterionsofRequestsDTO> CriterionsofRequestsListToReturn = new List<CriterionsofRequestsDTO>();
            List<CriterionsDependencyDTO> CriterionsDependency = CriterionsDependencyDTO.convertDBsetToDTO(
                new JOBBAEntities().CriterionsDependency.ToList()).Where(x => x.AreaCode == AreaCode).ToList();
            CriterionsDependencyDTO cd;
            CriterionsofRequestsDTO ca;
            while (CriterionsList.Count > 0)
            {
                ca = CriterionsList[0];
                cd = CriterionsDependency.Find(x => x.CriterionofAreaCode2 ==
                                 ca.CriterionofAreaCode);
                while (cd != null)
                {
                    ca = CriterionsList.Find(x => x.CriterionofAreaCode == cd.CriterionofAreaCode1);
                    cd = CriterionsDependency.Find(x => x.CriterionofAreaCode2 == ca.CriterionofAreaCode);
                }
                CriterionsofRequestsListToReturn.Add(ca);
                CriterionsList.Remove(ca);
                MakeTree(ca, CriterionsList, CriterionsDependency);
            }
            return CriterionsofRequestsListToReturn;
        }
        public static List<short> getListValues(string list)
        {
            string[] stringcodes = list.Split(',');
            List<short> shortcodes = new List<short>();
            short shortcode;
            foreach (string code in stringcodes)
            {
                if (short.TryParse(code, out shortcode))
                    shortcodes.Add(shortcode);
            }
            return shortcodes;
        }
        public static double GetAdjustment(List<CriterionsofRequestsDTO> criterion1, List<CriterionsofRequestsDTO> criterion2, short? LevelofImportance, Requests_FullDTO offertoreturn)
        {
            //הערה: החלטתי שחלוקת רמות החשיבות מתחלקת שווה בשווה בין הבלוקים, ולא עפי מספר הקריטרינים
            //האבא מקבל כמו הבן
            //אולי כדאי לשנות את החלוקה
            short percent = Convert.ToInt16(LevelofImportance / (criterion1.Count + 1));
            for (int i = 0; i < criterion1.Count; i++)
            {
                offertoreturn.AdjustmentPercentages += GetAdjustment(criterion1[i].CriterionsofAreasTree, criterion2[i].CriterionsofAreasTree, percent, offertoreturn);
                ComparisionOperators criterion2ComparisionOperator =
                CriterionsofAreasDTO.convertDBsetToDTO(new JOBBAEntities().CriterionsofAreas.ToList()).
                    Where(a => a.CriterionofAreaCode == criterion2[i].CriterionofAreaCode).ToList()
                    [0].ComparisionOperator;
                //אולי להוסיף פה בדיקה שלא מדובר בקריטריון שהוא חלק מרשימה - כי אז אין ערך לקריטריון - הערך שנבחר מהרשימה שמור באבא
                int x, y;
                Int32.TryParse(criterion1[i].ValueofCriterion, out x);
                Int32.TryParse(criterion2[i].ValueofCriterion, out y);
                switch (criterion2ComparisionOperator)
                {
                    case ComparisionOperators.BigEqual:
                        if (x >= y)
                        {
                            offertoreturn.AdjustmentPercentages += percent;
                        }
                        break;
                    case ComparisionOperators.Big:
                        if (x > y)
                        {
                            offertoreturn.AdjustmentPercentages += percent;
                        }
                        break;
                    case ComparisionOperators.Equal:
                        if (criterion1[i].ValueofCriterion == criterion2[i].ValueofCriterion)
                        {
                            offertoreturn.AdjustmentPercentages += percent;
                        }
                        break;
                    case ComparisionOperators.LessEqual:
                        if (x <= y)
                        {
                            offertoreturn.AdjustmentPercentages += percent;
                        }
                        break;
                    case ComparisionOperators.Less:
                        if (x < y)
                        {
                            offertoreturn.AdjustmentPercentages += percent;
                        }
                        break;
                    case ComparisionOperators.And:
                        if(criterion1[i].ValueofCriterion!=null&& criterion2[i].ValueofCriterion!=null)
                        {
                            List<short> criterion1list1 = getListValues(criterion1[i].ValueofCriterion);
                            List<short> criterion2list1 = getListValues(criterion2[i].ValueofCriterion);
                            //כנראה בשורה הבאה החלוקה היא ב criterion2list1
                            int per = percent / criterion2list1.Count();
                            List<short> fittingcodes = criterion1list1.Intersect(criterion2list1).ToList();
                            //להוסיף בדיקה אם זה לא null
                            foreach (short code in fittingcodes)
                                offertoreturn.AdjustmentPercentages += per;
                        }                     
                        break;
                    default:
                        break;
                }
            }
            return offertoreturn.AdjustmentPercentages;
        }
        public static Requests_FullDTO GetJobOffer(List<CriterionsofRequestsDTO> CriterionsofRequest, Requests_FullDTO offer)
        {
            offer.CriterionsofRequests = getCriterionsofRequests(offer.AreaCode, offer.CriterionsofRequests.ToList());
            //כאשר עושים את החישוב לא מיד כשנכנסת הבקשה - אז גם את הבקשה יש להמיר 
            //לעץ, כי היא לא תהיה עץ בגלל שהיא חזרה כך מהלקוח
            //ההמרה מתבצעת עבור חישוב לא מידי אך גם עבור חישוב מידי, כי זה לא מזיק ומונע פונקציה נפרדת לחישוב מידי ומאוחר
            CriterionsofRequest = getCriterionsofRequests(offer.AreaCode, CriterionsofRequest);
            for (int i = 0; i < CriterionsofRequest.Count; i++)
                //החלטתי לשלוח גם את אב הבלוק כרשימה ע"מ להשתמש טוב בפרמטר של הפונקציה הרקורסיבית,
                //אולי זה לא טוב וצריך לשנות
                //אולי אפשר אפילו לשלוח ישירות את כל הבלוקים ביחד
                //צריך לבדוק מה יהיה עם רמות העדיפות במקרה כזה
                offer.AdjustmentPercentages += GetAdjustment(new List<CriterionsofRequestsDTO>() { CriterionsofRequest[i] },
               new List<CriterionsofRequestsDTO>() { offer.CriterionsofRequests.ToList()[i] }, offer.CriterionsofRequests.ToList()[i].LevelofImportance, offer);
            offer.PeopleOffer = PeopleDTO.convertDBsetToDTO(new RequestBLL()
                   .db.People.ToList().Find(x => x.PeopleCode == offer.PeopleCode));
            return offer;
        }
        public static List<Requests_FullDTO> GetJobOffers(List<CriterionsofRequestsDTO> CriterionsofRequest, List<Requests_FullDTO> RequestsList)
        {
            List<Requests_FullDTO> DTOlist = new List<Requests_FullDTO>();
            RequestsList.ForEach(a => DTOlist.Add(
                GetJobOffer(CriterionsofRequest, a)
                ));
            return DTOlist.Where(x => x.AdjustmentPercentages >= Percent).ToList();
        }
        public static List<Requests_FullDTO> GetFittingOffers(Requests_FullDTO Request)
        {
            List<Requests_FullDTO> OffersList = JobOffers.GetJobOffers(Request.CriterionsofRequests.ToList(),
                  new RequestBLL().QuickSearch(Request.AreaCode, Request.AreaTitles, Request.Place, Request.EmployTravelTime, ""));
            return OffersList;
        }
        public static float GetTravelTime(string source, string destintion)
        {
            try
            {
                WebClient client = new WebClient();
                Stream stream = client.OpenRead("https://maps.googleapis.com/maps/api/distancematrix/xml?origins="
                    + source + "|Israel&destinations=" + destintion +
                    "|Israel&key=AIzaSyB22ByLmqnURDUl36iyyIGCeTDNdNLgzW4&sensor=false");
                XDocument doc = XDocument.Load(stream);
                var str = doc.Descendants("row").First().Descendants("duration").First().Element("value");
                int num = (int)str;
                return num / 60;
            }
            catch { return -1; }

        }
    }
}
