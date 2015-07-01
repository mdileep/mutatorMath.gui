PageWorker = function () { }
PageWorker.prototype = {
	init: function () {
		Worker.registerEvents();
		Worker.pageInit();
	}
}

Worker = function () { }
Worker.pageInit = function () {
	SourcesWorker.init();
	InstancesWorker.init();
}
Worker.registerEvents = function () {
	SourcesWorker.registerEvents();
	InstancesWorker.registerEvents();
}

InstancesWorker = function () { }
InstancesWorker.init = function () {
	InstancesWorker.addInstance();
}

InstancesWorker._addNameHandler = null;
InstancesWorker._removeNameHandler = null;
InstancesWorker._addDimensionHandler = null;
InstancesWorker._removeDimensionHandler = null;
InstancesWorker._disposeHandler = null;

InstancesWorker.registerEvents = function () {
	InstancesWorker._addNameHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addName(rowId, 'instance.selName_', 'isntance.name_', 'instance.removeName_', 'instance.names_', InstancesWorker._removeNameHandler);
	};
	InstancesWorker._removeNameHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeControl(rowId, 'instance.selName_', 'instance.removeName_', 'isntance.name_', InstancesWorker._removeNameHandler);
	};
	InstancesWorker._addDimensionHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addDimension(rowId, 'instance.selMetric_', 'instance.metric_', 'instance.removeMetric_', 'instance.metrics_', InstancesWorker._removeDimensionHandler);
	};
	InstancesWorker._removeDimensionHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeControl(rowId, 'instance.selMetric_', 'instance.removeMetric_', 'instance.metric_', InstancesWorker._removeDimensionHandler);
	};
	InstancesWorker._disposeHandler = function (e) {
		InstancesWorker._addNameHandler = null;
		InstancesWorker._addDimensionHandler = null;
		InstancesWorker._removeDimensionHandler = null;
	};
}
InstancesWorker.addInstance = function () {
	var Instances = document.getElementById('instances');
	var n = Util.noOfChildElements(Instances, 'li');
	if (!n) {
		n = 1;
	}
	while (document.getElementById('instance_' + n) != null) {
		n = n + 1;
	}
	var rowId = n.toString();
	var dic = {};
	dic['ID'] = rowId;
	var html = Util.applyTemplate('InstanceTemplate', dic);
	var instance = document.createElement('li');
	instance.innerHTML = html;
	Instances.appendChild(instance);
	var srcElem = document.getElementById('instance_' + rowId);
	Util.registerClick('instance.addName_' + rowId, InstancesWorker._addNameHandler);
	Util.registerClick('instance.addMetric_' + rowId, InstancesWorker._addDimensionHandler);
}
InstancesWorker.removeInstance = function (rowId) {
	var Instances = document.getElementById('instances');
	var n = Util.noOfChildElements(Instances, 'li');
	if (n === 1) {
		InstancesWorker.resetInstance(rowId);
		return;
	}
	var srcElem = document.getElementById('instance_' + rowId);
	Util.deRegisterClick('instance.addName_' + rowId, InstancesWorker._addNameHandler);
	Util.deRegisterClick('instance.addMetric_' + rowId, InstancesWorker._addDimensionHandler);
	InternalWorker.removeControlSet(rowId, 'instance.removeMetric_', 'instance.metric_', InstancesWorker._removeDimensionHandler);
	InternalWorker.removeControlSet(rowId, 'instance.removeName_', 'isntance.name_', InstancesWorker._removeNameHandler);
	srcElem.parentNode.parentNode.removeChild(srcElem.parentNode);
}
InstancesWorker.resetInstance = function (rowId) { }



SourcesWorker = function () { }
SourcesWorker.init = function () {
	Util.registerClick('source.add', SourcesWorker._addHandler);
	SourcesWorker.addSource();
}

SourcesWorker._removeHandler = null;
SourcesWorker._addHandler = null;
SourcesWorker._mouseEnterHandler = null;
SourcesWorker._mouseLeaveHandler = null;
SourcesWorker._muteInfoHandler = null;
SourcesWorker._copyInfoHandler = null;
SourcesWorker._copyGroupsHandler = null;
SourcesWorker._copyLibHandler = null;
SourcesWorker._addDimensionHandler = null;
SourcesWorker._removeDimensionHandler = null;
SourcesWorker._disposeHandler = null;

SourcesWorker.registerEvents = function () {
	SourcesWorker._addHandler = function (e) {
		SourcesWorker.addSource();
	};
	SourcesWorker._removeHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		SourcesWorker.removeSource(rowId);
	};
	SourcesWorker._mouseEnterHandler = function (e) {
		SourcesWorker.hoverHandler(e, true);
	};
	SourcesWorker._mouseLeaveHandler = function (e) {
		SourcesWorker.hoverHandler(e, false);
	};
	SourcesWorker._muteInfoHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		if (Util.isChecked('muteInfo_' + rowId)) {
			Util.setDisabled('copyInfo_' + rowId);
		}
		else {
			Util.setEnabled('copyInfo_' + rowId);
		}
		Util.setUnChecked('copyInfo_' + rowId);
	};
	SourcesWorker._copyInfoHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		SourcesWorker.handleCopyInfo(rowId);
	};
	SourcesWorker._copyGroupsHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		SourcesWorker.handleCopyGroups(rowId);
	};
	SourcesWorker._copyLibHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		SourcesWorker.handleCopyLib(rowId);
	};
	SourcesWorker._addDimensionHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addDimension(rowId, 'source.selMetric_', 'source.metric_', 'source.removeMetric_', 'source.metrics_', SourcesWorker._removeDimensionHandler);
	};
	SourcesWorker._removeDimensionHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeControl(rowId, 'source.selMetric_', 'source.removeMetric_', 'source.metric_', SourcesWorker._removeDimensionHandler);
	};
	SourcesWorker._disposeHandler = function (e) {
		SourcesWorker._removeHandler = null;
		SourcesWorker._addHandler = null;
		SourcesWorker._mouseEnterHandler = null;
		SourcesWorker._mouseLeaveHandler = null;
		SourcesWorker._muteInfoHandler = null;
		SourcesWorker._copyInfoHandler = null;
		SourcesWorker._copyGroupsHandler = null;
		SourcesWorker._copyLibHandler = null;
		SourcesWorker._addDimensionHandler = null;
		SourcesWorker._removeDimensionHandler = null;
		SourcesWorker._disposeHandler = null;
	};
}
SourcesWorker.addSource = function () {
	var Sources = document.getElementById('sources');
	var n = Util.noOfChildElements(Sources, 'li');
	if (!n) {
		n = 1;
	}
	while (document.getElementById('source_' + n) != null) {
		n = n + 1;
	}
	var rowId = n.toString();
	var dic = {};
	dic['ID'] = rowId;
	var html = Util.applyTemplate('SourceTemplate', dic);
	var source = document.createElement('li');
	source.innerHTML = html;
	Sources.appendChild(source);
	Util.registerClick('source.remove_' + rowId, SourcesWorker._removeHandler);
	Util.registerClick('muteInfo_' + rowId, SourcesWorker._muteInfoHandler);
	Util.registerClick('copyInfo_' + rowId, SourcesWorker._copyInfoHandler);
	Util.registerClick('copyGroups_' + rowId, SourcesWorker._copyGroupsHandler);
	Util.registerClick('copyLib_' + rowId, SourcesWorker._copyLibHandler);
	Util.registerClick('source.addMetric_' + rowId, SourcesWorker._addDimensionHandler);
	SourcesWorker.handleCopyInfo(null);
	SourcesWorker.handleCopyGroups(null);
	SourcesWorker.handleCopyLib(null);
	Util.setFocus(SourcesWorker.txtSourceName + rowId);
}
SourcesWorker.removeSource = function (rowId) {
	var Sources = document.getElementById('sources');
	var n = Util.noOfChildElements(Sources, 'li');
	if (n === 1) {
		SourcesWorker.resetSource(rowId);
		return;
	}
	var srcElem = document.getElementById('source_' + rowId);
	Util.deRegisterClick('source.remove_' + rowId, SourcesWorker._removeHandler);
	Util.deRegisterClick('muteInfo_' + rowId, SourcesWorker._muteInfoHandler);
	Util.deRegisterClick('copyInfo_' + rowId, SourcesWorker._copyInfoHandler);
	Util.deRegisterClick('copyGroups_' + rowId, SourcesWorker._copyGroupsHandler);
	Util.deRegisterClick('copyLib_' + rowId, SourcesWorker._copyLibHandler);
	Util.deRegisterClick('source.addMetric_' + rowId, SourcesWorker._addDimensionHandler);
	InternalWorker.removeControlSet(rowId, 'source.removeMetric_', 'source.metric_', SourcesWorker._removeDimensionHandler);
	srcElem.parentNode.parentNode.removeChild(srcElem.parentNode);
}
SourcesWorker.resetSource = function (rowId) { }
SourcesWorker.handleCopyInfo = function (rowId) {
	if (rowId == null) {
		rowId = InternalWorker.findCheckedRowId('copyInfo_', 'sources');
	}
	if (rowId == null) {
		return;
	}
	var isCheked = Util.isChecked('copyInfo_' + rowId);
	var Sources = document.getElementById('sources');
	var n = Util.noOfChildElements(Sources, 'li');
	for (var i = 1; i <= n; i++) {
		if (i.toString() === rowId) {
			continue;
		}
		if (isCheked) {
			Util.setDisabled('copyInfo_' + i);
			Util.setEnabled('muteInfo_' + i);
			Util.setChecked('muteInfo_' + i);
		}
		else {
			Util.setEnabled('copyInfo_' + i);
			Util.setUnChecked('muteInfo_' + i);
		}
		Util.setUnChecked('copyInfo_' + i);
	}
}
SourcesWorker.handleCopyLib = function (rowId) {
	InternalWorker.checkBoxesAsRaidos('copyLib_', rowId, 'sources');
}
SourcesWorker.handleCopyGroups = function (rowId) {
	InternalWorker.checkBoxesAsRaidos('copyGroups_', rowId, 'sources');
}
SourcesWorker.hoverHandler = function (e, isEnter) {
	var rowId = InternalWorker.findRowId(e);
	if (isEnter) {
		Util.setVisible('source.remove_' + rowId);
	}
	else {
		Util.hide('source.remove_' + rowId);
	}
}




InternalWorker = function () { }
InternalWorker.addName = function (rowId, select, liTarget, btnRemove, olTarget, removeNameHandler) {
	InternalWorker.addControl('NameTemplate', rowId, select, liTarget, btnRemove, olTarget, removeNameHandler);
}
InternalWorker.addDimension = function (rowId, select, liTarget, btnRemove, olTarget, removeDimensionHandler) {
	InternalWorker.addControl('DimensionTemplate', rowId, select, liTarget, btnRemove, olTarget, removeDimensionHandler);
}
InternalWorker.removeControlSet = function (rowId, removePreFix, parentPreFix, removeDimensionHandler) {
	var olId = parentPreFix + rowId;
	if (Util.isAvailable(olId)) {
		var ol = document.getElementById(olId);
		for (var i = 0; i < ol.children.length; i++) {
			var li = ol.children[i];
			if (li.tagName.toLowerCase() === 'li') {
				var postFix = li.id.substr(li.id.indexOf('_') + 1);
				Util.deRegisterClick(removePreFix + postFix, removeDimensionHandler);
			}
		}
	}
}
InternalWorker.addControl = function (templateName, rowId, select, liTarget, btnRemove, olTarget, removeHandler) {
	var index = Util.selectedIndex(select + rowId);
	if (index === -1) {
		return;
	}
	var val = Util.selectedValue(select + rowId);
	var text = Util.selectedText(select + rowId);
	Util.removeOption(select + rowId, index);
	var n = Util.noOfChildElements(document.getElementById(select + rowId), 'option');
	if (!n) {
		Util.noDisplay(select + rowId);
		Util.setDisplay(select + rowId + '.lbl');
	}
	var postFix = val + '_' + rowId;
	var targetId = liTarget + postFix;
	if (document.getElementById(targetId) != null) {
		Util.setFocusOnEditableChildById(targetId);
		return;
	}
	var Dict = {};
	Dict['ID'] = rowId;
	Dict['value'] = val;
	Dict['text'] = text;
	Dict['prefix'] = btnRemove;
	var html = Util.applyTemplate(templateName, Dict);
	var li = document.createElement('li');
	li.setAttribute('id', targetId);
	li.setAttribute('text', text);
	li.setAttribute('value', val);
	li.innerHTML = html;
	var ol = document.getElementById(olTarget + rowId);
	ol.appendChild(li);
	InternalWorker.toggleHead(ol);
	Util.setFocusOnEditableChildById(targetId);
	Util.registerClick(btnRemove + val + '_' + rowId, removeHandler);
}
InternalWorker.removeControl = function (rowId, select, btnRemove, parentPreFix, removeDimensionHanlder) {
	Util.deRegisterClick(btnRemove + rowId, removeDimensionHanlder);
	var li = document.getElementById(parentPreFix + rowId);
	if (select != null) {
		var text = li.getAttribute('text');
		var value = li.getAttribute('value');
		var Option = document.createElement('option');
		Option.innerHTML = text;
		Option.setAttribute('value', value);
		var parentRowId = rowId.substr(rowId.indexOf('_') + 1);
		var E = document.getElementById(select + parentRowId);
		E.appendChild(Option);
		Util.setDisplay(select + parentRowId);
		Util.noDisplay(select + parentRowId + '.lbl');
	}
	var ol = li.parentNode;
	ol.removeChild(li);
	InternalWorker.toggleHead(ol);
}
InternalWorker.checkBoxesAsRaidos = function (prefix, rowId, parent) {
	if (rowId == null) {
		rowId = InternalWorker.findCheckedRowId(prefix, parent);
	}
	if (rowId == null) {
		return;
	}
	var isCheked = Util.isChecked(prefix + rowId);
	var Sources = document.getElementById(parent);
	var n = Util.noOfChildElements(Sources, 'li');
	for (var i = 1; i <= n; i++) {
		if (i.toString() === rowId) {
			continue;
		}
		if (isCheked) {
			Util.setDisabled(prefix + i);
		}
		else {
			Util.setEnabled(prefix + i);
		}
		Util.setUnChecked(prefix + i);
	}
}
InternalWorker.findCheckedRowId = function (preFix, parent) {
	var Sources = document.getElementById(parent);
	var n = Util.noOfChildElements(Sources, 'li');
	for (var i = 1; i <= n; i++) {
		var isCheked = Util.isChecked(preFix + i) && Util.isEnalbed(preFix + i);
		if (isCheked) {
			return i.toString();
		}
	}
	return null;
}
InternalWorker.findRowId = function (e) {
	var elem = (e.srcElement != null) ? e.srcElement : e.target;
	var elemId = elem.id;
	var rowId = elemId.substr(elemId.indexOf('_') + 1);
	return rowId;
}
InternalWorker.toggleHead = function (ol) {
	var n = Util.noOfChildElements(ol, 'li');
	var h4 = Util.findByTagName(ol.parentNode, 'h4');
	if (h4 != null) {
		h4.style.display = (n >= 1) ? 'block' : 'none';
	}
}
