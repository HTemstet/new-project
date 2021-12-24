using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class OfferDetailsDTO
    {
        public OfferDetailsDTO() { }
        public OfferDetailsDTO(short EmployerDetailsCode, Nullable<short> AreaCode, string OfferName,
            string OfferDescription,  string MoreDetails) 
        {
            this.Code = EmployerDetailsCode;
            this.AreaCode = AreaCode;
            this.Name = OfferName;
            this.OfferDescription = OfferDescription;
            this.MoreDetails = MoreDetails;
        }
        public short Code { get; set; }
        public Nullable<short> AreaCode { get; set; }
        public string Name { get; set; }
        public string OfferDescription { get; set; }
        public string MoreDetails { get; set; }
        public static OfferDetailsDTO convertDBsetToDTO(OfferDetails EmployerDetails)
        {
            return new OfferDetailsDTO(EmployerDetails.OfferDetailsCode, EmployerDetails.AreaCode,
                EmployerDetails.OfferName, EmployerDetails.OfferDescription,
                EmployerDetails.MoreDetails);
        }
        public static List<OfferDetailsDTO> convertDBsetToDTO(List<OfferDetails> EmployerDetailsList)
        {
            List<OfferDetailsDTO> DTOlist = new List<OfferDetailsDTO>();
            EmployerDetailsList.ForEach(a => DTOlist.Add(convertDBsetToDTO(a)));
            return DTOlist;
        }
        public static OfferDetails convertDTOsetToDB(OfferDetailsDTO EmployerDetails)
        {
            return new OfferDetails() {
                OfferDetailsCode = EmployerDetails.Code,
                AreaCode = EmployerDetails.AreaCode,
                OfferName = EmployerDetails.Name,
                OfferDescription = EmployerDetails.OfferDescription,
                MoreDetails = EmployerDetails.MoreDetails
            };
        }
        public static List<OfferDetails> convertDTOsetToDB(List<OfferDetailsDTO> EmployerDetailsList)
        {
            List<OfferDetails> DBlist = new List<OfferDetails>();
            EmployerDetailsList.ForEach(a => DBlist.Add(convertDTOsetToDB(a)));
            return DBlist;
        }
    }
}
