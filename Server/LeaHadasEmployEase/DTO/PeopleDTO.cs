using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
namespace DTO
{
   public class PeopleDTO
    {
        public PeopleDTO() { }
        public PeopleDTO(short PeopleCode, string PeoplePassword,
            string TempPassword, string FirstName, string LastNameorBisnessname,
            string Phone, string Email, Nullable<bool> Administrator, ICollection<PeopleValidationDTO> PeopleValidation,
            string Logo,string SiteLink, string About, string CV)
        {
            this.Code = PeopleCode;
            this.PeoplePassword = PeoplePassword;
            this.TempPassword = TempPassword;
            this.FirstName = FirstName;
            Name = LastNameorBisnessname;
            this.Phone = Phone;
            this.Email = Email;
            this.Administrator = Administrator;
            this.PeopleValidation = PeopleValidation;
            this.Logo = Logo;
            this.SiteLink = SiteLink;
            this.About = About;
            this.CV = CV;
        }
        public short Code { get; set; }
        public string PeoplePassword { get; set; }
        public string TempPassword { get; set; }
        public string FirstName { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Logo { get; set; }
        public string SiteLink { get; set; }
        public string About { get; set; }
        public string CV { get; set; }
        public Nullable<bool> Administrator { get; set; }
        public virtual ICollection<PeopleValidationDTO> PeopleValidation { get; set; }
        public static PeopleDTO convertDBsetToDTO(People onePeople)
        {
            PeopleDTO p = new PeopleDTO(onePeople.PeopleCode,
                onePeople.PeoplePassword, onePeople.TempPassword, onePeople.FirstName,
                onePeople.LastNameorBisnessname,onePeople.Phone, onePeople.Email,onePeople.Administrator,
                PeopleValidationDTO.convertDBsetToDTO(onePeople.PeopleValidation.ToList()),
                onePeople.Logo,onePeople.SiteLink,onePeople.About,onePeople.CV);
            return p;
        }
        public static List<PeopleDTO> convertDBsetToDTO(List<People> Peopleslist)
        {
            List<PeopleDTO> DTOlist = new List<PeopleDTO>();
            Peopleslist.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
        public static People convertDTOsetToDB(PeopleDTO onePeople)
        {
            People p = new People();
            p.PeopleCode = onePeople.Code;
            p.PeoplePassword = onePeople.PeoplePassword;
            p.TempPassword = onePeople.TempPassword;
            p.FirstName = onePeople.FirstName;
            p.LastNameorBisnessname = onePeople.Name;
            p.Phone = onePeople.Phone;
            p.Email = onePeople.Email;
            p.Administrator = onePeople.Administrator;
            p.PeopleValidation =PeopleValidationDTO.convertDTOsetToDB(onePeople.PeopleValidation.ToList());
            p.Logo = onePeople.Logo;
            p.SiteLink = onePeople.SiteLink;
            p.About = onePeople.About;
            p.CV = onePeople.CV;
            return p;
        }
    }
}
