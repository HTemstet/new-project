//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DAL
{
    using System;
    using System.Collections.Generic;
    
    public partial class Criterions
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Criterions()
        {
            this.CriterionsofAreas = new HashSet<CriterionsofAreas>();
        }
    
        public short CriterionCode { get; set; }
        public Nullable<short> CriterionsTitleCode { get; set; }
        public string CriterionsName { get; set; }
        public Nullable<short> CriterionsType { get; set; }
        public Nullable<short> ComparisonOperator { get; set; }
    
        public virtual CriterionsTitles CriterionsTitles { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CriterionsofAreas> CriterionsofAreas { get; set; }
    }
}
