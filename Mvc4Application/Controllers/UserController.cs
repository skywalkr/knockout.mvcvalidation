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
            User.CreatedDate = DateTime.Now;
            User.UserId = System.Guid.NewGuid();

            return User;
        }
    }
}