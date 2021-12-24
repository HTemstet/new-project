using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
namespace DTO
{
   public class ValidationsDTO
    {
        public ValidationsDTO() { }
        public ValidationsDTO(short Code, string Name)
        {
            this.Code = Code;
            this.Name = Name;
        }
        public short Code { get; set; }
        public string Name { get; set; }
        public static ValidationsDTO convertDBsetToDTO(Validations Validation)
        {
            return new ValidationsDTO(Validation.ValidationCode, Validation.ValidationName);
        }
        public static List<ValidationsDTO> convertDBsetToDTO(List<Validations> Validationslist)
        {
            List<ValidationsDTO> DTOlist = new List<ValidationsDTO>();
            Validationslist.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
        public static Validations convertDTOsetToDB(ValidationsDTO Validation)
        {
            return new Validations() { ValidationCode = Validation.Code,ValidationName = Validation.Name };
        }
        public static List<Validations> convertDTOsetToDB(List<ValidationsDTO> Validaionslist)
        {
            List<Validations> DBlist = new List<Validations>();
            Validaionslist.ForEach(a => DBlist.Add(convertDTOsetToDB(a)));
            return DBlist;
        }
    }
}
