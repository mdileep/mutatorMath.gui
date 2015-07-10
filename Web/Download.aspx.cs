using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Download : System.Web.UI.Page
{
	protected void Page_Load(object sender, EventArgs e)
	{
		if (Request.HttpMethod.ToLower() == "post")
		{
			Response.Clear();
			Response.Write(String.Format(@"<script type='text/javascript'>window.top.DesignSpace.ComputeWorker.successCallBack('DDDD');</script>"));
			Response.End();

		}

		//Response.Redirect("sample.ufo.zip");
	}
}