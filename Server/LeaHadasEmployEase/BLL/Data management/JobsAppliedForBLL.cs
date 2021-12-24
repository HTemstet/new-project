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
    public class JobsAppliedForBLL
    {
        public JOBBAEntities db = new JOBBAEntities();
        public void AddJobsAppliedFor(short? PeoppleCode, short? RequestCode)
        {
            JobsAppliedForDTO JobsAppliedFor = new JobsAppliedForDTO(0, PeoppleCode, RequestCode, DateTime.Today, null);
            db.JobsAppliedFor.Add(JobsAppliedForDTO.convertDTOsetToDB(JobsAppliedFor));
            db.SaveChanges();
        }
        public List<JobsAppliedForDTO> GetJobsAppliedbyPeople(short PeopleCode)
        {
            List<JobsAppliedForDTO> lj = JobsAppliedForDTO.convertDBsetToDTO(db.JobsAppliedFor.ToList());
            lj.ForEach(offer =>
            {
                offer.Request.CriterionsofRequests = JobOffers.getCriterionsofRequests(offer.Request.AreaCode, offer.Request.CriterionsofRequests.ToList());
                offer.Request.PeopleOffer = PeopleDTO.convertDBsetToDTO(db.People.ToList().Find(x => x.PeopleCode == offer.PeopleCode));
            });

            return lj.Where(x => x.PeopleCode == PeopleCode).ToList();
        }
    }
}
