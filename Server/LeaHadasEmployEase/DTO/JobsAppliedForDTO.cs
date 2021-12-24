using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class JobsAppliedForDTO
    {
        public JobsAppliedForDTO() { }
        public JobsAppliedForDTO(short JobsAppliedForCode, short? PeopleCode, short? RequestCode, System.DateTime? SendingDate, Requests_FullDTO Request)
        {
            this.JobsAppliedForCode = JobsAppliedForCode;
            this.PeopleCode = PeopleCode;
            this.RequestCode = RequestCode;
            this.SendingDate = SendingDate;
            this.Request = Request;
        }
        public short JobsAppliedForCode { get; set; }
        public Nullable<short> PeopleCode { get; set; }
        public Nullable<short> RequestCode { get; set; }
        public Nullable<System.DateTime> SendingDate { get; set; }
        public Requests_FullDTO Request { get; set; }
        public static JobsAppliedForDTO convertDBsetToDTO(JobsAppliedFor JobsAppliedFor)
        {
            return new JobsAppliedForDTO(JobsAppliedFor.JobsAppliedForCode, JobsAppliedFor.PeopleCode, JobsAppliedFor.RequestCode, JobsAppliedFor.SendingDate,Requests_FullDTO.convertDBsetToDTO(JobsAppliedFor.Requests));
        }
        public static List<JobsAppliedForDTO> convertDBsetToDTO(List<JobsAppliedFor> JobsAppliedForList)
        {
            List<JobsAppliedForDTO> DTOlist = new List<JobsAppliedForDTO>();
            JobsAppliedForList.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
        public static JobsAppliedFor convertDTOsetToDB(JobsAppliedForDTO JobsAppliedFor)
        {
            return new JobsAppliedFor() { JobsAppliedForCode = JobsAppliedFor.JobsAppliedForCode, PeopleCode = JobsAppliedFor.PeopleCode,RequestCode = JobsAppliedFor.RequestCode,SendingDate = JobsAppliedFor.SendingDate };
        }
    }
}
