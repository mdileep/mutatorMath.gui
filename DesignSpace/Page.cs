using DesignSpace.Lib;
using System;
using System.Collections.Generic;
using System.Html;

namespace DesignSpace
{
	public class Canvas
	{
		public void Init()
		{
			Worker.RegisterEvents();
			Worker.PageInit();
		}
	}
}
