using DAL;
using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Data_management
{
    public class AreasTitles
    {
        public JOBBAEntities db = new JOBBAEntities();
        //החזרת התפקידים השונים הקיימים בתחום מסויים מהמאגר
        public List<AreasTitlesDTO> getAllAreasTitles(short AreaCode)
        {
            return AreasTitlesDTO.convertDBsetToDTO(db.AreasTitles.ToList()).Where(x=>x.AreaCode==AreaCode).ToList();
        }
    }
}
