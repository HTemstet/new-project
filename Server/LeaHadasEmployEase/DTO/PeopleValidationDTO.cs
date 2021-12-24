using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
namespace DTO
{
    public class PeopleValidationDTO
    {
        public PeopleValidationDTO() { }
        public PeopleValidationDTO(short PeopleValidationCode, Nullable<short> PeopleCode,
        Nullable<short> ValidatinCode,string ValidationName, string PeopleValidationValue)
        {
            this.PeopleValidationCode = PeopleValidationCode;
            this.PeopleCode = PeopleCode;
            this.Code = ValidatinCode;
            this.ValidationName = ValidationName;
            this.Name = PeopleValidationValue;
        }
        public short PeopleValidationCode { get; set; }
        public Nullable<short> PeopleCode { get; set; }
        public Nullable<short> Code { get; set; }
        public string ValidationName { get; set; }
        public string Name { get; set; }
        public static PeopleValidationDTO convertDBsetToDTO(PeopleValidation PeopleValidation)
        {
            return new PeopleValidationDTO(PeopleValidation.PeopleValidationCode,
                PeopleValidation.PeopleCode,PeopleValidation.ValidationCode,
                PeopleValidation.Validations.ValidationName,
                PeopleValidation.PeopleValidationValue);
        }
        public static List<PeopleValidationDTO> convertDBsetToDTO(List<PeopleValidation> PeopleValidationsist)
        {
            List<PeopleValidationDTO> DTOlist = new List<PeopleValidationDTO>();
            PeopleValidationsist.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
        public static PeopleValidation convertDTOsetToDB(PeopleValidationDTO PeopleValidation)
        {
            return new PeopleValidation()
            {
                PeopleValidationCode = PeopleValidation.PeopleValidationCode,
                PeopleCode = PeopleValidation.PeopleCode,
                ValidationCode=PeopleValidation.Code,
                PeopleValidationValue = PeopleValidation.Name
            };
        }
        public static List<PeopleValidation> convertDTOsetToDB(List<PeopleValidationDTO> PeopleValidationslist)
        {
            List<PeopleValidation> DBlist = new List<PeopleValidation>();
            PeopleValidationslist.ForEach(a => DBlist.Add(convertDTOsetToDB(a)));
            return DBlist;
        }
    }
}

