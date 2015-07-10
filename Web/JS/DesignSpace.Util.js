Events = function () { }
Events.click = 'click';
Events.change = 'change';


Util = function () { }
Util.isChecked = function (Id) {
	if (document.getElementById(Id) == null) {
		return false;
	}
	return document.getElementById(Id).checked;
}
Util.getValue = function (Id) {
	if (document.getElementById(Id) == null) {
		return '';
	}
	return document.getElementById(Id).value.toString();
}
Util.setChecked = function (Id) {
	if (document.getElementById(Id) == null) {
		return;
	}
	document.getElementById(Id).checked = true;
}
Util.setDisabled = function (Id) {
	if (document.getElementById(Id) == null) {
		return;
	}
	document.getElementById(Id).setAttribute('disabled', 'disabled');
}
Util.setEnabled = function (Id) {
	if (document.getElementById(Id) == null) {
		return;
	}
	document.getElementById(Id).removeAttribute('disabled');
}
Util.setValue = function (Id, D) {
	if (document.getElementById(Id) == null) {
		return;
	}
	document.getElementById(Id).value = D;
}
Util.addOptionItem = function (Name, Value, isGroup) {
	var O = window.document.createElement((isGroup) ? 'optgroup' : 'option');
	if (!isGroup) {
		O.innerHTML = Name;
	}
	O.setAttribute((isGroup) ? 'label' : 'value', Value);
	return O;
}
Util.setOption = function (id, value) {
	var E = document.getElementById(id);
	for (var i = 0; i < E.children.length; i++) {
		var OG = E.children[i];
		if (OG.tagName.toLowerCase() === 'optgroup') {
			for (var j = 0; j < OG.children.length; j++) {
				var O = OG.children[j];
				if (O.value === value) {
					O.setAttribute('selected', 'selected');
					O.selected = true;
				}
				else if (O.attributes.getNamedItem('selected') != null && O.attributes.getNamedItem('selected').value === 'selected') {
					O.removeAttribute('selected');
					O.selected = false;;
				}
			}
		}
		else {
			if (OG.value === value) {
				OG.setAttribute('selected', 'selected');
				OG.selected = true;;
			}
			else if (OG.attributes.getNamedItem('selected') != null && OG.attributes.getNamedItem('selected').value === 'selected') {
				OG.removeAttribute('selected');
				OG.selected = false;;
			}
		}
	}
}
Util.selectedValue = function (id) {
	var E = window.document.getElementById(id);
	if (E.selectedIndex == -1) {
		return null;
	}
	var v = E.options[E.selectedIndex].value;
	return v;
}
Util.removeOption = function (id, index) {
	var E = window.document.getElementById(id);
	E.remove(index);;
}
Util.selectedIndex = function (id) {
	var E = window.document.getElementById(id);
	var v = E.selectedIndex;
	return v;
}
Util.selectedText = function (id) {
	var E = window.document.getElementById(id);
	if (E.selectedIndex == -1) {
		return null;
	}
	var v = E.options[E.selectedIndex].text;
	return v;
}
Util.setUnChecked = function (Id) {
	if (document.getElementById(Id) == null) {
		return;
	}
	document.getElementById(Id).checked = false;
}
Util.registerEvent = function (E, eventName, elementEventListener) {
	Util.registerEvent2(document.getElementById(E), eventName, elementEventListener);
}

Util.registerClick = function (id, elementEventListener) {
	Util.registerEvent2(document.getElementById(id), 'click', elementEventListener);
}

Util.registerClick2 = function (Elemes, elementEventListener) {

	for (var i = 0; i < Elemes.length; i++) {
		var E = Elemes[i];
		Util.registerEvent2(document.getElementById(E), 'click', elementEventListener);
	}
}
Util.deRegisterClick = function (id, elementEventListener) {
	Util.deRegisterEvent2(document.getElementById(id), 'click', elementEventListener);
}
Util.deRegisterChange = function (id, elementEventListener) {
	Util.deRegisterEvent2(document.getElementById(id), 'change', elementEventListener);
}
Util.registerEvent2 = function (E, eventName, elementEventListener) {
	if (E == null) {
		return;
	}
	if (E.addEventListener != null) {
		E.addEventListener(eventName, elementEventListener, false);
	}
	else if (E.attachEvent != null) {
		E.attachEvent('on' + eventName, elementEventListener);
	}
	else {
		E['on' + eventName] = elementEventListener;
	}
}
Util.deRegisterEvent2 = function (E, eventName, elementEventListener) {
	if (E == null) {
		return;
	}
	if (E.removeEventListener != null) {
		E.removeEventListener(eventName, elementEventListener, false);
	}
	else if (E.detachEvent != null) {
		E.detachEvent('on' + eventName, elementEventListener);
	}
	else {
		E['on' + eventName] = elementEventListener;
	}
}
Util.findByClass = function (elem, className) {
	var coll = elem.children;
	for (var i = 0; i < coll.length; i++) {
		var e2 = coll[i];
		if (e2.className === className) {
			return e2;
		}
		var e3 = Util.findByClass(e2, className);
		if (e3 != null) {
			return e3;
		}
	}
	return null;
}
Util.registerClick3 = function (Elem, elementEventListener) {
	Util.registerEvent2(Elem, 'click', elementEventListener);
}

Util.registerChange = function (E, elementEventListener) {
	Util.registerEvent2(document.getElementById(E), 'change', elementEventListener);
}
Util.prevent = function (e) {
	e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();
}
Util.findQuery = function (key) {
	try {
		var Q = Util.buildQuery();
		return Q[key];
	}
	catch ($e1) {
		return '';
	}
}
Util.buildQuery = function () {
	var queryString = window.location.search;
	queryString = queryString.substr(1);
	var D = queryString.split('&');
	var Dict = {};
	for (d in Dict) {
		var lr = d.split('=');
		if (!!lr[0]) {
			Dict[lr[0]] = lr[1];
		}
	}
	return Dict;
}
Util.setVisible = function (Id) {
	var Elem = window.document.getElementById(Id);
	if (Elem == null) {
		return;
	}
	Elem.style.visibility = 'visible';
}
Util.setDisplay = function (Id) {
	var Elem = window.document.getElementById(Id);
	if (Elem == null) {
		return;
	}
	Elem.style.display = 'block';
}
Util.setDisplayInline = function (Id) {
	var Elem = window.document.getElementById(Id);
	if (Elem == null) {
		return;
	}
	Elem.style.display = 'inline-block';
}
Util.noDisplay = function (Id) {
	var Elem = window.document.getElementById(Id);
	if (Elem == null) {
		return;
	}
	Elem.style.display = 'none';
}
Util.isAvailable = function (Id) {
	return window.document.getElementById(Id) != null;
}
Util.setClass = function (Id, className) {
	if (Util.isAvailable(Id)) {
		document.getElementById(Id).className = className;
	}
}
Util.hide = function (Id) {
	if (Util.isAvailable(Id)) {
		window.document.getElementById(Id).style.visibility = 'hidden';
	}
}
Util.scrollTo = function (Id) {
	if (Util.isAvailable(Id)) {
		try {
			window.document.getElementById(Id).scrollIntoView();
		}
		catch ($e1) { }
	}
}
Util.setFocus = function (Id) {
	if (document.getElementById(Id) == null) {
		return;
	}
	else {
		document.getElementById(Id).focus();
	}
}
Util.setCheckedValue = function (Id, value) {
	if (value) {
		Util.setChecked(Id);
	}
	else {
		Util.setUnChecked(Id);
	}
}
Util.noOfChildElements = function (Parent, tagName) {
	var count = 0;
	for (var i = 0; i < Parent.children.length; i++) {
		var e = Parent.children[i];
		if (String.isNullOrEmpty(tagName) || tagName === '*') {
			count++;
			continue;
		}
		if (tagName.toLowerCase() === e.tagName.toLowerCase()) {
			count++;
		}
	}
	return count;
}

Util.registerHover = function (id, MouseEnter, MouseLeave) {
	Util.registerEvent(id, 'mouseenter', MouseEnter);
	Util.registerEvent(id, 'mouseleave', MouseLeave);
}

Util.isEnalbed = function (id) {
	return !document.getElementById(id).hasAttribute('disabled');
}

Util.isDisabled = function (id) {
	return !Util.isEnalbed(id);
}

Util.applyTemplate = function (templateId, Dict) {
	var template = document.getElementById(templateId).innerHTML;
	var html = template;
	for (var Key in Dict) {
		html = html.replace(new RegExp('{' + Key + '}', 'g'), Dict[Key].toString());
	}
	return html;
}
Util.setFocusOnEditableChild = function (E) {
	for (var i = 0; i < E.children.length; i++) {
		var OG = E.children[i];
		switch (OG.tagName.toLowerCase()) {
			case 'input':
			case 'select':
				Util.setFocus(OG.id);
				return true;
			default:
				var found = Util.setFocusOnEditableChild(OG);
				if (found) {
					return true;
				}
				break;
		}
	}
	return false;
}
Util.setFocusOnEditableChildById = function (targetId) {
	if (Util.isAvailable(targetId)) {
		Util.setFocusOnEditableChild(document.getElementById(targetId));
	}
}
Util.findByTagName = function (elem, tagName) {
	var coll = elem.children;
	for (var i = 0; i < coll.length; i++) {
		var e2 = coll[i];
		if (e2.tagName.toLowerCase() === tagName.toLowerCase()) {
			return e2;
		}
		var e3 = Util.findByClass(e2, tagName);
		if (e3 != null) {
			return e3;
		}
	}
	return null;
}



XmlUtil = function () { }
XmlUtil.toXml = function (obj) {
	var s = '';
	for (var i = 0; i < Object.keys(obj).length; i++) {
		var key = Object.keys(obj)[i];
		var val = obj[key];
		var type = typeof val;
		switch (type) {
			case 'object':
				s = s + '<' + key + '>';
				s = s + XmlUtil.toXml(val);
				s = s + '</' + key + '>';
				break;
			default:
				s = s + '<' + key + '>';
				s = s + val;
				s = s + '</' + key + '>';
				break;
		}
	}
	return s;
}
XmlUtil.getAttrib = function (name, nullable) {
	if (nullable != null) {
		return name + '="' + nullable + '" ';
	}
	return '';
}
XmlUtil.getAttrib3 = function (name, val) {
	if (val != null && !!val.toString().trim()) {
		return name + '="' + val + '" ';
	}
	return '';
}
XmlUtil.getAttrib2 = function (name, val) {
	if (val != null && !!val) {
		return name + '="' + val + '" ';
	}
	return '';
}
XmlUtil.getNode = function (name, val) {
	if (val != null && !!val) {
		return '<' + name + '>' + val + '</' + name + '>';
	}
	return '';
}



//Part of mscorlib.js Find an alternative.
isNullOrUndefine = function (o) {
	return (o === null) || (o === undefined);
}
String.isNullOrEmpty = function (a) { return !a || !a.length };

