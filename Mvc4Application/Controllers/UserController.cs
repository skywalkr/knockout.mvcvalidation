using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Mvc4Application.Controllers
{
    public class UserController : ApiController
    {
        public Models.NewUser Put(Models.NewUser User)
        {
            if (User.EmailAddress == "test@aol.com")
            {
                ModelState.AddModelError("User", "Test model error.");
                ModelState.AddModelError("User.FirstName", "A User with that Email Address already exists.");
            }

            if (ModelState.IsValid)
            {
                User.CreatedDate = DateTime.Now;
                User.UserId = System.Guid.NewGuid();
            }

            return User;
        }
    }
}