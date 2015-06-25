using DesignerSpace.Lib;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Html;


namespace DesignSpace.Lib
{
	class Worker
	{
		private static ElementEventListener RemoveHandler;
		private static ElementEventListener AddHandler;
		private static ElementEventListener MouseEnterHandler;
		private static ElementEventListener MouseLeaveHandler;
		private static ElementEventListener MuteInfoHandler;
		private static ElementEventListener CopyInfoHandler;
		private static ElementEventListener CopyGroupsHandler;
		private static ElementEventListener CopyLibHandler;
		private static ElementEventListener AddDimensionHandler;
		private static ElementEventListener RemoveDimensionHandler;
		private static ElementEventListener DisposeHandler;


		internal static void RegisterEvents()
		{
			AddHandler = new ElementEventListener(delegate(ElementEvent e) { AddSource(); });

			RemoveHandler = new ElementEventListener(delegate(ElementEvent e)
			{
				string rowId = FindRowId(e);
				RemoveSource(rowId);
			});

			MouseEnterHandler = new ElementEventListener(delegate(ElementEvent e)
			{
				HoverHandler(e, true);
			});

			MouseLeaveHandler = new ElementEventListener(delegate(ElementEvent e)
			{
				HoverHandler(e, false);
			});

			MuteInfoHandler = new ElementEventListener(delegate(ElementEvent e)
			{
				string rowId = FindRowId(e);
				if (Util.IsChecked("muteInfo_" + rowId))
				{
					Util.SetDisabled("copyInfo_" + rowId);
				}
				else
				{
					Util.SetEnabled("copyInfo_" + rowId);
				}
				Util.SetUnChecked("copyInfo_" + rowId);
			});

			CopyInfoHandler = new ElementEventListener(delegate(ElementEvent e)
			{
				string rowId = FindRowId(e);
				HandleCopyInfo(rowId);
			});

			CopyGroupsHandler = new ElementEventListener(delegate(ElementEvent e)
			{
				string rowId = FindRowId(e);
				HandleCopyGroups(rowId);
			});

			CopyLibHandler = new ElementEventListener(delegate(ElementEvent e)
			{
				string rowId = FindRowId(e);
				HandleCopyLib(rowId);
			});

			AddDimensionHandler = new ElementEventListener(delegate(ElementEvent e)
			{
				string rowId = FindRowId(e);
				HandleDimension(rowId);
			});

			RemoveDimensionHandler = new ElementEventListener(delegate(ElementEvent e)
			{
				string rowId = FindRowId(e);
				HandleRemoveDimension(rowId);
			});

			//TODO: Register Dispose Event Handler on unload or close etc??
			DisposeHandler = new ElementEventListener(delegate(ElementEvent e)
			{
				RemoveHandler = null;
				AddHandler = null;
				MouseEnterHandler = null;
				MouseLeaveHandler = null;
				MuteInfoHandler = null;
				CopyInfoHandler = null;
				CopyGroupsHandler = null;
				CopyLibHandler = null;
				AddDimensionHandler = null;
				RemoveDimensionHandler = null;
				DisposeHandler = null;

			});



		}



		private static void HandleRemoveDimension(string rowId)
		{
			Util.RegisterClick("remove2_" + rowId, RemoveDimensionHandler);
			Element li = Document.GetElementById("metric_" + rowId);
			li.ParentNode.RemoveChild(li);

		}

		private static void HandleDimension(string rowId)
		{
			string val = Util.SelectedValue("dimension_" + rowId);
			string text = Util.SelectedText("dimension_" + rowId);

			string postFix = val + "_" + rowId;
			string targetId = "metric_" + postFix;
			if (Document.GetElementById(targetId) != null)
			{
				Util.SetFocusOnEditableChildById(targetId);
				return;
			}

			Dictionary Dict = new Dictionary();
			Dict["ID"] = rowId;
			Dict["value"] = val;
			Dict["text"] = text;
			string html = Util.ApplyTemplate("DimensionTemplate", Dict);

			Element li = Document.CreateElement("li");
			li.SetAttribute("id", targetId);
			li.InnerHTML = html;

			Element ol = Document.GetElementById("metrics_" + rowId);
			ol.AppendChild(li);

			Util.RegisterClick("remove2_" + postFix, RemoveDimensionHandler);
		}

		private static void RemoveDimensionHandlers(string rowId)
		{
			string olId = "metrics_" + rowId;
			if (Util.IsAvailable(olId))
			{
				Element ol = Document.GetElementById(olId);
				for (int i = 0; i < ol.Children.Length; i++)
				{
					Element li = ol.Children[i];
					if (li.TagName.ToLowerCase() == "li")
					{
						string postFix = li.ID.Substr(li.ID.IndexOf("_") + 1);
						Util.DeRegisterClick("remove2_" + postFix, RemoveDimensionHandler);
					}
				}
			}
		}

		private static void HandleCopyLib(string rowId)
		{
			CheckBoxesAsRaidos("copyLib_", rowId);
		}

		private static void HandleCopyGroups(string rowId)
		{
			CheckBoxesAsRaidos("copyGroups_", rowId);
		}

		private static void CheckBoxesAsRaidos(string prefix, string rowId)
		{
			if (rowId == null)
			{
				rowId = FindCheckedRowId(prefix);
			}

			if (rowId == null)
			{
				return;
			}

			bool isCheked = Util.IsChecked(prefix + rowId);
			Element Sources = Document.GetElementById("sources");
			int n = Util.NoOfChildElements(Sources, "li");
			for (int i = 1; i <= n; i++)
			{
				if (i.ToString() == rowId)
				{
					continue;
				}

				if (isCheked)
				{
					Util.SetDisabled(prefix + i);
				}
				else
				{
					Util.SetEnabled(prefix + i);

				}
				Util.SetUnChecked(prefix + i);
			}
		}


		private static void HandleCopyInfo(string rowId)
		{
			if (rowId == null)
			{
				rowId = FindCheckedRowId("copyInfo_");
			}

			if (rowId == null)
			{
				return;
			}

			bool isCheked = Util.IsChecked("copyInfo_" + rowId);

			Element Sources = Document.GetElementById("sources");
			int n = Util.NoOfChildElements(Sources, "li");

			for (int i = 1; i <= n; i++)
			{
				if (i.ToString() == rowId)
				{
					continue;
				}

				if (isCheked)
				{
					Util.SetDisabled("copyInfo_" + i);
					Util.SetEnabled("muteInfo_" + i);
					Util.SetChecked("muteInfo_" + i);
				}
				else
				{
					Util.SetEnabled("copyInfo_" + i);
					Util.SetUnChecked("muteInfo_" + i);
				}
				Util.SetUnChecked("copyInfo_" + i);
			}
		}

		private static string FindCheckedRowId(string preFix)
		{
			Element Sources = Document.GetElementById("sources");
			int n = Util.NoOfChildElements(Sources, "li");

			for (int i = 1; i <= n; i++)
			{
				bool isCheked = Util.IsChecked(preFix + i) && Util.IsEnalbed(preFix + i);
				if (isCheked)
				{
					return i.ToString();
				}
			}
			return null;
		}

		private static string FindRowId(ElementEvent e)
		{
			Element elem = e.SrcElement != null ? e.SrcElement : e.Target;
			string elemId = elem.ID;
			string rowId = elemId.Substr(elemId.IndexOf("_") + 1);
			return rowId;
		}

		private static void HoverHandler(ElementEvent e, bool isEnter)
		{
			string rowId = FindRowId(e);
			if (isEnter)
			{
				Util.SetVisible("remove_" + rowId);
			}
			else
			{
				Util.Hide("remove_" + rowId);
			}
		}

		private static void AddSource()
		{
			Element Sources = Document.GetElementById("sources");
			int n = Util.NoOfChildElements(Sources, "li");
			if (n == 0) { n = 1; }
			while (Document.GetElementById("source_" + (n)) != null)
			{
				n = n + 1;
			}

			string rowId = n.ToString();

			Dictionary dic = new Dictionary();
			dic["ID"] = rowId;
			string html = Util.ApplyTemplate("SourceTemplate", dic);

			Element source = Document.CreateElement("li");
			source.InnerHTML = html;
			Sources.AppendChild(source);

			Util.RegisterClick("remove_" + rowId, RemoveHandler);
			Util.RegisterClick("muteInfo_" + rowId, MuteInfoHandler);
			Util.RegisterClick("copyInfo_" + rowId, CopyInfoHandler);
			Util.RegisterClick("copyGroups_" + rowId, CopyGroupsHandler);
			Util.RegisterClick("copyLib_" + rowId, CopyLibHandler);
			Util.RegisterClick("add2_" + rowId, AddDimensionHandler);


			HandleCopyInfo(null);
			HandleCopyGroups(null);
			HandleCopyLib(null);
			Util.SetFocus("name_" + rowId);

		}




		private static void RemoveSource(string rowId)
		{
			Element Sources = Document.GetElementById("sources");
			int n = Util.NoOfChildElements(Sources, "li");

			if (n == 1)
			{
				ResetSource(rowId);
				return;
			}

			Element srcElem = Document.GetElementById("source_" + rowId);
			Util.DeRegisterClick("remove_" + rowId, RemoveHandler);
			Util.DeRegisterClick("add_" + rowId, AddHandler);
			Util.DeRegisterClick("muteInfo_" + rowId, MuteInfoHandler);
			Util.DeRegisterClick("copyInfo_" + rowId, CopyInfoHandler);
			Util.DeRegisterClick("copyGroups_" + rowId, CopyGroupsHandler);
			Util.DeRegisterClick("copyLib_" + rowId, CopyLibHandler);
			Util.DeRegisterClick("add2_" + rowId, AddDimensionHandler);
			RemoveDimensionHandlers(rowId);

			srcElem.ParentNode.ParentNode.RemoveChild(srcElem.ParentNode);
		}



		private static void ResetSource(string rowId)
		{
			//Set back to default values.
		}

		internal static void PageInit()
		{
			Util.RegisterClick("add", AddHandler);
			AddSource();
		}
	}
}
