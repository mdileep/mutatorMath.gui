Worker ={ };
Worker.removeHandler = null;
Worker.addHandler = null;
Worker.mouseEnterHandler = null;
Worker.mouseLeaveHandler = null;
Worker.muteInfoHandler = null;
Worker.copyInfoHandler = null;
Worker.copyGroupsHandler = null;
Worker.copyLibHandler = null;
Worker.addDimensionHandler = null;
Worker.removeDimensionHandler = null;
Worker.disposeHandler = null;


Worker.init = function () {
	Worker.registerEvents();
	Worker.pageInit();
};

Worker.registerEvents = function ()
{
	Worker.addHandler = function (e) {
		Worker.addSource();
	};

	Worker.removeHandler = function (e) {
		var rowId = Worker.findRowId(e);
		Worker.removeSource(rowId);
	};

	Worker.mouseEnterHandler = function (e) {
		Worker.hoverHandler(e, true);
	};

	Worker.mouseLeaveHandler = function (e) {
		Worker.hoverHandler(e, false);
	};

	Worker.muteInfoHandler = function (e) {
		var rowId = Worker.findRowId(e);
		if (Util.isChecked('muteInfo_' + rowId)) {
			Util.setDisabled('copyInfo_' + rowId);
		}
		else {
			Util.setEnabled('copyInfo_' + rowId);
		}
		Util.setUnChecked('copyInfo_' + rowId);
	};

	Worker.copyInfoHandler = function (e) {
		var rowId = Worker.findRowId(e);
		Worker.handleCopyInfo(rowId);
	};

	Worker.copyGroupsHandler = function (e) {
		var rowId = Worker.findRowId(e);
		Worker.handleCopyGroups(rowId);
	};

	Worker.copyLibHandler = function (e) {
		var rowId = Worker.findRowId(e);
		Worker.handleCopyLib(rowId);
	};

	Worker.addDimensionHandler = function (e) {
		var rowId = Worker.findRowId(e);
		Worker.handleDimension(rowId);
	};

	Worker.removeDimensionHandler = function (e) {
		var rowId = Worker.findRowId(e);
		Worker.handleRemoveDimension(rowId);
	};
	
	Worker.disposeHandler = function (e) {
		Worker.removeHandler = null;
		Worker.addHandler = null;
		Worker.mouseEnterHandler = null;
		Worker.mouseLeaveHandler = null;
		Worker.muteInfoHandler = null;
		Worker.copyInfoHandler = null;
		Worker.copyGroupsHandler = null;
		Worker.copyLibHandler = null;
		Worker.addDimensionHandler = null;
		Worker.removeDimensionHandler = null;
		Worker.disposeHandler = null;
	};
}

Worker.handleRemoveDimension = function (rowId) {
	Util.registerClick('remove2_' + rowId, Worker.removeDimensionHandler);
	var li = document.getElementById('metric_' + rowId);
	li.parentNode.removeChild(li);
}

Worker.handleDimension = function (rowId) {
	var val = Util.selectedValue('dimension_' + rowId);
	var text = Util.selectedText('dimension_' + rowId);
	var postFix = val + '_' + rowId;
	var targetId = 'metric_' + postFix;
	if (document.getElementById(targetId) != null) {
		Util.setFocusOnEditableChildById(targetId);
		return;
	}
	var Dict = {};
	Dict['ID'] = rowId;
	Dict['value'] = val;
	Dict['text'] = text;
	var html = Util.applyTemplate('DimensionTemplate', Dict);
	var li = document.createElement('li');
	li.setAttribute('id', targetId);
	li.innerHTML = html;
	var ol = document.getElementById('metrics_' + rowId);
	ol.appendChild(li);
	Util.registerClick('remove2_' + postFix, Worker.removeDimensionHandler);
}

Worker.removeDimensionHandlers = function (rowId) {
	
	var olId = 'metrics_' + rowId;
	if (Util.isAvailable(olId)) {
		var ol = document.getElementById(olId);
		for (var i = 0; i < ol.children.length; i++) {
			var li = ol.children[i];
			if (li.tagName.toLowerCase() === 'li') {
				var postFix = li.id.substr(li.id.indexOf('_') + 1);
				Util.deRegisterClick('remove2_' + postFix, Worker.removeDimensionHandler);
			}
		}
	}
}

Worker.handleCopyLib = function (rowId) {
	Worker.checkBoxesAsRaidos('copyLib_', rowId);
}

Worker.handleCopyGroups = function (rowId) {
	Worker.checkBoxesAsRaidos('copyGroups_', rowId);
}

Worker.checkBoxesAsRaidos = function (prefix, rowId) {

	if (rowId == null) {
		rowId = Worker.findCheckedRowId(prefix);
	}

	if (rowId == null) {
		return;
	}

	var isCheked = Util.isChecked(prefix + rowId);
	var Sources = document.getElementById('sources');
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

Worker.handleCopyInfo = function (rowId) {
	if (rowId == null) {
		rowId = Worker.findCheckedRowId('copyInfo_');
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

Worker.findCheckedRowId = function (preFix) {
	var Sources = document.getElementById('sources');
	var n = Util.noOfChildElements(Sources, 'li');
	for (var i = 1; i <= n; i++) {
		var isCheked = Util.isChecked(preFix + i) && Util.isEnalbed(preFix + i);
		if (isCheked) {
			return i.toString();
		}
	}
	return null;
}

Worker.findRowId = function (e) {
	
	var elem = (e.srcElement != null) ? e.srcElement : e.target;
	var elemId = elem.id;
	var rowId = elemId.substr(elemId.indexOf('_') + 1);
	return rowId;
}

Worker.hoverHandler = function (e, isEnter) {

	var rowId = Worker.findRowId(e);
	if (isEnter) {
		Util.setVisible('remove_' + rowId);
	}
	else {
		Util.hide('remove_' + rowId);
	}
}

Worker.addSource = function () {
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

	Util.registerClick('remove_' + rowId, Worker.removeHandler);
	Util.registerClick('muteInfo_' + rowId, Worker.muteInfoHandler);
	Util.registerClick('copyInfo_' + rowId, Worker.copyInfoHandler);
	Util.registerClick('copyGroups_' + rowId, Worker.copyGroupsHandler);
	Util.registerClick('copyLib_' + rowId, Worker.copyLibHandler);
	Util.registerClick('add2_' + rowId, Worker.addDimensionHandler);

	Worker.handleCopyInfo(null);
	Worker.handleCopyGroups(null);
	Worker.handleCopyLib(null);
	Util.setFocus('name_' + rowId);
}

Worker.removeSource = function (rowId) {

	var Sources = document.getElementById('sources');
	var n = Util.noOfChildElements(Sources, 'li');
	if (n === 1) {
		Worker.resetSource(rowId);
		return;
	}

	var srcElem = document.getElementById('source_' + rowId);
	Util.deRegisterClick('remove_' + rowId, Worker.removeHandler);
	Util.deRegisterClick('add_' + rowId, Worker.addHandler);
	Util.deRegisterClick('muteInfo_' + rowId, Worker.muteInfoHandler);
	Util.deRegisterClick('copyInfo_' + rowId, Worker.copyInfoHandler);
	Util.deRegisterClick('copyGroups_' + rowId, Worker.copyGroupsHandler);
	Util.deRegisterClick('copyLib_' + rowId, Worker.copyLibHandler);
	Util.deRegisterClick('add2_' + rowId, Worker.addDimensionHandler);
	Worker.removeDimensionHandlers(rowId);
	srcElem.parentNode.parentNode.removeChild(srcElem.parentNode);
}

Worker.resetSource = function (rowId)
{
}

Worker.pageInit = function () {
	Util.registerClick('add', Worker.addHandler);
	Worker.addSource();
}
