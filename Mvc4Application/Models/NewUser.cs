using System;
using System.ComponentModel.DataAnnotations;

namespace Mvc4Application.Models
{
    public class NewUser
    {
        public DateTime CreatedDate { get; set; }
        
        [Required]
        [StringLength(10)]
        [Display(Name="First Name")]
        public string FirstName { get; set; }
        
        [Required]
        [StringLength(25)]
        [Display(Name="Last Name")]
        public string LastName { get; set; }
        
        [Required]
        [RegularExpression(@"[a-zA-Z0-9.!#$%&'*+-/=?\^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*")]
        [StringLength(50)]
        [Display(Name="Email Address")]
        public string EmailAddress { get; set; }
        
        public Guid UserId { get; set; }
    }
}