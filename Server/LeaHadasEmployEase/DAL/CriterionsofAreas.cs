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
    
    public partial class CriterionsofAreas
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CriterionsofAreas()
        {
            this.CriterionsDependency = new HashSet<CriterionsDependency>();
            this.CriterionsDependency1 = new HashSet<CriterionsDependency>();
            this.CriterionsofRequests = new HashSet<CriterionsofRequests>();
        }
    
        public short CriterionofAreaCode { get; set; }
        public Nullable<short> CriterionCode { get; set; }
        public Nullable<short> AreaCode { get; set; }
        public string FeildValidation { get; set; }
        public string PatternErrorMessage { get; set; }
    
        public virtual Areas Areas { get; set; }
        public virtual Criterions Criterions { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CriterionsDependency> CriterionsDependency { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CriterionsDependency> CriterionsDependency1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<CriterionsofRequests> CriterionsofRequests { get; set; }
    }
}
