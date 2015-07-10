using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Upload : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		if (Request.HttpMethod.ToLower() == "post")
		{
			string id = Request.Form["id"];
			Response.Clear();
			Response.Write(String.Format(@"<script type='text/javascript'>window.top.DesignSpace.SourcesWorker.successCallBack('{0}','source');</script>", id));
			Response.End();

		}
	}
}