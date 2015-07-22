/*
Author: Dileep Miriyala (m.dileep@gmail.com)
https://github.com/mdileep/mutatorMath.gui
Last Updated on  2015 Jul 23 01 30 23 IST
*/
var Env={}; Env.Product='mutatorMath.gui'; Env.LastUpdated='2015-07-23 01:30:23 HRS IST';Env.Version='0.8.0.12';


PageWorker = function () { }
PageWorker.prototype = {

	init: function () {
		Worker.pageInit();
	},

	dispose: function () {
		Worker.dispose();
	}
}



Worker = function () { }
Worker.pageInit = function () {
	if (Util.isAvailable('designSpace')) {
	SourcesWorker.init();
	InstancesWorker.init();
	ComputeWorker.init();
	}
	ComputeWorker.setBuildDetails();
}
Worker.dispose = function () {
	SourcesWorker.dispose();
	InstancesWorker.dispose();
	ComputeWorker.dispose();
}



ComputeWorker = function () { }
ComputeWorker.init = function () {
	ComputeWorker.registerHandlers();
	ComputeWorker.registerEvents();
	ComputeWorker.internalInit();
}
ComputeWorker.internalInit = function () {
	if (Config.DesignerOnly) {
		Util.setChecked('designOnly');
		Util.setDisabled('designOnly');
	}
	else {
		Util.setUnChecked('designOnly');
	}
	ComputeWorker.compute();
}
ComputeWorker.setBuildDetails = function () {
	if (Util.isAvailable('Build')) {
		document.getElementById('Build').innerHTML = '<b>' + Env.Product + '</b> Version : <b>' + Env.Version + '</b>  Current Build was generated at <b>' + Env.LastUpdated + '</b>';
	}
}
ComputeWorker.registerEvents = function () {
	Util.registerClick('btn.compute', ComputeWorker.computeHandler);
	Util.registerClick('btn.run', ComputeWorker.runHandler);
	Util.registerClick('multipleInstances', ComputeWorker.multipleInstancesHandler);
	Util.registerClick('designOnly', ComputeWorker.designerOnlyHandler);
}
ComputeWorker.registerHandlers = function () {
	ComputeWorker.computeHandler = function(e) {
		ComputeWorker.compute();
	};
	ComputeWorker.runHandler = function(e) {
		ComputeWorker.run();
	};
	ComputeWorker.multipleInstancesHandler = function(e) {
		ComputeWorker.handleMultInstances();
	};
	ComputeWorker.designerOnlyHandler = function(e) {
		ComputeWorker.handleDesignerOnly();
	};
	ComputeWorker.disposeHandler = function(e) {
		ComputeWorker.handleDispose();
	};
}
ComputeWorker.handleDesignerOnly = function () {
	SourcesWorker.handleDesignerOnly();
	InstancesWorker.handleDesignerOnly();
	Config.DesignerOnly = Util.isChecked('designOnly');
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
	Util.setValue('instance', ComputeWorker.joinList(instances));
	Util.setValue('sessionId', Config.SessionId);
	Util.setValue('rg', (Util.isChecked('chkRoungGeo')) ? '1' : '0');
	document.getElementById('code').innerHTML = textToHtml(xml);
	prettyPrint();
	ComputeWorker.saveCopy(instances);
}
ComputeWorker.joinList = function(instances) {
	var s = '';
	for (var i = 0; i < instances.length; i++) {
		s = s + instances[i].filename + ((i !== instances.length - 1) ? ',' : '');
	}
	return s;
}
ComputeWorker.run = function () {
	if (ComputeWorker.computeInProgress) {
		alert('Another job is in already running. Please wait.');
		return;
	}
	var isValid = true;
	if (!Config.DesignerOnly) {
		isValid = ComputeWorker.validate();
	}
	ComputeWorker.compute();
	if (!Util.isChecked('keepResults')) {
		var Ol = document.getElementById('downloadLinks');
		Ol.innerHTML = '';
		Util.noDisplay('lbl.downloadLinks');
	}
	if (isValid && !Config.DesignerOnly) {
		Util.setDisplayInline('running');
		ComputeWorker.computeInProgress = true;
		var frm = document.getElementById('frmRun');
		frm.submit();
	}
}
ComputeWorker.validate = function () {
	return SourcesWorker.isValid() && InstancesWorker.isValid();
}
ComputeWorker.successCallBack = function(newSessionId) {
	Util.noDisplay('running');
	ComputeWorker.showDownloadLinks(true);
	ComputeWorker.clear();
	Config.SessionId = newSessionId;
	ComputeWorker.computeInProgress = false;
}
ComputeWorker.showDownloadLinks = function(showInstances) {
	var Ol = document.getElementById('downloadLinks');
	var li3 = ComputeWorker.getDowloadLink2('Design Space Document', '/view/' + Config.SessionId + '.design' + 'space', '[View]', '/download/' + Config.SessionId + '.design' + 'space', '[Download]');
	Ol.appendChild(li3);
	if (showInstances) {
		for (var i = 0; i < ComputeWorker.instancesList.length; i++) {
			var s = ComputeWorker.instancesList[i].value;
			if (ComputeWorker.instancesList.length !== 1) {
				s = s + '( Instance-' + (i + 1) + ') ';
			}
			var li = ComputeWorker.getDowloadLink(s, '/download/' + ComputeWorker.instancesList[i].key + '.zip', '[Download]');
			Ol.appendChild(li);
		}
	}
	var li2 = ComputeWorker.getDowloadLink2('Log File', '/view/' + Config.SessionId + '.log', '[View]', '/download/' + Config.SessionId + '.log', '[Download]');
	Ol.appendChild(li2);
	Util.setDisplayInline('lbl.downloadLinks');
}
ComputeWorker.getDowloadLink2 = function(PreText, VLink, Text, DLink, Download) {
	var Dic = { };
	Dic['PreText'] = PreText;
	Dic['VLink'] = VLink;
	Dic['View'] = Text;
	Dic['DLink'] = DLink;
	Dic['Download'] = Download;
	var link = Util.applyTemplate('DowloadTemplate2', Dic);
	var li = document.createElement('li');
	li.innerHTML = link;
	return li;
}
ComputeWorker.getDowloadLink = function (PreText, Link, Text) {
	var Dic = {};
	Dic['PreText'] = PreText;
	Dic['Link'] = Link;
	Dic['Text'] = Text;
	var link = Util.applyTemplate('DowloadTemplate', Dic);
	var li = document.createElement('li');
	li.innerHTML = link;
	return li;
}
ComputeWorker.errorCallBack = function (error) {
	Util.noDisplay('running');
	ComputeWorker.showDownloadLinks(false);
	ComputeWorker.computeInProgress = false;
	ComputeWorker.clear();
	var err = decodeURIComponent(error);;
	alert('Error occured while processing your request. Please try again.\n Details:\n' + err);
}
ComputeWorker.saveCopy = function (instances) {
	ComputeWorker.instancesList = new Array(instances.length);
	for (var i = 0; i < instances.length; i++) {
		ComputeWorker.instancesList[i] = new DesignerSpace.NameValuePair();
		ComputeWorker.instancesList[i].key = instances[i].filename;
		ComputeWorker.instancesList[i].value = instances[i].familyname;
	}
}
ComputeWorker.clear = function () {
	ComputeWorker.instancesList = [];
}
ComputeWorker.handleMultInstances = function () {
	SourcesWorker.handleMultInstances();
	InstancesWorker.handleMultInstances();
}
ComputeWorker.handleDispose = function () {
	ComputeWorker.deRegisterEvents();
	ComputeWorker.computeHandler = null;
	ComputeWorker.runHandler = null;
	ComputeWorker.multipleInstancesHandler = null;
	ComputeWorker.designerOnlyHandler = null;
	ComputeWorker.disposeHandler = null;
}
ComputeWorker.deRegisterEvents = function () {
	Util.deRegisterClick('btn.compute', ComputeWorker.computeHandler);
	Util.deRegisterClick('btn.run', ComputeWorker.runHandler);
	Util.deRegisterClick('multipleInstances', ComputeWorker.multipleInstancesHandler);
	Util.deRegisterClick('designOnly', ComputeWorker.designerOnlyHandler);
}
ComputeWorker.dispose = function () {
	ComputeWorker.handleDispose();
}



InstancesWorker = function () { }
InstancesWorker.init = function () {
	InstancesWorker.registerHandlers();
	InstancesWorker.registerEvents();
	InstancesWorker.internalInit();
}
InstancesWorker.internalInit = function () {
	InstancesWorker.addInstance();
}
InstancesWorker.registerEvents = function () {
	Util.registerClick('instance.add', InstancesWorker.addHandler);
}
InstancesWorker.deRegisterEvents = function () {
	Util.deRegisterClick('instance.add', InstancesWorker.addHandler);
}
InstancesWorker.registerHandlers = function () {
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
	InstancesWorker.removeNameHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeControl(rowId, 'instance.selName_', 'instance.names.remove_', 'isntance.name_', InstancesWorker.removeNameHandler);
	};
	InstancesWorker.addInfoMetricHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addDimension(rowId, 'instance.selInfoMetric_', 'instance.infoMetric_', 'instance.infoMetrics.remove_', 'instance.infoMetrics', InstancesWorker.removeInfoMetricHandler);
	};
	InstancesWorker.removeInfoMetricHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeControl(rowId, 'instance.selInfoMetric_', 'instance.infoMetrics.remove_', 'instance.infoMetric_', InstancesWorker.removeInfoMetricHandler);
	};
	InstancesWorker.addKernMetricHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addDimension(rowId, 'instance.selKernMetric_', 'instance.kernMetric_', 'instance.kernMetrics.remove_', 'instance.kernMetrics', InstancesWorker.removeKernMetricHandler);
	};
	InstancesWorker.removeKernMetricHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeControl(rowId, 'instance.selKernMetric_', 'instance.kernMetrics.remove_', 'instance.kernMetric_', InstancesWorker.removeKernMetricHandler);
	};
	InstancesWorker.addDimensionHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addDimension(rowId, 'instance.selMetric_', 'instance.metric_', 'instance.metrics.remove_', 'instance.metrics', InstancesWorker.removeDimensionHandler);
	};
	InstancesWorker.removeDimensionHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeControl(rowId, 'instance.selMetric_', 'instance.metrics.remove_', 'instance.metric_', InstancesWorker.removeDimensionHandler);
	};
	InstancesWorker.addGlyphDimensionHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addGlyphDimension(rowId, 'instance.glyphs', InstancesWorker.removeGlyphDimensionHandler);
	};
	InstancesWorker.removeGlyphDimensionHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeGlyphDimension(rowId, 'instance.glyphs', InstancesWorker.removeGlyphDimensionHandler);
	};
	InstancesWorker.addMasterDimesnionHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addMasterDimension(rowId, 'instance.glyphs.masters', InstancesWorker.removeMasterDimesnionHandler);
	};
	InstancesWorker.removeMasterDimesnionHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeMasterDimension(rowId, 'instance.glyphs.masters', InstancesWorker.removeMasterDimesnionHandler);
	};
	InstancesWorker.addGlyphMasterHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addGlyphMaster(rowId, 'instance.glyphs', InstancesWorker.removeGlyphMasterHandler);
		var preFix = 'instance.glyphs.masters';
		var ol = document.getElementById(preFix + '_' + rowId);
		var n = Util.noOfChildElements(ol, 'li');
		var val = n.toString();
		var id = rowId;
		var btnAddMasterDimension = preFix + '.addMetric_' + val + '_' + id;
		var selGlyphMasterLocation = preFix + '.selMetric_' + val + '_' + id;
		InternalWorker.loadMetrics(selGlyphMasterLocation);
		Util.registerClick(btnAddMasterDimension, InstancesWorker.addMasterDimesnionHandler);
		var selSource = preFix + '.selSource_' + val + '_' + id;
		SourcesWorker.loadSources(selSource);
	};
	InstancesWorker.removeGlyphMasterHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeGlypMaster(rowId, 'instance.glyphs', InstancesWorker.removeGlyphMasterHandler);
	};
	InstancesWorker.addGlyphHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addGlyph(rowId, 'instance.glyph_', 'instance.glyphs.remove_', 'instance.glyphs', InstancesWorker.removeGlyphHandler);
		var ol = document.getElementById('instance.glyphs' + '_' + rowId);
		var n = Util.noOfChildElements(ol, 'li');
		var val = n.toString();
		var id = rowId;
		var preFix = 'instance.glyphs';
		var btnAddGlyphDimension = preFix + '.addMetric_' + val + '_' + id;
		var btnAddMasterDimension = preFix + '.addMaster_' + val + '_' + id;
		var selGlyphLocation = preFix + '.selMetric_' + val + '_' + id;
		InternalWorker.loadMetrics(selGlyphLocation);
		Util.registerClick(btnAddGlyphDimension, InstancesWorker.addGlyphDimensionHandler);
		Util.registerClick(btnAddMasterDimension, InstancesWorker.addGlyphMasterHandler);
	};
	InstancesWorker.removeGlyphHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeGlyph(rowId, 'instance.glyphs.remove_', 'instance.glyph_', InstancesWorker.removeGlyphHandler);
	};
	InstancesWorker.disposeHandler = function(e) {
		InstancesWorker.handleDispose();
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
	var dic = { };
	dic['ID'] = rowId;
	var html = Util.applyTemplate('InstanceTemplate', dic);
	var instance = document.createElement('li');
	instance.innerHTML = html;
	Instances.appendChild(instance);
	InternalWorker.loadMetrics('instance.selMetric_' + rowId);
	InternalWorker.loadMetrics('instance.selInfoMetric_' + rowId);
	InternalWorker.loadMetrics('instance.selKernMetric_' + rowId);
	var srcElem = document.getElementById('instance_' + rowId);
	Util.registerClick('instance.addName_' + rowId, InstancesWorker.addNameHandler);
	Util.registerClick('instance.addMetric_' + rowId, InstancesWorker.addDimensionHandler);
	Util.registerClick('instance.addGlyph_' + rowId, InstancesWorker.addGlyphHandler);
	Util.registerClick('instance.addInfoMetric_' + rowId, InstancesWorker.addInfoMetricHandler);
	Util.registerClick('instance.addKernMetric_' + rowId, InstancesWorker.addKernMetricHandler);
	Util.registerClick('instance.remove_' + rowId, InstancesWorker.removeHandler);
}
InstancesWorker.removeInstance = function(rowId) {
	var Instances = document.getElementById('instances');
	var srcElem = document.getElementById('instance_' + rowId);
	Util.deRegisterClick('instance.addName_' + rowId, InstancesWorker.addNameHandler);
	Util.deRegisterClick('instance.addMetric_' + rowId, InstancesWorker.addDimensionHandler);
	Util.deRegisterClick('instance.addGlyph_' + rowId, InstancesWorker.addGlyphHandler);
	Util.deRegisterClick('instance.addInfoMetric_' + rowId, InstancesWorker.addInfoMetricHandler);
	Util.deRegisterClick('instance.addKernMetric_' + rowId, InstancesWorker.addKernMetricHandler);
	Util.deRegisterClick('instance.remove_' + rowId, InstancesWorker.removeHandler);
	InternalWorker.removeControlSet(rowId, 'instance.metrics.remove_', 'instance.metric_', InstancesWorker.removeDimensionHandler);
	InternalWorker.removeControlSet(rowId, 'instance.names.remove_', 'instance.metric_', InstancesWorker.removeNameHandler);
	InternalWorker.removeControlSet(rowId, 'instance.infoMetrics.remove_', 'instance.infoMetric_', InstancesWorker.removeInfoMetricHandler);
	InternalWorker.removeControlSet(rowId, 'instance.kernMetrics.remove_', 'instance.kernMetric_', InstancesWorker.removeKernMetricHandler);
	InternalWorker.removeControlSet(rowId, 'instance.glyphs.remove_', 'instance.glyph_', InstancesWorker.removeGlyphHandler);
	srcElem.parentNode.parentNode.removeChild(srcElem.parentNode);
	var n = Util.noOfChildElements(Instances, 'li');
	if (!n) {
		InstancesWorker.addInstance();
	}
}
InstancesWorker.handleMultInstances = function () {
	var isChecked = Util.isChecked('multipleInstances');
	if (!isChecked) {
		Util.noDisplay('instance.add');
		var Instances = document.getElementById('instances');
		var n = Util.noOfChildElements(Instances, 'li');
		while (Instances.children.length !== 1) {
			var li = Instances.children[1];
			if (li != null && li.tagName.toLowerCase() === 'li') {
				var id = li.children[0].id;
				var rowId = id.substr(id.indexOf('_') + 1);
				InstancesWorker.removeInstance(rowId);
			}
		}
	}
	else {
		Util.setDisplayInline('instance.add');
	}
}
InstancesWorker.resetInstance = function(rowId) { }
InstancesWorker.refreshSources = function () {
	var Instances = document.getElementById('instances');
	for (var i = 0; i < Instances.children.length; i++) {
		var li = Instances.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var id = li.children[0].id;
			var rowId = id.substr(id.indexOf('_') + 1);
			InstancesWorker.refreshGlyphs(rowId);
		}
	}
}
InstancesWorker.refreshGlyphs = function(rowId) {
			var olGlyphs2 = document.getElementById('instance.glyphs' + '_' + rowId);
	for (var i = 0; i < olGlyphs2.children.length; i++) {
		var li = olGlyphs2.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var val = li.getAttribute('data-value');
			InstancesWorker.refreshMasters(val, rowId);
		}
	}
}
InstancesWorker.refreshMasters = function(val, rowId) {
					var olGlyphMasters = 'instance.glyphs' + '.masters';
	var olGlyphsMasters2 = document.getElementById(olGlyphMasters + '_' + val + '_' + rowId);
	for (var i = 0; i < olGlyphsMasters2.children.length; i++) {
		var li = olGlyphsMasters2.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var val2 = li.getAttribute('data-value');
			var selSource = olGlyphMasters + '.selSource_' + val2 + '_' + val + '_' + rowId;
			SourcesWorker.loadSources(selSource);
		}
	}
}
InstancesWorker.getInstances = function () {
	var Instances = document.getElementById('instances');
	var n = Util.noOfChildElements(Instances, 'li');
	var instances = new Array(n);
	var running = 0;
	for (var i = 0; i < Instances.children.length; i++) {
		var li = Instances.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var instance = InstancesWorker.getInstance(li, running);
			instances[running++] = instance;
		}
	}
	return instances;
}
InstancesWorker.getInstance = function(li, running) {
	var n = Util.noOfChildElements(li, 'div');
	if (!n) {
		return null;
	}
	var id = li.children[0].id;
	var rowId = id.substr(id.indexOf('_') + 1);
	var obj = new DesignerSpace.instance();
	obj.familyname = Util.getValue(InstancesWorker.txtInstanceName + rowId);
	obj.filename = 'instacne_' + (running + 1) + '_' + Config.SessionId + '.ufo';
	obj.location = InternalWorker.getLocation('instance.metrics', rowId);
	obj.postscriptfontname = InstancesWorker.getName('postscriptfontname', rowId);
	obj.stylemapfamilyname = InstancesWorker.getName('stylemapfamilyname', rowId);
	obj.stylemapstylename = InstancesWorker.getName('stylemapstylename', rowId);
	obj.stylename = InstancesWorker.getName('stylename', rowId);
	obj.info = InstancesWorker.getInfo(rowId);
	obj.kerning = InstancesWorker.getKerning(rowId);
	obj.glyphs = InternalWorker.getGlyphs('instance.glyphs', rowId);
	return obj;
}
InstancesWorker.getKerning = function(rowId) {
	var loc = InternalWorker.getLocation('instance.kernMetrics', rowId);
	var kern = new DesignerSpace.kerning();
	kern.location = loc;
	return kern;
}
InstancesWorker.getInfo = function(rowId) {
	var loc = InternalWorker.getLocation('instance.infoMetrics', rowId);
	var info = new DesignerSpace.info();
	info.location = loc;
	return info;
}
InstancesWorker.handleDesignerOnly = function () { }
InstancesWorker.getName = function(nm, rowId) {
	var val = Util.getValue('instance.names' + '_' + nm + '_' + rowId);
	if (!val) {
		return null;
	}
	return val;
}
InstancesWorker.isValid = function () {
	return true;
}
InstancesWorker.dispose = function () {
	InstancesWorker.handleDispose();
}
InstancesWorker.handleDispose = function () {
	InstancesWorker.deRegisterEvents();
	InstancesWorker.addHandler = null;
	InstancesWorker.removeHandler = null;
	InstancesWorker.addNameHandler = null;
	InstancesWorker.removeNameHandler = null;
	InstancesWorker.addDimensionHandler = null;
	InstancesWorker.removeDimensionHandler = null;
	InstancesWorker.addInfoMetricHandler = null;
	InstancesWorker.removeInfoMetricHandler = null;
	InstancesWorker.addKernMetricHandler = null;
	InstancesWorker.removeKernMetricHandler = null;
	InstancesWorker.addGlyphDimensionHandler = null;
	InstancesWorker.removeGlyphDimensionHandler = null;
	InstancesWorker.addGlyphMasterHandler = null;
	InstancesWorker.removeGlyphMasterHandler = null;
	InstancesWorker.addMasterDimesnionHandler = null;
	InstancesWorker.removeGlyphMasterHandler = null;
	InstancesWorker.disposeHandler = null;
}






SourcesWorker = function () { }
SourcesWorker.init = function () {
	SourcesWorker.registerHandlers();
	SourcesWorker.registerEvents();
	SourcesWorker.internalInit();
}
SourcesWorker.internalInit = function () {
	SourcesWorker.uploadTracker = {};
	SourcesWorker.addSource();
}
SourcesWorker.registerEvents = function () {
	Util.registerClick('source.add', SourcesWorker.addHandler);
}
SourcesWorker.deRegisterEvents = function () {
	Util.deRegisterClick('source.add', SourcesWorker.addHandler);
}
SourcesWorker.registerHandlers = function () {
	SourcesWorker.addHandler = function (e) {
		SourcesWorker.addSource();
	};
	SourcesWorker.removeHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		SourcesWorker.removeSource(rowId);
	};
	SourcesWorker.fileSelectedHandler = function (e) {
		var rowId = InternalWorker.findRowId(e);
		SourcesWorker.fileSelected(rowId);
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
	SourcesWorker.addMuteGlyphHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.addMuteGlyph(rowId, 'source.muteGlyph_', 'source.muteGlyphs.remove_', 'source.muteGlyphs', SourcesWorker.removeMuteGlyphHandler);
	};
	SourcesWorker.removeMuteGlyphHandler = function(e) {
		var rowId = InternalWorker.findRowId(e);
		InternalWorker.removeMuteGlyph(rowId, 'source.muteGlyphs.remove_', 'source.muteGlyph_', SourcesWorker.removeMuteGlyphHandler);
	};
	SourcesWorker.disposeHandler = function (e) {
		SourcesWorker.handleDispose();
	};
}
SourcesWorker.loadSources = function(selSource) {
			var select = document.getElementById(selSource);
	var curr = Util.selectedIndex(selSource);
	select.innerHTML = '';
	var Sources = document.getElementById('sources');
	for (var i = 0; i < Sources.children.length; i++) {
		var li = Sources.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var id = li.children[0].id;
			var rowId = id.substr(id.indexOf('_') + 1);
			var text = Util.getValue(SourcesWorker.txtSourceName + rowId);
			var val = Util.getValue(SourcesWorker.txtFileName + rowId);
			var Option = Util.addOptionItem(text, val, false);
			select.appendChild(Option);
		}
	}
	try {
		select.selectedIndex=curr;
	}
	catch ($e1) { }
}
SourcesWorker.addSource = function () {
	var Sources = document.getElementById('sources');
	var n = Util.noOfChildElements(Sources, 'li');
	n = n + 1;
	while (true) {
		if (document.getElementById('source_' + n) == null) {
			break;
		}
		n = n + 1;
	}
	var rowId = n.toString();
	var dic = {};
	dic['ID'] = rowId;
	dic['SID'] = Config.SessionId;
	var html = Util.applyTemplate('SourceTemplate', dic);
	var source = document.createElement('li');
	source.innerHTML = html;
	Sources.appendChild(source);
	InternalWorker.loadMetrics('source.selMetric_' + rowId);
	Util.registerClick('source.remove_' + rowId, SourcesWorker.removeHandler);
	Util.registerClick('muteInfo_' + rowId, SourcesWorker.muteInfoHandler);
	Util.registerClick('copyInfo_' + rowId, SourcesWorker.copyInfoHandler);
	Util.registerClick('copyGroups_' + rowId, SourcesWorker.copyGroupsHandler);
	Util.registerClick('copyLib_' + rowId, SourcesWorker.copyLibHandler);
	Util.registerClick('source.addMetric_' + rowId, SourcesWorker.addDimensionHandler);
	Util.registerClick('source.addMuteGlyph_' + rowId, SourcesWorker.addMuteGlyphHandler);
	Util.registerChange('file_' + rowId, SourcesWorker.fileSelectedHandler);
	SourcesWorker.handleCopyInfo(null);
	SourcesWorker.handleCopyGroups(null);
	SourcesWorker.handleCopyLib(null);
	Util.setFocus(SourcesWorker.txtSourceName + rowId);
	if (Config.DesignerOnly) {
		Util.noDisplay('uploader_' + rowId);
		Util.noDisplay('processing_' + rowId);
		Util.setDisplayInline('source.ui_' + rowId);
	}
	InstancesWorker.refreshSources();
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
	Util.deRegisterClick('source.addMuteGlyph_' + rowId, SourcesWorker.addMuteGlyphHandler);
	Util.deRegisterChange('file_' + rowId, SourcesWorker.fileSelectedHandler);
	InternalWorker.removeControlSet(rowId, 'source.metrics.remove_', 'source.metric_', SourcesWorker.removeDimensionHandler);
	InternalWorker.removeControlSet(rowId, 'source.muteGlyphs.remove_', 'source.muteGlyph_', SourcesWorker.removeMuteGlyphHandler);
	srcElem.parentNode.parentNode.removeChild(srcElem.parentNode);
	InstancesWorker.refreshSources();
	var n = Util.noOfChildElements(Sources, 'li');
	if (!n) {
		SourcesWorker.addSource();
	}
}
SourcesWorker.resetSource = function (rowId) { }
SourcesWorker.isValid = function () {
	var Sources = document.getElementById('sources');
	var n = Util.noOfChildElements(Sources, 'li');
	var sources = new Array(n);
	for (var i = 0; i < Sources.children.length; i++) {
		var li = Sources.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var valid = SourcesWorker.isValidSource(li);
			if (!valid) {
				return valid;
			}
		}
	}
	return true;
}
SourcesWorker.isValidSource = function (li) {
	var n = Util.noOfChildElements(li, 'div');
	if (!n) {
		return true;
	}
	var id = li.children[0].id;
	var rowId = id.substr(id.indexOf('_') + 1);
	if (!Util.getValue(SourcesWorker.txtFileName + rowId) || Util.getValue('source.uploaded_' + rowId) === '0') {
		alert('Please choose a zipped UFO file.');
		Util.setFocus('file_' + rowId);
		return false;
	}
	return true;
}
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
	obj.filename = Util.getValue(SourcesWorker.txtFileName + rowId);
	obj.info = SourcesWorker.getInfo(rowId);
	obj.lib = SourcesWorker.getLib(rowId);
	obj.groups = SourcesWorker.getLib(rowId);
	obj.kerning = SourcesWorker.getKerning(rowId);
	obj.location = SourcesWorker.getLocation(rowId);
	obj.glyphs = InternalWorker.getMuteGlyphs('source.muteGlyphs', rowId);
	return obj;
}
SourcesWorker.getLocation = function(rowId) {
	var loc = InternalWorker.getLocation('source.metrics', rowId);
	if (loc == null || loc.dimensions == null || !loc.dimensions.length) {
		var width = new DesignerSpace.dimension();
		width.xvalue = 0;
		width.name = 'width';
		loc = new DesignerSpace.location();
		loc.dimensions = [ width ];
	}
	return loc;
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
SourcesWorker.handleMultInstances = function () {
	var Sources = document.getElementById('sources');
	var n = Util.noOfChildElements(Sources, 'li');
	var sources = new Array(n);
	for (var i = 0; i < Sources.children.length; i++) {
		var li = Sources.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var id = li.children[0].id;
			var rowId = id.substr(id.indexOf('_') + 1);
			Util.setEnabled('copyInfo_' + rowId);
			Util.setUnChecked('copyInfo_' + rowId);
			Util.setEnabled('muteInfo_' + rowId);
			Util.setUnChecked('muteInfo_' + rowId);
			Util.setEnabled('copyLib_' + rowId);
			Util.setUnChecked('copyLib_' + rowId);
			Util.setEnabled('copyGroups_' + rowId);
			Util.setUnChecked('copyGroups_' + rowId);
		}
	}
}
SourcesWorker.handleCopyInfo = function (rowId) {
	var isChecked = Util.isChecked('multipleInstances');
	if (isChecked) {
		return;
	}
	if (rowId == null) {
		rowId = InternalWorker.findCheckedRowId('copyInfo_', 'sources');
	}
	if (rowId == null) {
		return;
	}
	isChecked = Util.isChecked('copyInfo_' + rowId);
	var Sources = document.getElementById('sources');
	var n = Util.noOfChildElements(Sources, 'li');
	for (var i = 1; i <= n; i++) {
		if (i.toString() === rowId) {
			continue;
		}
		if (isChecked) {
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
	var isChecked = Util.isChecked('multipleInstances');
	if (isChecked) {
		return;
	}
	InternalWorker.checkBoxesAsRaidos('copyLib_', rowId, 'sources');
}
SourcesWorker.handleCopyGroups = function (rowId) {
	var isChecked = Util.isChecked('multipleInstances');
	if (isChecked) {
		return;
	}
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
SourcesWorker.fileSelected = function (rowId) {
	Util.noDisplay('uploader_' + rowId);
	Util.setDisplayInline('processing_' + rowId);
	Util.setValue('sessionId_' + rowId, Config.SessionId);
	var formElem = document.getElementById('form_' + rowId);
	formElem.submit();
	SourcesWorker.uploadTracker[rowId] = 1;
}
SourcesWorker.successCallBack = function (rowId, destPath, actualName) {
	window.setTimeout(function () {
		SourcesWorker.uploadTracker[rowId] = 0;
		Util.noDisplay('processing_' + rowId);
		Util.setDisplayInline('source.ui_' + rowId);
		Util.setValue(SourcesWorker.txtSourceName + rowId, actualName);
		Util.setValue(SourcesWorker.txtFileName + rowId, destPath);
		Util.setValue('source.uploaded_' + rowId, '1');
		InstancesWorker.refreshSources();
	}, 400);
}
SourcesWorker.errorCallBack = function (rowId, error) {
	window.setTimeout(function () {
		SourcesWorker.uploadTracker[rowId] = 0;
		Util.setDisplayInline('uploader_' + rowId);
		Util.noDisplay('processing_' + rowId);
	}, 400);
	var err = decodeURIComponent(error);;
	alert('Error was thrown by Server. Please try again.\n Details:\n' + err);
}
SourcesWorker.handleDesignerOnly = function () {
	var isChecked = Util.isChecked('designOnly');
	var Sources = document.getElementById('sources');
	var n = Util.noOfChildElements(Sources, 'li');
	var sources = new Array(n);
	for (var i = 0; i < Sources.children.length; i++) {
		var li = Sources.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var id = li.children[0].id;
			var rowId = id.substr(id.indexOf('_') + 1);
			if (isChecked) {
				Util.noDisplay('uploader_' + rowId);
				Util.setDisplayInline('source.ui_' + rowId);
			}
			else {
				if (!Util.getValue(SourcesWorker.txtFileName + rowId)) {
					Util.setDisplayInline('uploader_' + rowId);
					Util.noDisplay('source.ui_' + rowId);
				}
			}
		}
	}
}
SourcesWorker.handleDispose = function () {
	SourcesWorker.deRegisterEvents();
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
	SourcesWorker.addMuteGlyphHandler = null;
	SourcesWorker.removeMuteGlyphHandler = null;
	SourcesWorker.fileSelectedHandler = null;
	SourcesWorker.disposeHandler = null;
}
SourcesWorker.dispose = function () {
	SourcesWorker.handleDispose();
}



InternalWorker = function () { }
InternalWorker.addGlyphMaster = function(rowId, olGlyphs, removeMasterandler) {
	var preFix = olGlyphs;
	var val = rowId.split('_')[0];
	var id = rowId.split('_')[1];
	var liGlyphMaster = preFix + '.master_';
	var olMasters = preFix + '.masters';
	var btnRemoveGlyphMaster = preFix + '.masters.remove_';
	var btnAddMaster = preFix + '.addMaster_';
	InternalWorker.addControl('MasterTemplate', rowId, null, liGlyphMaster, btnRemoveGlyphMaster, olMasters, removeMasterandler);
}
InternalWorker.removeGlypMaster = function(rowId, olGlyphs, removeGlyphMasterHandler) {
	var preFix = olGlyphs;
	var val = rowId.split('_')[0];
	var id = rowId.split('_')[1];
	var selectGlyphMaster = preFix + '.selMaster_';
	var liGlyphMaster = preFix + '.master_';
	var olMasters = preFix + '.masters';
	var btnRemoveGlyphMaster = preFix + '.masters.remove_';
	var btnAddMaster = preFix + '.addMaster_';
	InternalWorker.removeControl(rowId, null, btnRemoveGlyphMaster, liGlyphMaster, removeGlyphMasterHandler);
}
InternalWorker.addMasterDimension = function(rowId, olGlyphs, removeDimensionHandler) {
							InternalWorker.addInnerDimension(rowId, olGlyphs, removeDimensionHandler);
}
InternalWorker.removeMasterDimension = function(rowId, olGlyphs, removeDimensionHandler) {
							InternalWorker.removeInnerDimension(rowId, olGlyphs, removeDimensionHandler);
}
InternalWorker.addGlyphDimension = function(rowId, olGlyphs, removeDimensionHandler) {
							InternalWorker.addInnerDimension(rowId, olGlyphs, removeDimensionHandler);
}
InternalWorker.removeGlyphDimension = function(rowId, olGlyphs, removeDimensionHandler) {
							InternalWorker.removeInnerDimension(rowId, olGlyphs, removeDimensionHandler);
}
InternalWorker.addGlyph = function(rowId, liGlyph, btnRemoveGlyph, olGlyphs, removeGlyphHandler) {
	InternalWorker.addControl('GlyphTemplate', rowId, null, liGlyph, btnRemoveGlyph, olGlyphs, removeGlyphHandler);
}
InternalWorker.removeGlyph = function(rowId, btnRemoveGlyph, liGlyph, removeGlyphHandler) {
	InternalWorker.removeControl(rowId, null, btnRemoveGlyph, liGlyph, removeGlyphHandler);
}
InternalWorker.addMuteGlyph = function(rowId, liMuteGlyph, btnRemoveMuteGlyph, olMuteGlyphs, removeMuteGlyphHandler) {
	InternalWorker.addControl('MuteGlyphTemplate', rowId, null, liMuteGlyph, btnRemoveMuteGlyph, olMuteGlyphs, removeMuteGlyphHandler);
}
InternalWorker.removeMuteGlyph = function(rowId, btnRemoveMuteGlyph, liMuteGlyph, removeMuteGlyphHandler) {
	InternalWorker.removeControl(rowId, null, btnRemoveMuteGlyph, liMuteGlyph, removeMuteGlyphHandler);
}
InternalWorker.addName = function(rowId, select, liTarget, btnRemove, olTarget, removeNameHandler) {
	InternalWorker.addControl('NameTemplate', rowId, select, liTarget, btnRemove, olTarget, removeNameHandler);
}
InternalWorker.addDimension = function(rowId, select, liTarget, btnRemove, olTarget, removeDimensionHandler) {
	InternalWorker.addControl('DimensionTemplate', rowId, select, liTarget, btnRemove, olTarget, removeDimensionHandler);
}
InternalWorker.removeControlSet = function(rowId, removePreFix, parentPreFix, removeDimensionHandler) {
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
InternalWorker.addInnerDimension = function(rowId, ol, removeDimensionHandler) {
	var preFix = ol;
	var val = rowId.split('_')[0];
	var id = rowId.split('_')[1];
	var selectInnerMetric = preFix + '.selMetric_';
	var liInnerMetric = preFix + '.metric_';
	var olMetrics = preFix + '.metrics';
	var btnRemoveInnerDimension = preFix + '.metrics.remove_';
	var btnAddDimension = preFix + '.addMetric_';
	InternalWorker.addDimension(rowId, selectInnerMetric, liInnerMetric, btnRemoveInnerDimension, olMetrics, removeDimensionHandler);
}
InternalWorker.removeInnerDimension = function(rowId, ol, removeGlyphDimensionHandler) {
	var preFix = ol;
	var val = rowId.split('_')[0];
	var id = rowId.split('_')[1] + '_' + rowId.split('_')[2];
	var selectInnerMetric = preFix + '.selMetric_';
	var liInnerMetric = preFix + '.metric_';
	var olMetrics = preFix + '.metrics';
	var btnRemoveInnerDimension = preFix + '.metrics.remove_';
	var btnAddDimension = preFix + '.addMetric_';
	InternalWorker.removeControl(rowId, selectInnerMetric, btnRemoveInnerDimension, liInnerMetric, removeGlyphDimensionHandler);
}
InternalWorker.addControl = function (templateName, rowId, select, liTarget, btnRemove, olTarget, removeHandler) {
	var postFix = '';
	var val = '';
	var text = '';
	var ol = document.getElementById(olTarget + '_' + rowId);
	if (select != null) {
		var index = Util.selectedIndex(select + rowId);
		if (index === -1) {
			return;
		}
		val = Util.selectedValue(select + rowId);
		text = Util.selectedText(select + rowId);
		Util.removeOption(select + rowId, index);
		var n = Util.noOfChildElements(document.getElementById(select + rowId), 'option');
		if (!n) {
			Util.noDisplay(select + rowId);
			Util.setDisplayInline(select + rowId + '.lbl');
		}
	}
	else {
		var n = Util.noOfChildElements(ol, 'li');
		n = n + 1;
		while (true) {
			if (document.getElementById(liTarget + n + '_' + rowId) == null) {
				break;
			}
			n = n + 1;
		}
		val = n.toString();
		text = val;
	}
	postFix = val + '_' + rowId;
	var targetId = liTarget + postFix;
	if (document.getElementById(targetId) != null) {
		Util.setFocusOnEditableChildById(targetId);
		return;
	}
	var Dict = { };
	Dict['ID'] = rowId;
	Dict['prefix'] = olTarget;
	Dict['value'] = val;
	Dict['text'] = text;
	var html = Util.applyTemplate(templateName, Dict);
	var li = document.createElement('li');
	li.setAttribute('id', targetId);
	li.setAttribute('data-text', text);
	li.setAttribute('data-value', val);
	li.innerHTML = html;
	ol.appendChild(li);
	InternalWorker.toggleHead(ol);
	Util.setFocusOnEditableChildById(targetId);
	Util.registerClick(btnRemove + val + '_' + rowId, removeHandler);
}
InternalWorker.removeControl = function (rowId, select, btnRemove, parentPreFix, removeDimensionHanlder) {
	Util.deRegisterClick(btnRemove + rowId, removeDimensionHanlder);
	var li = document.getElementById(parentPreFix + rowId);
	if (select != null) {
		var text = li.getAttribute('data-text');
		var value = li.getAttribute('data-value');
		var Option = document.createElement('option');
		Option.innerHTML = text;
		Option.setAttribute('value', value);
		var parentRowId = rowId.substr(rowId.indexOf('_') + 1);
		var E = document.getElementById(select + parentRowId);
		E.appendChild(Option);
		Util.setDisplayInline(select + parentRowId);
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
InternalWorker.getLocation = function (olMetrics, rowId) {
	var loc = new DesignerSpace.location();
	loc.dimensions = InternalWorker.getDimensions(olMetrics, rowId);
	return loc;
}
InternalWorker.getDimensions = function (olMetrics, rowId) {
	var olMetric2 = document.getElementById(olMetrics + '_' + rowId);
	var n = Util.noOfChildElements(olMetric2, 'li');
	var dimensions = new Array(n);
	var running = 0;
	for (var i = 0; i < olMetric2.children.length; i++) {
		var li = olMetric2.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var dimension = InternalWorker.getDimension(li, olMetrics, rowId);
			dimensions[running++] = dimension;
		}
	}
	return dimensions;
}
InternalWorker.getDimension = function (li, olMetrics, rowId) {
	var dimension = new DesignerSpace.dimension();
	dimension.name = li.getAttribute('data-value');
	dimension.xvalue = InternalWorker.getSetDecimal(olMetrics + '.x_' + dimension.name + '_' + rowId);
	dimension.yvalue = InternalWorker.getSetDecimal(olMetrics + '.y_' + dimension.name + '_' + rowId);
	if (dimension.xvalue == null && null === dimension.yvalue || (dimension.yvalue != null && dimension.xvalue == null)) {
		dimension.xvalue = 0;
		Util.setValue(olMetrics + '.x_' + dimension.name + '_' + rowId, '0');
	}
	return dimension;
}
InternalWorker.getMuteGlyphs = function(olMuteGlyphs, rowId) {
	var olMuteGlyphs2 = document.getElementById(olMuteGlyphs + '_' + rowId);
	var n = Util.noOfChildElements(olMuteGlyphs2, 'li');
	var muteGlyphs = new Array(n);
	var running = 0;
	for (var i = 0; i < olMuteGlyphs2.children.length; i++) {
		var li = olMuteGlyphs2.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var muteGlyph = InternalWorker.getMuteGlyph(li, olMuteGlyphs, rowId);
			muteGlyphs[running++] = muteGlyph;
		}
	}
	return muteGlyphs;
}
InternalWorker.getMuteGlyph = function(li, olMuteGlyphs, rowId) {
	var val = li.getAttribute('data-value');
	var nm = Util.getValue(olMuteGlyphs + '_' + val + '_' + rowId);
	if (!nm.trim()) {
		return null;
	}
	var muteGlyph = new DesignerSpace.muteGlyph();
	muteGlyph.name = nm;
	muteGlyph.mute = 1;
	return muteGlyph;
}
InternalWorker.getSetDecimal = function (Id) {
	var sVal = Util.getValue(Id);
	if (!sVal.trim()) {
		return null;
	}
	sVal = parseFloat(sVal.trim());
	if (isNaN(sVal)) {
		sVal = null;
	}
	Util.setValue(Id, sVal);
	return sVal;
}
InternalWorker.getGlyphs = function(olGlyphs, rowId) {
	var olGlyphs2 = document.getElementById(olGlyphs + '_' + rowId);
	var n = Util.noOfChildElements(olGlyphs2, 'li');
	var glyphs = new Array(n);
	var running = 0;
	for (var i = 0; i < olGlyphs2.children.length; i++) {
		var li = olGlyphs2.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var glyph = InternalWorker.getGlyph(li, olGlyphs, rowId);
			glyphs[running++] = glyph;
		}
	}
	return glyphs;
}
InternalWorker.getGlyph = function(li, olGlyphs, rowId) {
	var val = li.getAttribute('data-value');
	var nm = Util.getValue(olGlyphs + '.name' + '_' + val + '_' + rowId);
	if (!nm.trim()) {
		return null;
	}
	var note = Util.getValue(olGlyphs + '.note' + '_' + val + '_' + rowId);
	var olGlyphMetrics = olGlyphs + '.metrics';
	var olGlyphMasters = olGlyphs + '.masters';
	var g = new DesignerSpace.glyph();
	g.name = nm;
	g.note = note;
	g.location = InternalWorker.getLocation(olGlyphMetrics, val + '_' + rowId);
	g.masters = InternalWorker.getMasters(olGlyphMasters, val + '_' + rowId);
	return g;
}
InternalWorker.getMasters = function(olGlyphMasters, rowId) {
	var olGlyphsMasters2 = document.getElementById(olGlyphMasters + '_' + rowId);
	var n = Util.noOfChildElements(olGlyphsMasters2, 'li');
	var masters = new Array(n);
	var running = 0;
	for (var i = 0; i < olGlyphsMasters2.children.length; i++) {
		var li = olGlyphsMasters2.children[i];
		if (li.tagName.toLowerCase() === 'li') {
			var master = InternalWorker.getMaster(li, olGlyphMasters, rowId);
			masters[running++] = master;
		}
	}
	return masters;
}
InternalWorker.getMaster = function(li, olGlyphMasters, rowId) {
	var val = li.getAttribute('data-value');
	var master = new DesignerSpace.master();
	master.glyphname = Util.getValue(olGlyphMasters + '.name' + '_' + val + '_' + rowId);
	master.source = Util.selectedValue(olGlyphMasters + '.selSource' + '_' + val + '_' + rowId);
	master.location = InternalWorker.getLocation(olGlyphMasters + '.metrics', val + '_' + rowId);
	return master;
}
InternalWorker.loadMetrics2 = function(selectMetric) {
	var o1 = Util.addOptionItem('Weight', 'weight', false);
	var o2 = Util.addOptionItem('Width', 'width', false);
	var sel = document.getElementById(selectMetric);
	sel.appendChild(o1);
	sel.appendChild(o2);
}
InternalWorker.loadMetrics = function(selectMetric) {
			var innerHTML = Util.applyTemplate('MetricsTemplate', { });
	var sel = document.getElementById(selectMetric);
	sel.innerHTML = innerHTML;
}

DesignerSpace = {};




DesignerSpace.NameValuePair = function () { }
DesignerSpace.NameValuePair.prototype = {
	key: null,
	value: null,

	toXml: function () {
		return '';
	}
}



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
					innerNodes = innerNodes + glyphs[i].toXml();
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


ComputeWorker.btnCompute = 'btn.compute';
ComputeWorker.btnRun = 'btn.run';
ComputeWorker.txtXml = 'txt.xml';
ComputeWorker.frmRun = 'frmRun';
ComputeWorker.olDownloadLinks = 'downloadLinks';
ComputeWorker.downloadTemplate = 'DowloadTemplate';
ComputeWorker.downloadTemplate2 = 'DowloadTemplate2';
ComputeWorker.divRunning = 'running';
ComputeWorker.lblDownloadLinks = 'lbl.downloadLinks';
ComputeWorker.chkDesignOnly = 'designOnly';
ComputeWorker.chkMultipleInstances = 'multipleInstances';
ComputeWorker.chkKeepResults = 'keepResults';
ComputeWorker.chkRoungGeo = 'chkRoungGeo';
ComputeWorker.divBuild = 'Build';
ComputeWorker.runHandler = null;
ComputeWorker.computeHandler = null;
ComputeWorker.multipleInstancesHandler = null;
ComputeWorker.designerOnlyHandler = null;
ComputeWorker.disposeHandler = null;
ComputeWorker.computeInProgress = false;
ComputeWorker.instancesList = [];
InstancesWorker.instanceTemplate = 'InstanceTemplate';
InstancesWorker.olInstances = 'instances';
InstancesWorker.divInstance = 'instance_';
InstancesWorker.txtInstanceName = 'instance.name_';
InstancesWorker.btnAddInstance = 'instance.add';
InstancesWorker.btnRemoveInstance = 'instance.remove_';
InstancesWorker.btnAddName = 'instance.addName_';
InstancesWorker.btnRemoveName = 'instance.names.remove_';
InstancesWorker.selectName = 'instance.selName_';
InstancesWorker.olNames = 'instance.names';
InstancesWorker.liName = 'isntance.name_';
InstancesWorker.btnAddMetric = 'instance.addMetric_';
InstancesWorker.btnRemoveDimension = 'instance.metrics.remove_';
InstancesWorker.selectMetric = 'instance.selMetric_';
InstancesWorker.olMetrics = 'instance.metrics';
InstancesWorker.liMetric = 'instance.metric_';
InstancesWorker.btnAddGlyph = 'instance.addGlyph_';
InstancesWorker.btnRemovGlyph = 'instance.glyphs.remove_';
InstancesWorker.olGlyphs = 'instance.glyphs';
InstancesWorker.liGlyph = 'instance.glyph_';
InstancesWorker.olGlyphsMasters = 'instance.glyphs.masters';
InstancesWorker.olGlyphMetrics = 'instance.glyphs.metrics';
InstancesWorker.btnAddInfoMetric = 'instance.addInfoMetric_';
InstancesWorker.btnRemoveInfoMetric = 'instance.infoMetrics.remove_';
InstancesWorker.selectInfoMetric = 'instance.selInfoMetric_';
InstancesWorker.olInfoMetrics = 'instance.infoMetrics';
InstancesWorker.liInfoMetric = 'instance.infoMetric_';
InstancesWorker.btnAddKernMetric = 'instance.addKernMetric_';
InstancesWorker.btnRemoveKernMetric = 'instance.kernMetrics.remove_';
InstancesWorker.selectKernMetric = 'instance.selKernMetric_';
InstancesWorker.olKernMetrics = 'instance.kernMetrics';
InstancesWorker.liKernMetric = 'instance.kernMetric_';
InstancesWorker.chkMultipleInstances = 'multipleInstances';
InstancesWorker.addHandler = null;
InstancesWorker.removeHandler = null;
InstancesWorker.addNameHandler = null;
InstancesWorker.removeNameHandler = null;
InstancesWorker.addDimensionHandler = null;
InstancesWorker.removeDimensionHandler = null;
InstancesWorker.addInfoMetricHandler = null;
InstancesWorker.removeInfoMetricHandler = null;
InstancesWorker.addKernMetricHandler = null;
InstancesWorker.removeKernMetricHandler = null;
InstancesWorker.addGlyphHandler = null;
InstancesWorker.removeGlyphHandler = null;
InstancesWorker.addGlyphDimensionHandler = null;
InstancesWorker.removeGlyphDimensionHandler = null;
InstancesWorker.addGlyphMasterHandler = null;
InstancesWorker.removeGlyphMasterHandler = null;
InstancesWorker.addMasterDimesnionHandler = null;
InstancesWorker.removeMasterDimesnionHandler = null;
InstancesWorker.disposeHandler = null;
SourcesWorker.sourceTemplate = 'SourceTemplate';
SourcesWorker.olSources = 'sources';
SourcesWorker.divSource = 'source_';
SourcesWorker.btnAddSource = 'source.add';
SourcesWorker.btnRemoveSource = 'source.remove_';
SourcesWorker.txtSourceName = 'source.name_';
SourcesWorker.txtFileName = 'source.filename_';
SourcesWorker.btnAddMetric = 'source.addMetric_';
SourcesWorker.txtUploaded = 'source.uploaded_';
SourcesWorker.selectMetric = 'source.selMetric_';
SourcesWorker.liMetric = 'source.metric_';
SourcesWorker.btnRemoveMetric = 'source.metrics.remove_';
SourcesWorker.olMetrics = 'source.metrics';
SourcesWorker.btnAddMuteGlyph = 'source.addMuteGlyph_';
SourcesWorker.btnRemoveMuteGlyph = 'source.muteGlyphs.remove_';
SourcesWorker.olMuteGlyphs = 'source.muteGlyphs';
SourcesWorker.liMuteGlyph = 'source.muteGlyph_';
SourcesWorker.chkMuteInfo = 'muteInfo_';
SourcesWorker.chkCopyInfo = 'copyInfo_';
SourcesWorker.chkCopyGroups = 'copyGroups_';
SourcesWorker.chkCopyLib = 'copyLib_';
SourcesWorker.chkMuteKerning = 'muteKerning_';
SourcesWorker.chkMultipleInstances = 'multipleInstances';
SourcesWorker.chkDesignOnly = 'designOnly';
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
SourcesWorker.addMuteGlyphHandler = null;
SourcesWorker.removeMuteGlyphHandler = null;
SourcesWorker.fileSelectedHandler = null;
SourcesWorker.disposeHandler = null;
SourcesWorker.uploadTracker = null;
