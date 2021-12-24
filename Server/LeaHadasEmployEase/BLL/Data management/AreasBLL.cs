using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using DTO;
namespace BLL.Data_management
{
    public  class AreasBLL
    {
        public JOBBAEntities db = new JOBBAEntities();
        //החזרת התחומים הקיימים במאגר לצורך הוספת תחום או בחירת תחום לבקשה
        public  List<AreasDTO> getAllAreas()
        {
            return AreasDTO.convertDBsetToDTO(db.Areas.ToList());
        }
        //החזרת שם תחום עפ"י קוד לצורך שמירת נתיב לוגו או קו"ח או פרסומות או החזרתו
        public string getAreaNameByCode(Nullable<short> AreaCode)
        {
            return AreasDTO.convertDBsetToDTO(db.Areas.ToList()).Find(x=>x.Code== AreaCode).Name;
        }
    }
}
