

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
	ComputeWorker.init();
}
Worker.registerEvents = function () {
	SourcesWorker.registerEvents();
	InstancesWorker.registerEvents();
	ComputeWorker.registerEvents();
}



ComputeWorker = function () { }
ComputeWorker.init = function () {
	Util.registerClick('btn.compute', ComputeWorker._computeHandler);
	Util.registerClick('btn.run', ComputeWorker._runHandler);
	ComputeWorker.compute();
}
ComputeWorker.registerEvents = function () {
	ComputeWorker._computeHandler = function (e) {
		ComputeWorker.compute();
	};
	ComputeWorker._runHandler = function (e) {
		ComputeWorker.run();
	};
}
ComputeWorker.compute = function () {
	var sources = SourcesWorker.getSources();
	var instances = InstancesWorker.getInstances();
	var designSpace = new DesignerSpace.designspace();
	designSpace.sources = sources;
	designSpace.instances = instances;
	designSpace.format = 3;
	var xml = designSpace.toXml();
	xml = vkbeautify.xml(xml);
	Util.setValue('txt.xml', xml);
	Util.setValue('instance', instances[0].filename);
	document.getElementById('code').innerHTML = textToHtml(xml);
	prettyPrint();
}
ComputeWorker.run = function () {
	ComputeWorker.compute();
	var frm = document.getElementById('frmRun');
	frm.submit();
}



InstancesWorker = function () { }
InstancesWorker.init = function () {
	Util.registerClick('instance.add', InstancesWorker.addHandler);
	InstancesWorker.addInstance();
}
InstancesWorker.registerEvents = function () {
	InstancesWorker.addHandler = function (e) {
		InstancesWorker.addInstance();
	};
	InstancesWorker.removeHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		InstancesWorker.removeInstance(rowId);
	};
	InstancesWorker.addNameHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addName(rowId, 'instance.selName_', 'isntance.name_', 'instance.names.remove_', 'instance.names', InstancesWorker.removeNameHandler);
	};
	InstancesWorker.removeNameHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeControl(rowId, 'instance.selName_', 'instance.names.remove_', 'isntance.name_', InstancesWorker.removeNameHandler);
	};
	InstancesWorker.addDimensionHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addDimension(rowId, 'instance.selMetric_', 'instance.metric_', 'instance.metrics.remove_', 'instance.metrics', InstancesWorker.removeDimensionHandler);
	};
	InstancesWorker.removeDimensionHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeControl(rowId, 'instance.selMetric_', 'instance.metrics.remove_', 'instance.metric_', InstancesWorker.removeDimensionHandler);
	};
	InstancesWorker.disposeHandler = function (e) {
		InstancesWorker.addHandler = null;
		InstancesWorker.removeHandler = null;
		InstancesWorker.addNameHandler = null;
		InstancesWorker.addDimensionHandler = null;
		InstancesWorker.removeDimensionHandler = null;
		InstancesWorker.disposeHandler = null;
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
	Util.registerClick('instance.addName_' + rowId, InstancesWorker.addNameHandler);
	Util.registerClick('instance.addMetric_' + rowId, InstancesWorker.addDimensionHandler);
	Util.registerClick('instance.remove_' + rowId, InstancesWorker.removeHandler);
}
InstancesWorker.removeInstance = function (rowId) {
	var Instances = document.getElementById('instances');
	var srcElem = document.getElementById('instance_' + rowId);
	Util.deRegisterClick('instance.addName_' + rowId, InstancesWorker.addNameHandler);
	Util.deRegisterClick('instance.addMetric_' + rowId, InstancesWorker.addDimensionHandler);
	Util.deRegisterClick('instance.remove_' + rowId, InstancesWorker.removeHandler);
	InternalWorker.removeControlSet(rowId, 'instance.metrics.remove_', 'instance.metric_', InstancesWorker.removeDimensionHandler);
	InternalWorker.removeControlSet(rowId, 'instance.names.remove_', 'instance.metric_', InstancesWorker.removeNameHandler);
	srcElem.parentNode.parentNode.removeChild(srcElem.parentNode);
	var n = Util.noOfChildElements(Instances, 'li');
	if (!n) {
		InstancesWorker.addInstance();
	}
}
InstancesWorker.resetInstance = function (rowId) { }
InstancesWorker.getInstances = function () {
	var Instances = document.getElementById('instances');
	var n = Util.noOfChildElements(Instances, 'li');
	var instances = new Array(n);
	var running = 0;
	for (var i = 0; i < Instances.children.length; i++) {
		var li = Instances.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var instance = InstancesWorker.getInstance(li);
			instances[running++] = instance;
		}
	}
	return instances;
}
InstancesWorker.getInstance = function (li) {
	var n = Util.noOfChildElements(li, 'div');
	if (!n) {
		return null;
	}
	var id = li.children[0].id;
	var rowId = id.substr(id.indexOf('_') + 1);
	var obj = new DesignerSpace.instance();
	obj.familyname = Util.getValue(InstancesWorker.txtInstanceName + rowId);
	obj.filename = Util.getValue(InstancesWorker.txtInstanceName + rowId);
	return obj;
}



SourcesWorker = function () { }
SourcesWorker.init = function () {
	SourcesWorker.uploadTracker = {};
	Util.registerClick('source.add', SourcesWorker.addHandler);
	SourcesWorker.addSource();
}
SourcesWorker.registerEvents = function () {
	SourcesWorker.addHandler = function (e) {
		SourcesWorker.addSource();
	};
	SourcesWorker.removeHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		SourcesWorker.removeSource(rowId);
	};
	SourcesWorker.fileSelectedHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		SourcesWorker._fileSelected(rowId);
	};
	SourcesWorker.mouseEnterHandler = function (e) {
		SourcesWorker.hoverHandler(e, true);
	};
	SourcesWorker.mouseLeaveHandler = function (e) {
		SourcesWorker.hoverHandler(e, false);
	};
	SourcesWorker.muteInfoHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		if (Util.isChecked('muteInfo_' + rowId)) {
			Util.setDisabled('copyInfo_' + rowId);
		}
		else {
			Util.setEnabled('copyInfo_' + rowId);
		}
		Util.setUnChecked('copyInfo_' + rowId);
	};
	SourcesWorker.copyInfoHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		SourcesWorker.handleCopyInfo(rowId);
	};
	SourcesWorker.copyGroupsHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		SourcesWorker.handleCopyGroups(rowId);
	};
	SourcesWorker.copyLibHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		SourcesWorker.handleCopyLib(rowId);
	};
	SourcesWorker.addDimensionHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addDimension(rowId, 'source.selMetric_', 'source.metric_', 'source.metrics.remove_', 'source.metrics', SourcesWorker.removeDimensionHandler);
	};
	SourcesWorker.removeDimensionHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeControl(rowId, 'source.selMetric_', 'source.metrics.remove_', 'source.metric_', SourcesWorker.removeDimensionHandler);
	};
	SourcesWorker.disposeHandler = function (e) {
		SourcesWorker.addHandler = null;
		SourcesWorker.removeHandler = null;
		SourcesWorker.mouseEnterHandler = null;
		SourcesWorker.mouseLeaveHandler = null;
		SourcesWorker.muteInfoHandler = null;
		SourcesWorker.copyInfoHandler = null;
		SourcesWorker.copyGroupsHandler = null;
		SourcesWorker.copyLibHandler = null;
		SourcesWorker.addDimensionHandler = null;
		SourcesWorker.removeDimensionHandler = null;
		SourcesWorker.fileSelectedHandler = null;
		SourcesWorker.disposeHandler = null;
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
	Util.registerClick('source.remove_' + rowId, SourcesWorker.removeHandler);
	Util.registerClick('muteInfo_' + rowId, SourcesWorker.muteInfoHandler);
	Util.registerClick('copyInfo_' + rowId, SourcesWorker.copyInfoHandler);
	Util.registerClick('copyGroups_' + rowId, SourcesWorker.copyGroupsHandler);
	Util.registerClick('copyLib_' + rowId, SourcesWorker.copyLibHandler);
	Util.registerClick('source.addMetric_' + rowId, SourcesWorker.addDimensionHandler);
	Util.registerChange('file_' + rowId, SourcesWorker.fileSelectedHandler);
	SourcesWorker.handleCopyInfo(null);
	SourcesWorker.handleCopyGroups(null);
	SourcesWorker.handleCopyLib(null);
	Util.setFocus(SourcesWorker.txtSourceName + rowId);
}
SourcesWorker.removeSource = function (rowId) {
	if (SourcesWorker.uploadTracker[rowId] === 1) {
		alert('Upload file is in progress please wait.');
		return;
	}
	var Sources = document.getElementById('sources');
	var srcElem = document.getElementById('source_' + rowId);
	Util.deRegisterClick('source.remove_' + rowId, SourcesWorker.removeHandler);
	Util.deRegisterClick('muteInfo_' + rowId, SourcesWorker.muteInfoHandler);
	Util.deRegisterClick('copyInfo_' + rowId, SourcesWorker.copyInfoHandler);
	Util.deRegisterClick('copyGroups_' + rowId, SourcesWorker.copyGroupsHandler);
	Util.deRegisterClick('copyLib_' + rowId, SourcesWorker.copyLibHandler);
	Util.deRegisterClick('source.addMetric_' + rowId, SourcesWorker.addDimensionHandler);
	Util.deRegisterChange('file_' + rowId, SourcesWorker.fileSelectedHandler);
	InternalWorker.removeControlSet(rowId, 'source.metrics.remove_', 'source.metric_', SourcesWorker.removeDimensionHandler);
	srcElem.parentNode.parentNode.removeChild(srcElem.parentNode);
	var n = Util.noOfChildElements(Sources, 'li');
	if (!n) {
		SourcesWorker.addSource();
	}
}
SourcesWorker.resetSource = function (rowId) { }
SourcesWorker.getSources = function () {
	var Sources = document.getElementById('sources');
	var n = Util.noOfChildElements(Sources, 'li');
	var sources = new Array(n);
	var running = 0;
	for (var i = 0; i < Sources.children.length; i++) {
		var li = Sources.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var source = SourcesWorker.getSource(li);
			sources[running++] = source;
		}
	}
	return sources;
}
SourcesWorker.getSource = function (li) {
	var n = Util.noOfChildElements(li, 'div');
	if (!n) {
		return null;
	}
	var id = li.children[0].id;
	var rowId = id.substr(id.indexOf('_') + 1);
	var obj = new DesignerSpace.source();
	obj.name = Util.getValue(SourcesWorker.txtSourceName + rowId);
	obj.filename =  Util.getValue(SourcesWorker.txtSourceName + rowId);
	obj.info = SourcesWorker.getInfo(rowId);
	obj.lib = SourcesWorker.getLib(rowId);
	obj.groups = SourcesWorker.getLib(rowId);
	obj.kerning = SourcesWorker.getKerning(rowId);
	obj.location = SourcesWorker.getLocation(rowId);
	obj.glyphs = SourcesWorker.getGlyphs(rowId);
	return obj;
}
SourcesWorker.getGlyphs = function (rowId) {
	return null;
}
SourcesWorker.getLocation = function (rowId) {
	var loc = new DesignerSpace.location();
	loc.dimensions = SourcesWorker.getDimensions(rowId);
	return loc;
}
SourcesWorker.getDimensions = function (rowId) {
	var olMetric2 = document.getElementById('source.metrics' + '_' + rowId);
	var n = Util.noOfChildElements(olMetric2, 'li');
	var dimensions = new Array(n);
	var running = 0;
	for (var i = 0; i < olMetric2.children.length; i++) {
		var li = olMetric2.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var dimension = SourcesWorker.getDimension(li, rowId);
			dimensions[running++] = dimension;
		}
	}
	return dimensions;
}
SourcesWorker.getDimension = function (li, rowId) {
	var dimension = new DesignerSpace.dimension();
	dimension.name = li.getAttribute('value');
	dimension.xvalue = Util.getValue('source.metrics' + '.x_' + dimension.name + '_' + rowId);
	dimension.yvalue = Util.getValue('source.metrics' + '.y_' + dimension.name + '_' + rowId);
	return dimension;
}
SourcesWorker.getKerning = function (rowId) {
	var kerning = new DesignerSpace.muteOnly();
	kerning.mute = InternalWorker.isChecked('muteKerning_' + rowId);
	return kerning;
}
SourcesWorker.getLib = function (rowId) {
	var lib = new DesignerSpace.copyOnly();
	lib.copy = InternalWorker.isChecked('copyLib_' + rowId);
	return lib;
}
SourcesWorker.getInfo = function (rowId) {
	var info = new DesignerSpace.copyAndMute();
	info.copy = InternalWorker.isChecked('copyInfo_' + rowId);
	info.mute = InternalWorker.isChecked('muteInfo_' + rowId);
	return info;
}
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
SourcesWorker._fileSelected = function (rowId) {
	Util.noDisplay('uploader_' + rowId);
	Util.setDisplayInline('processing_' + rowId);
	var formElem = document.getElementById('form_' + rowId);
	formElem.submit();
	SourcesWorker.uploadTracker[rowId] = 1;
}
SourcesWorker.successCallBack = function (rowId, destPath) {
	window.setTimeout(function () {
		SourcesWorker.uploadTracker[rowId] = 0;
		Util.noDisplay('processing_' + rowId);
		Util.setDisplayInline('source.ui_' + rowId);
		Util.setValue(SourcesWorker.txtSourceName + rowId, destPath);
	}, 400);
}
SourcesWorker.errorCallBack = function (rowId, error) {
	window.setTimeout(function () {
		SourcesWorker.uploadTracker[rowId] = 0;
		Util.setDisplayInline('uploader_' + rowId);
		Util.noDisplay('processing_' + rowId);
	}, 400);
	alert('Error was thrown by Server. Please try again.\n Details:' + error);
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
	Dict['prefix'] = olTarget;
	var html = Util.applyTemplate(templateName, Dict);
	var li = document.createElement('li');
	li.setAttribute('id', targetId);
	li.setAttribute('text', text);
	li.setAttribute('value', val);
	li.innerHTML = html;
	var ol = document.getElementById(olTarget + '_' + rowId);
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
InternalWorker.isChecked = function (id) {
	if (Util.isDisabled(id)) {
		return null;
	}
	else {
		return ((Util.isChecked(id)) ? 1 : 0);
	}
}

//START of DesignerSpace
DesignerSpace = {};
DesignerSpace.designspace = function () { }
DesignerSpace.designspace.prototype = {
	sources: null,
	instances: null,
	format: 0,

	toXml: function () {
		var sources = this.sourcesToXml(this.sources);
		var instances = this.instancesToXml(this.instances);
		var xml2 = '<?xml version="1.0" ?><designspace ';
		xml2 = xml2 + XmlUtil.getAttrib2('format', this.format.toString());
		xml2 = xml2.trim() + '>';
		xml2 = xml2 + sources;
		xml2 = xml2 + instances;
		xml2 = xml2 + '</designspace>';
		return xml2;
	},

	sourcesToXml: function (sources) {
		var innerNodes = '';
		if (sources != null) {
			for (var i = 0; i < sources.length; i++) {
				if (sources[i] != null) {
					innerNodes = innerNodes + sources[i].toXml();
				}
			}
		}
		return '<sources>' + innerNodes + '</sources>';
	},

	instancesToXml: function (instances) {
		var innerNodes = '';
		if (instances != null) {
			for (var i = 0; i < instances.length; i++) {
				if (instances[i] != null) {
					innerNodes = innerNodes + instances[i].toXml();
				}
			}
		}
		return '<instances>' + innerNodes + '</instances>';
	}
}



DesignerSpace.location = function () { }
DesignerSpace.location.prototype = {
	dimensions: null,

	toXml: function () {
		if (this.dimensions == null) {
			return '';
		}
		var s = '';
		var innerNodes = this.dimensionsAsXml(this.dimensions);
		if (!!innerNodes) {
			s = '<location>' + innerNodes + '</location>';
		}
		return s;
	},

	dimensionsAsXml: function (dimensions) {
		var innerNodes = '';
		if (dimensions != null) {
			for (var i = 0; i < dimensions.length; i++) {
				if (dimensions[i] != null) {
					innerNodes = innerNodes + dimensions[i].toXml();
				}
			}
		}
		return innerNodes;
	}
}



DesignerSpace.source = function () { }
DesignerSpace.source.prototype = {
	lib: null,
	groups: null,
	info: null,
	kerning: null,
	glyphs: null,
	filename: null,
	name: null,
	location: null,

	toXml: function () {
		var innerNodes = '';
		if (this.location != null) {
			innerNodes = innerNodes + this.location.toXml();
		}
		if (this.lib != null) {
			innerNodes = innerNodes + this.lib.toXml('lib');
		}
		if (this.groups != null) {
			innerNodes = innerNodes + this.groups.toXml('groups');
		}
		if (this.info != null) {
			innerNodes = innerNodes + this.info.toXml('info');
		}
		if (this.kerning != null) {
			innerNodes = innerNodes + this.kerning.toXml('kerning');
		}
		if (this.glyphs != null) {
			innerNodes = innerNodes + this.muteGlyphsAsXml(this.glyphs);
		}
		var innerAttrib = '<source ';
		innerAttrib = innerAttrib + XmlUtil.getAttrib2('filename', this.filename);
		innerAttrib = innerAttrib + XmlUtil.getAttrib2('name', this.name);
		innerAttrib = innerAttrib.trim() + '>';
		var xml = innerAttrib + innerNodes + '</source>';
		return xml;
	},

	muteGlyphsAsXml: function (muteGlyphs) {
		if (muteGlyphs == null) {
			return '';
		}
		var innerNodes = '';
		for (var i = 0; i < muteGlyphs.length; i++) {
			if (muteGlyphs[i] != null) {
				innerNodes = innerNodes + muteGlyphs[i].toXml();
			}
		}
		return innerNodes;
	}
}



DesignerSpace.instance = function () { }
DesignerSpace.instance.prototype = {
	location: null,
	info: null,
	kerning: null,
	glyphs: null,
	filename: null,
	familyname: null,
	stylename: null,
	postscriptfontname: null,
	stylemapfamilyname: null,
	stylemapstylename: null,

	toXml: function () {
		var innerNodes = '<instance ';
		innerNodes = innerNodes + XmlUtil.getAttrib2('filename', this.filename);
		innerNodes = innerNodes + XmlUtil.getAttrib2('familyname', this.familyname);
		innerNodes = innerNodes + XmlUtil.getAttrib2('stylename', this.stylename);
		innerNodes = innerNodes + XmlUtil.getAttrib2('postscriptfontname', this.postscriptfontname);
		innerNodes = innerNodes + XmlUtil.getAttrib2('stylemapfamilyname', this.stylemapfamilyname);
		innerNodes = innerNodes + XmlUtil.getAttrib2('stylemapstylename', this.stylemapstylename);
		innerNodes = innerNodes.trim() + '>';
		if (this.location != null) {
			innerNodes = innerNodes + this.location.toXml();
		}
		if (this.info != null) {
			innerNodes = innerNodes + this.info.toXml();
		}
		if (this.kerning != null) {
			innerNodes = innerNodes + this.kerning.toXml();
		}
		if (this.glyphs != null) {
			innerNodes = innerNodes + this.glyphsToXml(this.glyphs);
		}
		innerNodes = innerNodes + '</instance>';
		return innerNodes;
	},

	glyphsToXml: function (glyphs) {
		var innerNodes = '';
		if (glyphs != null) {
			for (var i = 0; i < glyphs.length; i++) {
				if (glyphs[i] != null) {
					innerNodes = innerNodes + glyphs[i];
				}
			}
		}
		return innerNodes;
	}
}



DesignerSpace.dimension = function () { }
DesignerSpace.dimension.prototype = {
	name: null,
	xvalue: null,
	yvalue: null,

	toXml: function () {
		var innerAttrib = '';
		innerAttrib = innerAttrib + XmlUtil.getAttrib2('name', this.name);
		innerAttrib = innerAttrib + XmlUtil.getAttrib3('xvalue', this.xvalue);
		innerAttrib = innerAttrib + XmlUtil.getAttrib3('yvalue', this.yvalue);
		if (!!innerAttrib.trim()) {
			return '<dimension ' + innerAttrib.trim() + ' />';
		}
		return innerAttrib;
	}
}



DesignerSpace.master = function () { }
DesignerSpace.master.prototype = {
	location: null,
	source: null,
	glyphname: null,

	toXml: function () {
		var innerNodes = '<master ';
		innerNodes = innerNodes + XmlUtil.getAttrib2('source', this.source);
		innerNodes = innerNodes + XmlUtil.getAttrib2('glyphname', this.glyphname);
		innerNodes = innerNodes.trim() + '>';
		if (this.location != null) {
			innerNodes = innerNodes + this.location.toXml();
		}
		innerNodes = innerNodes + '</master>';
		return innerNodes;
	}
}



DesignerSpace.glyph = function () { }
DesignerSpace.glyph.prototype = {
	location: null,
	note: null,
	masters: null,
	name: null,
	unicode: null,

	toXml: function () {
		var innerNodes = '<glyph ';
		innerNodes = innerNodes + XmlUtil.getAttrib2('name', this.name);
		innerNodes = innerNodes + XmlUtil.getAttrib2('unicode', this.unicode);
		innerNodes = innerNodes.trim() + '>';
		if (this.location != null) {
			innerNodes = innerNodes + this.location.toXml();
		}
		if (this.note != null) {
			innerNodes = innerNodes + XmlUtil.getNode('note', this.note);
		}
		if (this.masters != null) {
			innerNodes = innerNodes + this.mastersAsXml(this.masters);
		}
		innerNodes = innerNodes + '</glyph>';
		return innerNodes;
	},

	mastersAsXml: function (masters) {
		var innerNodes = '';
		if (masters != null) {
			for (var i = 0; i < masters.length; i++) {
				if (masters[i] != null) {
					innerNodes = innerNodes + masters[i].toXml();
				}
			}
		}
		return '<masters>' + innerNodes + '</masters>';
	}
}



DesignerSpace.kerning = function () { }
DesignerSpace.kerning.prototype = {
	location: null,

	toXml: function () {
		var innerNodes = '';
		if (this.location != null) {
			innerNodes = innerNodes + this.location.toXml();
			if (!!innerNodes) {
				return '<kerning>' + innerNodes + '</kerning>';
			}
		}
		return innerNodes;
	}
}



DesignerSpace.info = function () { }
DesignerSpace.info.prototype = {
	location: null,

	toXml: function () {
		var innerNodes = '';
		if (this.location != null) {
			innerNodes = innerNodes + this.location.toXml();
			if (!!innerNodes) {
				return '<info>' + innerNodes + '</info>';
			}
		}
		return innerNodes;
	}
}



DesignerSpace.muteGlyph = function () { }
DesignerSpace.muteGlyph.prototype = {
	name: null,
	mute: 0,

	toXml: function () {
		var innerAttr = '';
		innerAttr = innerAttr + XmlUtil.getAttrib2('name', this.name);
		innerAttr = innerAttr + XmlUtil.getAttrib2('mute', this.mute.toString());
		if (!!innerAttr) {
			return '<glyph ' + innerAttr.trim() + ' />';
		}
		return '';
	}
}



DesignerSpace.muteOnly = function () { }
DesignerSpace.muteOnly.prototype = {
	mute: null,

	toXml: function (nodeName) {
		var innerAttr = '';
		innerAttr = innerAttr + XmlUtil.getAttrib('mute', this.mute);
		if (!!innerAttr) {
			return '<' + nodeName + ' ' + innerAttr.trim() + ' />';
		}
		return '';
	}
}



DesignerSpace.copyAndMute = function () { }
DesignerSpace.copyAndMute.prototype = {
	copy: null,
	mute: null,

	toXml: function (nodeName) {
		var innerAttr = '';
		innerAttr = innerAttr + XmlUtil.getAttrib('copy', this.copy);
		innerAttr = innerAttr + XmlUtil.getAttrib('mute', this.mute);
		if (!!innerAttr) {
			return '<' + nodeName + ' ' + innerAttr.trim() + ' />';
		}
		return '';
	}
}



DesignerSpace.copyOnly = function () { }
DesignerSpace.copyOnly.prototype = {
	copy: null,

	toXml: function (nodeName) {
		var innerAttr = '';
		innerAttr = innerAttr + XmlUtil.getAttrib('copy', this.copy);
		if (!!innerAttr) {
			return '<' + nodeName + ' ' + innerAttr.trim() + ' />';
		}
		return '';
	}
}
//END of DesignerSpace
ComputeWorker.btnCompute = 'btn.compute';
ComputeWorker.btnRun = 'btn.run';
ComputeWorker.txtXml = 'txt.xml';
ComputeWorker.frmRun = 'frmRun';
ComputeWorker._runHandler = null;
ComputeWorker._computeHandler = null;
InstancesWorker.instanceTemplate = 'InstanceTemplate';
InstancesWorker.olInstances = 'instances';
InstancesWorker.divInstance = 'instance_';
InstancesWorker.txtInstanceName = 'instance.name_';
InstancesWorker.btnAddName = 'instance.addName_';
InstancesWorker.btnAddMetric = 'instance.addMetric_';
InstancesWorker.btnAddInstance = 'instance.add';
InstancesWorker.btnRemoveInstance = 'instance.remove_';
InstancesWorker.selectName = 'instance.selName_';
InstancesWorker.liName = 'isntance.name_';
InstancesWorker.btnRemoveName = 'instance.names.remove_';
InstancesWorker.olNames = 'instance.names';
InstancesWorker.btnRemoveDimension = 'instance.metrics.remove_';
InstancesWorker.liMetric = 'instance.metric_';
InstancesWorker.selectMetric = 'instance.selMetric_';
InstancesWorker.olMetrics = 'instance.metrics';
InstancesWorker.addHandler = null;
InstancesWorker.removeHandler = null;
InstancesWorker.addNameHandler = null;
InstancesWorker.removeNameHandler = null;
InstancesWorker.addDimensionHandler = null;
InstancesWorker.removeDimensionHandler = null;
InstancesWorker.disposeHandler = null;
SourcesWorker.sourceTemplate = 'SourceTemplate';
SourcesWorker.olSources = 'sources';
SourcesWorker.divSource = 'source_';
SourcesWorker.btnAddSource = 'source.add';
SourcesWorker.btnRemoveSource = 'source.remove_';
SourcesWorker.txtSourceName = 'source.name_';
SourcesWorker.btnAddMetric = 'source.addMetric_';
SourcesWorker.selectMetric = 'source.selMetric_';
SourcesWorker.liMetric = 'source.metric_';
SourcesWorker.btnRemoveMetric = 'source.metrics.remove_';
SourcesWorker.olMetric = 'source.metrics';
SourcesWorker.chkMuteInfo = 'muteInfo_';
SourcesWorker.chkCopyInfo = 'copyInfo_';
SourcesWorker.chkCopyGroups = 'copyGroups_';
SourcesWorker.chkCopyLib = 'copyLib_';
SourcesWorker.chkMuteKerning = 'muteKerning_';
SourcesWorker.divSourceUI = 'source.ui_';
SourcesWorker.divUpload = 'uploader_';
SourcesWorker.divLoading = 'processing_';
SourcesWorker.frame = 'frame_';
SourcesWorker.form = 'form_';
SourcesWorker.file = 'file_';
SourcesWorker.removeHandler = null;
SourcesWorker.addHandler = null;
SourcesWorker.mouseEnterHandler = null;
SourcesWorker.mouseLeaveHandler = null;
SourcesWorker.muteInfoHandler = null;
SourcesWorker.copyInfoHandler = null;
SourcesWorker.copyGroupsHandler = null;
SourcesWorker.copyLibHandler = null;
SourcesWorker.addDimensionHandler = null;
SourcesWorker.removeDimensionHandler = null;
SourcesWorker.fileSelectedHandler = null;
SourcesWorker.disposeHandler = null;
SourcesWorker.uploadTracker = null;
