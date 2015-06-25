using System;
using System.Html;
using System.Runtime.CompilerServices;
using System.Collections;
using DesignSpace.Lib;


namespace DesignerSpace.Lib
{
	public static class Events
	{
		public const string Click = "click";
		public const string Change = "change";
	}
	public static class Util
	{

		public static bool IsChecked(string Id)
		{
			if (Document.GetElementById(Id) == null)
			{
				return false;
			}
			return (bool)Script.Literal("document.getElementById({0}).checked", Id);
		}
		public static string GetValue(string Id)
		{
			if (Document.GetElementById(Id) == null)
			{
				return "";
			}

			return Script.Literal("document.getElementById({0}).value", Id).ToString();
		}
		public static void SetChecked(string Id)
		{
			if (Document.GetElementById(Id) == null)
			{
				return;
			}

			Script.Literal("document.getElementById ( {0}).checked=true", Id);
		}

		internal static void SetDisabled(string Id)
		{
			if (Document.GetElementById(Id) == null)
			{
				return;
			}

			Document.GetElementById(Id).SetAttribute("disabled", "disabled");
		}

		internal static void SetEnabled(string Id)
		{
			if (Document.GetElementById(Id) == null)
			{
				return;
			}

			Document.GetElementById(Id).RemoveAttribute("disabled");
		}

		public static void SetValue(string Id, string D)
		{
			if (Document.GetElementById(Id) == null)
			{
				return;
			}

			Script.Literal("document.getElementById ( {1}).value={0}", D, Id);
		}
		public static Element AddOptionItem(string Name, string Value, bool isGroup)
		{
			Element O = Window.Document.CreateElement(isGroup ? "optgroup" : "option");
			if (!isGroup)
			{
				O.InnerHTML = Name;
			}
			O.SetAttribute(isGroup ? "label" : "value", Value);

			return O;
		}
		public static void SetOption(string id, string value)
		{
			//int index=0;
			Element E = Document.GetElementById(id);
			for (int i = 0; i < E.Children.Length; i++)
			{
				Element OG = E.Children[i];
				if (OG.TagName.ToLowerCase() == "optgroup")
				{
					for (int j = 0; j < OG.Children.Length; j++)
					{
						Element O = OG.Children[j];
						if ((string)Script.Literal("O.value") == value)
						{
							O.SetAttribute("selected", "selected");
							Script.Literal("O.selected=true");
							//return;
						}
						else if (O.Attributes.GetNamedItem("selected") != null && O.Attributes.GetNamedItem("selected").Value == "selected")
						{
							O.RemoveAttribute("selected");
							Script.Literal("O.selected=false;");
						}
					}
				}
				else
				{
					if ((string)Script.Literal("OG.value") == value)
					{
						OG.SetAttribute("selected", "selected");
						Script.Literal("OG.selected=true;");
						//return;
					}
					else if (OG.Attributes.GetNamedItem("selected") != null && OG.Attributes.GetNamedItem("selected").Value == "selected")
					{
						OG.RemoveAttribute("selected");
						Script.Literal("OG.selected=false;");
					}
				}
			}
		}

		/// <summary>
		/// Selected Value from the given Dropdown element id.
		/// </summary>
		/// <param name="id"></param>
		/// <returns></returns>
		public static string SelectedValue(string id)
		{
			Element E = Window.Document.GetElementById(id);
			if ((bool)Script.Literal("E.selectedIndex==-1"))
			{
				return null;
			}
			string v = (string)Script.Literal("E.options[E.selectedIndex].value", null);
			return v;
		}

		/// <summary>
		/// Selected Text from the given Dropdown element id.
		/// </summary>
		/// <param name="p"></param>
		/// <returns></returns>
		public static string SelectedText(string id)
		{
			Element E = Window.Document.GetElementById(id);
			if ((bool)Script.Literal("E.selectedIndex==-1"))
			{
				return null;
			}
			string v = (string)Script.Literal("E.options[E.selectedIndex].text", null);
			return v;

		}

		/// <summary>
		/// Sets the given Check Box to Un-Checked state
		/// </summary>
		/// <param name="Id"></param>
		public static void SetUnChecked(string Id)
		{
			if (Document.GetElementById(Id) == null)
			{
				return;
			}

			Script.Literal("document.getElementById ( {0}).checked=false", Id);
		}
		public static void RegisterEvent(string E, string eventName, ElementEventListener elementEventListener)
		{
			RegisterEvent2(Document.GetElementById(E), eventName, elementEventListener);
		}
		public static void RegisterClick(string id, ElementEventListener elementEventListener)
		{
			RegisterEvent2(Document.GetElementById(id), Events.Click, elementEventListener);
		}

		public static void RegisterClick2(string[] Elemes, ElementEventListener elementEventListener)
		{
			foreach (string E in Elemes)
			{
				RegisterEvent2(Document.GetElementById(E), Events.Click, elementEventListener);
			}
		}

		public static void DeRegisterClick(string id, ElementEventListener elementEventListener)
		{
			DeRegisterEvent2(Document.GetElementById(id), Events.Click, elementEventListener);
		}

		public static void RegisterEvent2(Element E, string eventName, ElementEventListener elementEventListener)
		{
			if (E == null)
			{
				return;
			}


			if ((bool)Script.Literal("E.addEventListener!=null"))
			{
				E.AddEventListener(eventName, elementEventListener, false);
			}
			else if ((bool)Script.Literal("E.attachEvent!=null"))
			{
				Script.Literal("{0}.attachEvent('on'+{1}, {2})", E, eventName, elementEventListener);
			}
			else
			{
				Script.Literal("{0}['on'+{1}]= {2}", E, eventName, elementEventListener);
			}

		}

		private static void DeRegisterEvent2(Element E, string eventName, ElementEventListener elementEventListener)
		{
			if (E == null)
			{
				return;
			}


			if ((bool)Script.Literal("E.removeEventListener!=null"))
			{
				E.RemoveEventListener(eventName, elementEventListener, false);
			}
			else if ((bool)Script.Literal("E.detachEvent!=null"))
			{
				Script.Literal("{0}.detachEvent('on'+{1}, {2})", E, eventName, elementEventListener);
			}
			else
			{
				Script.Literal("{0}['on'+{1}]={2}", E, eventName, elementEventListener);
			}
		}

		public static Element FindByClass(Element elem, string className)
		{
			ElementCollection coll = elem.Children;
			for (int i = 0; i < coll.Length; i++)
			{
				Element e2 = coll[i];

				if (e2.ClassName == className)
				{
					return e2;
				}
				Element e3 = FindByClass(e2, className);
				if (e3 != null)
				{
					return e3;
				}
			}
			return null;
		}
		public static void RegisterClick3(Element Elem, ElementEventListener elementEventListener)
		{

			RegisterEvent2(Elem, Events.Click, elementEventListener);

		}

		public static void RegisterChange(string E, ElementEventListener elementEventListener)
		{
			RegisterEvent2(Document.GetElementById(E), Events.Change, elementEventListener);
		}


		internal static void Prevent(ElementEvent e)
		{
			e.PreventDefault();
			e.StopPropagation();
			e.StopImmediatePropagation();
		}

		//public static string FindQuery(string key)
		//{
		//	try
		//	{
		//		Dictionary Q = BuildQuery();
		//		return (string)Q[key];
		//	}
		//	catch
		//	{
		//		return "";
		//	}
		//}

		//public static Dictionary BuildQuery()
		//{
		//	string queryString = Window.Location.Search.Substring(1);
		//	string[] D = queryString.Split('&');
		//	Dictionary Dict = new Dictionary();
		//	foreach (string d in D)
		//	{
		//		string[] lr = d.Split("=");
		//		if (lr[0] != "")
		//		{
		//			Dict[lr[0]] = lr[1];
		//		}
		//	}
		//	return Dict;
		//}


		internal static void SetVisible(string Id)
		{
			Element Elem = Window.Document.GetElementById(Id);
			if (Elem == null)
			{
				return;
			}
			Elem.Style.Visibility = "visible";
		}

		internal static void SetDisplay(string Id)
		{
			Element Elem = Window.Document.GetElementById(Id);
			if (Elem == null)
			{
				return;
			}
			Elem.Style.Display = "block";
		}

		internal static void NoDisplay(string Id)
		{
			Element Elem = Window.Document.GetElementById(Id);
			if (Elem == null)
			{
				return;
			}
			Elem.Style.Display = "none";
		}

		internal static bool IsAvailable(string Id)
		{
			return Window.Document.GetElementById(Id) != null;
		}

		internal static void SetClass(string Id, string className)
		{
			if (Util.IsAvailable(Id))
			{
				Document.GetElementById(Id).ClassName = className;
			}
		}

		internal static void Hide(string Id)
		{
			if (Util.IsAvailable(Id))
			{
				Window.Document.GetElementById(Id).Style.Visibility = "hidden";

			}
		}

		public static void ScrollTo(string Id)
		{
			if (Util.IsAvailable(Id))
			{
				try
				{
					Window.Document.GetElementById(Id).ScrollIntoView();
				}
				catch
				{
				}

			}
		}

		public static string NoTags(string s)
		{
			//Regex to be used..
			return s.ToLowerCase().Replace("<u>", "").Replace("</u>", "").Replace("<b>", "").Replace("<i>", "").Replace("</b>", "").Replace("</i>", "");
		}

		public static void SetFocus(string Id)
		{
			if (Document.GetElementById(Id) == null)
			{
				return;
			}
			else
			{
				Document.GetElementById(Id).Focus();
			}
		}

		public static void SetCheckedValue(string Id, bool value)
		{
			if (value)
			{
				Util.SetChecked(Id);
			}
			else
			{
				Util.SetUnChecked(Id);
			}
		}

		internal static int NoOfChildElements(Element Parent, string id)
		{
			int count = 0;
			for (int i = 0; i < Parent.Children.Length; i++)
			{
				Element e = Parent.Children[i];
				if (string.IsNullOrEmpty(id) || id == "*")
				{
					count++;
					continue;
				}
				if (id.ToLowerCase() == e.TagName.ToLowerCase())
				{
					count++;
				}
			}
			return count;
		}



		internal static void RegisterHover(string id, ElementEventListener MouseEnter, ElementEventListener MouseLeave)
		{
			Util.RegisterEvent(id, "mouseenter", MouseEnter);
			Util.RegisterEvent(id, "mouseleave", MouseLeave);
		}





		internal static bool IsEnalbed(string id)
		{
			return !Document.GetElementById(id).HasAttribute("disabled");

		}

		private static bool IsDisabled(string id)
		{
			return !IsEnalbed(id);

		}

		/// <summary>
		/// Binds a given template script id with the given data
		/// </summary>
		/// <param name="templateId"></param>
		/// <param name="Dict"></param>
		/// <returns></returns>
		public static string ApplyTemplate(string templateId, Dictionary Dict)
		{
			string template = Document.GetElementById(templateId).InnerHTML;
			string html = template;
			foreach (string Key in Dict.Keys)
			{
				html = html.ReplaceRegex(new RegularExpression("{" + Key + "}", "g"), Dict[Key].ToString());
			}
			return html;

		}

		/// <summary>
		/// Sets focus on First Editable Child Control : Currently supports Input,Select only
		/// </summary>
		/// <param name="id"></param>
		public static bool SetFocusOnEditableChild(Element E)
		{
			 
			for (int i = 0; i < E.Children.Length; i++)
			{
				Element OG = E.Children[i];
				switch (OG.TagName.ToLowerCase()) 
				{
					case "input": 
					case "select":
						Util.SetFocus(OG.ID);
						return true;

					default:
						bool found = SetFocusOnEditableChild(OG);
						if (found)
						{
							return true;
						}
						break;
				}
			}
				return false;
		}

		internal static void SetFocusOnEditableChildById(string targetId)
		{
			if (Util.IsAvailable(targetId))
			{
				SetFocusOnEditableChild(Document.GetElementById(targetId));
			}
		}
	}

}
