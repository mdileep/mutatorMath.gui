Type.registerNamespace('DesignSpace');

////////////////////////////////////////////////////////////////////////////////
// DesignSpace.Canvas

DesignSpace.Canvas = function DesignSpace_Canvas() {
}
DesignSpace.Canvas.prototype = {
    
    init: function DesignSpace_Canvas$init() {
        DesignSpace.Lib._worker._registerEvents();
        DesignSpace.Lib._worker._pageInit();
    }
}


Type.registerNamespace('DesignerSpace.Lib');

////////////////////////////////////////////////////////////////////////////////
// DesignerSpace.Lib.Events

DesignerSpace.Lib.Events = function DesignerSpace_Lib_Events() {
    /// <field name="click" type="String" static="true">
    /// </field>
    /// <field name="change" type="String" static="true">
    /// </field>
}


////////////////////////////////////////////////////////////////////////////////
// DesignerSpace.Lib.Util

DesignerSpace.Lib.Util = function DesignerSpace_Lib_Util() {
}
DesignerSpace.Lib.Util.isChecked = function DesignerSpace_Lib_Util$isChecked(Id) {
    /// <param name="Id" type="String">
    /// </param>
    /// <returns type="Boolean"></returns>
    if (document.getElementById(Id) == null) {
        return false;
    }
    return document.getElementById(Id).checked;
}
DesignerSpace.Lib.Util.getValue = function DesignerSpace_Lib_Util$getValue(Id) {
    /// <param name="Id" type="String">
    /// </param>
    /// <returns type="String"></returns>
    if (document.getElementById(Id) == null) {
        return '';
    }
    return document.getElementById(Id).value.toString();
}
DesignerSpace.Lib.Util.setChecked = function DesignerSpace_Lib_Util$setChecked(Id) {
    /// <param name="Id" type="String">
    /// </param>
    if (document.getElementById(Id) == null) {
        return;
    }
    document.getElementById ( Id).checked=true;
}
DesignerSpace.Lib.Util._setDisabled = function DesignerSpace_Lib_Util$_setDisabled(Id) {
    /// <param name="Id" type="String">
    /// </param>
    if (document.getElementById(Id) == null) {
        return;
    }
    document.getElementById(Id).setAttribute('disabled', 'disabled');
}
DesignerSpace.Lib.Util._setEnabled = function DesignerSpace_Lib_Util$_setEnabled(Id) {
    /// <param name="Id" type="String">
    /// </param>
    if (document.getElementById(Id) == null) {
        return;
    }
    document.getElementById(Id).removeAttribute('disabled');
}
DesignerSpace.Lib.Util.setValue = function DesignerSpace_Lib_Util$setValue(Id, D) {
    /// <param name="Id" type="String">
    /// </param>
    /// <param name="D" type="String">
    /// </param>
    if (document.getElementById(Id) == null) {
        return;
    }
    document.getElementById ( Id).value=D;
}
DesignerSpace.Lib.Util.addOptionItem = function DesignerSpace_Lib_Util$addOptionItem(Name, Value, isGroup) {
    /// <param name="Name" type="String">
    /// </param>
    /// <param name="Value" type="String">
    /// </param>
    /// <param name="isGroup" type="Boolean">
    /// </param>
    /// <returns type="Object" domElement="true"></returns>
    var O = window.document.createElement((isGroup) ? 'optgroup' : 'option');
    if (!isGroup) {
        O.innerHTML = Name;
    }
    O.setAttribute((isGroup) ? 'label' : 'value', Value);
    return O;
}
DesignerSpace.Lib.Util.setOption = function DesignerSpace_Lib_Util$setOption(id, value) {
    /// <param name="id" type="String">
    /// </param>
    /// <param name="value" type="String">
    /// </param>
    var E = document.getElementById(id);
    for (var i = 0; i < E.children.length; i++) {
        var OG = E.children[i];
        if (OG.tagName.toLowerCase() === 'optgroup') {
            for (var j = 0; j < OG.children.length; j++) {
                var O = OG.children[j];
                if (O.value === value) {
                    O.setAttribute('selected', 'selected');
                    O.selected=true;
                }
                else if (O.attributes.getNamedItem('selected') != null && O.attributes.getNamedItem('selected').value === 'selected') {
                    O.removeAttribute('selected');
                    O.selected=false;;
                }
            }
        }
        else {
            if (OG.value === value) {
                OG.setAttribute('selected', 'selected');
                OG.selected=true;;
            }
            else if (OG.attributes.getNamedItem('selected') != null && OG.attributes.getNamedItem('selected').value === 'selected') {
                OG.removeAttribute('selected');
                OG.selected=false;;
            }
        }
    }
}
DesignerSpace.Lib.Util.selectedValue = function DesignerSpace_Lib_Util$selectedValue(id) {
    /// <summary>
    /// Selected Value from the given Dropdown element id.
    /// </summary>
    /// <param name="id" type="String">
    /// </param>
    /// <returns type="String"></returns>
    var E = window.document.getElementById(id);
    if (E.selectedIndex==-1) {
        return null;
    }
    var v = E.options[E.selectedIndex].value;
    return v;
}
DesignerSpace.Lib.Util.selectedText = function DesignerSpace_Lib_Util$selectedText(id) {
    /// <summary>
    /// Selected Text from the given Dropdown element id.
    /// </summary>
    /// <param name="id" type="String">
    /// </param>
    /// <returns type="String"></returns>
    var E = window.document.getElementById(id);
    if (E.selectedIndex==-1) {
        return null;
    }
    var v = E.options[E.selectedIndex].text;
    return v;
}
DesignerSpace.Lib.Util.setUnChecked = function DesignerSpace_Lib_Util$setUnChecked(Id) {
    /// <summary>
    /// Sets the given Check Box to Un-Checked state
    /// </summary>
    /// <param name="Id" type="String">
    /// </param>
    if (document.getElementById(Id) == null) {
        return;
    }
    document.getElementById ( Id).checked=false;
}
DesignerSpace.Lib.Util.registerEvent = function DesignerSpace_Lib_Util$registerEvent(E, eventName, elementEventListener) {
    /// <param name="E" type="String">
    /// </param>
    /// <param name="eventName" type="String">
    /// </param>
    /// <param name="elementEventListener" type="Function">
    /// </param>
    DesignerSpace.Lib.Util.registerEvent2(document.getElementById(E), eventName, elementEventListener);
}
DesignerSpace.Lib.Util.registerClick = function DesignerSpace_Lib_Util$registerClick(id, elementEventListener) {
    /// <param name="id" type="String">
    /// </param>
    /// <param name="elementEventListener" type="Function">
    /// </param>
    DesignerSpace.Lib.Util.registerEvent2(document.getElementById(id), 'click', elementEventListener);
}
DesignerSpace.Lib.Util.registerClick2 = function DesignerSpace_Lib_Util$registerClick2(Elemes, elementEventListener) {
    /// <param name="Elemes" type="Array" elementType="String">
    /// </param>
    /// <param name="elementEventListener" type="Function">
    /// </param>
    var $enum1 = ss.IEnumerator.getEnumerator(Elemes);
    while ($enum1.moveNext()) {
        var E = $enum1.current;
        DesignerSpace.Lib.Util.registerEvent2(document.getElementById(E), 'click', elementEventListener);
    }
}
DesignerSpace.Lib.Util.deRegisterClick = function DesignerSpace_Lib_Util$deRegisterClick(id, elementEventListener) {
    /// <param name="id" type="String">
    /// </param>
    /// <param name="elementEventListener" type="Function">
    /// </param>
    DesignerSpace.Lib.Util._deRegisterEvent2(document.getElementById(id), 'click', elementEventListener);
}
DesignerSpace.Lib.Util.registerEvent2 = function DesignerSpace_Lib_Util$registerEvent2(E, eventName, elementEventListener) {
    /// <param name="E" type="Object" domElement="true">
    /// </param>
    /// <param name="eventName" type="String">
    /// </param>
    /// <param name="elementEventListener" type="Function">
    /// </param>
    if (E == null) {
        return;
    }
    if (E.addEventListener!=null) {
        E.addEventListener(eventName, elementEventListener, false);
    }
    else if (E.attachEvent!=null) {
        E.attachEvent('on'+eventName, elementEventListener);
    }
    else {
        E['on'+eventName]= elementEventListener;
    }
}
DesignerSpace.Lib.Util._deRegisterEvent2 = function DesignerSpace_Lib_Util$_deRegisterEvent2(E, eventName, elementEventListener) {
    /// <param name="E" type="Object" domElement="true">
    /// </param>
    /// <param name="eventName" type="String">
    /// </param>
    /// <param name="elementEventListener" type="Function">
    /// </param>
    if (E == null) {
        return;
    }
    if (E.removeEventListener!=null) {
        E.removeEventListener(eventName, elementEventListener, false);
    }
    else if (E.detachEvent!=null) {
        E.detachEvent('on'+eventName, elementEventListener);
    }
    else {
        E['on'+eventName]=elementEventListener;
    }
}
DesignerSpace.Lib.Util.findByClass = function DesignerSpace_Lib_Util$findByClass(elem, className) {
    /// <param name="elem" type="Object" domElement="true">
    /// </param>
    /// <param name="className" type="String">
    /// </param>
    /// <returns type="Object" domElement="true"></returns>
    var coll = elem.children;
    for (var i = 0; i < coll.length; i++) {
        var e2 = coll[i];
        if (e2.className === className) {
            return e2;
        }
        var e3 = DesignerSpace.Lib.Util.findByClass(e2, className);
        if (e3 != null) {
            return e3;
        }
    }
    return null;
}
DesignerSpace.Lib.Util.registerClick3 = function DesignerSpace_Lib_Util$registerClick3(Elem, elementEventListener) {
    /// <param name="Elem" type="Object" domElement="true">
    /// </param>
    /// <param name="elementEventListener" type="Function">
    /// </param>
    DesignerSpace.Lib.Util.registerEvent2(Elem, 'click', elementEventListener);
}
DesignerSpace.Lib.Util.registerChange = function DesignerSpace_Lib_Util$registerChange(E, elementEventListener) {
    /// <param name="E" type="String">
    /// </param>
    /// <param name="elementEventListener" type="Function">
    /// </param>
    DesignerSpace.Lib.Util.registerEvent2(document.getElementById(E), 'change', elementEventListener);
}
DesignerSpace.Lib.Util._prevent = function DesignerSpace_Lib_Util$_prevent(e) {
    /// <param name="e" type="ElementEvent">
    /// </param>
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
}
DesignerSpace.Lib.Util._setVisible = function DesignerSpace_Lib_Util$_setVisible(Id) {
    /// <param name="Id" type="String">
    /// </param>
    var Elem = window.document.getElementById(Id);
    if (Elem == null) {
        return;
    }
    Elem.style.visibility = 'visible';
}
DesignerSpace.Lib.Util._setDisplay = function DesignerSpace_Lib_Util$_setDisplay(Id) {
    /// <param name="Id" type="String">
    /// </param>
    var Elem = window.document.getElementById(Id);
    if (Elem == null) {
        return;
    }
    Elem.style.display = 'block';
}
DesignerSpace.Lib.Util._noDisplay = function DesignerSpace_Lib_Util$_noDisplay(Id) {
    /// <param name="Id" type="String">
    /// </param>
    var Elem = window.document.getElementById(Id);
    if (Elem == null) {
        return;
    }
    Elem.style.display = 'none';
}
DesignerSpace.Lib.Util._isAvailable = function DesignerSpace_Lib_Util$_isAvailable(Id) {
    /// <param name="Id" type="String">
    /// </param>
    /// <returns type="Boolean"></returns>
    return window.document.getElementById(Id) != null;
}
DesignerSpace.Lib.Util._setClass = function DesignerSpace_Lib_Util$_setClass(Id, className) {
    /// <param name="Id" type="String">
    /// </param>
    /// <param name="className" type="String">
    /// </param>
    if (DesignerSpace.Lib.Util._isAvailable(Id)) {
        document.getElementById(Id).className = className;
    }
}
DesignerSpace.Lib.Util._hide = function DesignerSpace_Lib_Util$_hide(Id) {
    /// <param name="Id" type="String">
    /// </param>
    if (DesignerSpace.Lib.Util._isAvailable(Id)) {
        window.document.getElementById(Id).style.visibility = 'hidden';
    }
}
DesignerSpace.Lib.Util.scrollTo = function DesignerSpace_Lib_Util$scrollTo(Id) {
    /// <param name="Id" type="String">
    /// </param>
    if (DesignerSpace.Lib.Util._isAvailable(Id)) {
        try {
            window.document.getElementById(Id).scrollIntoView();
        }
        catch ($e1) {
        }
    }
}
DesignerSpace.Lib.Util.noTags = function DesignerSpace_Lib_Util$noTags(s) {
    /// <param name="s" type="String">
    /// </param>
    /// <returns type="String"></returns>
    return s.toLowerCase().replaceAll('<u>', '').replaceAll('</u>', '').replaceAll('<b>', '').replaceAll('<i>', '').replaceAll('</b>', '').replaceAll('</i>', '');
}
DesignerSpace.Lib.Util.setFocus = function DesignerSpace_Lib_Util$setFocus(Id) {
    /// <param name="Id" type="String">
    /// </param>
    if (document.getElementById(Id) == null) {
        return;
    }
    else {
        document.getElementById(Id).focus();
    }
}
DesignerSpace.Lib.Util.setCheckedValue = function DesignerSpace_Lib_Util$setCheckedValue(Id, value) {
    /// <param name="Id" type="String">
    /// </param>
    /// <param name="value" type="Boolean">
    /// </param>
    if (value) {
        DesignerSpace.Lib.Util.setChecked(Id);
    }
    else {
        DesignerSpace.Lib.Util.setUnChecked(Id);
    }
}
DesignerSpace.Lib.Util._noOfChildElements = function DesignerSpace_Lib_Util$_noOfChildElements(Parent, id) {
    /// <param name="Parent" type="Object" domElement="true">
    /// </param>
    /// <param name="id" type="String">
    /// </param>
    /// <returns type="Number" integer="true"></returns>
    var count = 0;
    for (var i = 0; i < Parent.children.length; i++) {
        var e = Parent.children[i];
        if (String.isNullOrEmpty(id) || id === '*') {
            count++;
            continue;
        }
        if (id.toLowerCase() === e.tagName.toLowerCase()) {
            count++;
        }
    }
    return count;
}
DesignerSpace.Lib.Util._registerHover = function DesignerSpace_Lib_Util$_registerHover(id, MouseEnter, MouseLeave) {
    /// <param name="id" type="String">
    /// </param>
    /// <param name="MouseEnter" type="Function">
    /// </param>
    /// <param name="MouseLeave" type="Function">
    /// </param>
    DesignerSpace.Lib.Util.registerEvent(id, 'mouseenter', MouseEnter);
    DesignerSpace.Lib.Util.registerEvent(id, 'mouseleave', MouseLeave);
}
DesignerSpace.Lib.Util._isEnalbed = function DesignerSpace_Lib_Util$_isEnalbed(id) {
    /// <param name="id" type="String">
    /// </param>
    /// <returns type="Boolean"></returns>
    return !document.getElementById(id).hasAttribute('disabled');
}
DesignerSpace.Lib.Util._isDisabled = function DesignerSpace_Lib_Util$_isDisabled(id) {
    /// <param name="id" type="String">
    /// </param>
    /// <returns type="Boolean"></returns>
    return !DesignerSpace.Lib.Util._isEnalbed(id);
}
DesignerSpace.Lib.Util.applyTemplate = function DesignerSpace_Lib_Util$applyTemplate(templateId, Dict) {
    /// <summary>
    /// Binds a given template script id with the given data
    /// </summary>
    /// <param name="templateId" type="String">
    /// </param>
    /// <param name="Dict" type="Object">
    /// </param>
    /// <returns type="String"></returns>
    var template = document.getElementById(templateId).innerHTML;
    var html = template;
    var $enum1 = ss.IEnumerator.getEnumerator(Object.keys(Dict));
    while ($enum1.moveNext()) {
        var Key = $enum1.current;
        html = html.replace(new RegExp('{' + Key + '}', 'g'), Dict[Key].toString());
    }
    return html;
}
DesignerSpace.Lib.Util.setFocusOnEditableChild = function DesignerSpace_Lib_Util$setFocusOnEditableChild(E) {
    /// <summary>
    /// Sets focus on First Editable Child Control : Currently supports Input,Select only
    /// </summary>
    /// <param name="E" type="Object" domElement="true">
    /// </param>
    /// <returns type="Boolean"></returns>
    for (var i = 0; i < E.children.length; i++) {
        var OG = E.children[i];
        switch (OG.tagName.toLowerCase()) {
            case 'input':
            case 'select':
                DesignerSpace.Lib.Util.setFocus(OG.id);
                return true;
            default:
                var found = DesignerSpace.Lib.Util.setFocusOnEditableChild(OG);
                if (found) {
                    return true;
                }
                break;
        }
    }
    return false;
}
DesignerSpace.Lib.Util._setFocusOnEditableChildById = function DesignerSpace_Lib_Util$_setFocusOnEditableChildById(targetId) {
    /// <param name="targetId" type="String">
    /// </param>
    if (DesignerSpace.Lib.Util._isAvailable(targetId)) {
        DesignerSpace.Lib.Util.setFocusOnEditableChild(document.getElementById(targetId));
    }
}


Type.registerNamespace('DesignSpace.Lib');

////////////////////////////////////////////////////////////////////////////////
// DesignSpace.Lib._worker

DesignSpace.Lib._worker = function DesignSpace_Lib__worker() {
    /// <field name="_removeHandler" type="Function" static="true">
    /// </field>
    /// <field name="_addHandler" type="Function" static="true">
    /// </field>
    /// <field name="_mouseEnterHandler" type="Function" static="true">
    /// </field>
    /// <field name="_mouseLeaveHandler" type="Function" static="true">
    /// </field>
    /// <field name="_muteInfoHandler" type="Function" static="true">
    /// </field>
    /// <field name="_copyInfoHandler" type="Function" static="true">
    /// </field>
    /// <field name="_copyGroupsHandler" type="Function" static="true">
    /// </field>
    /// <field name="_copyLibHandler" type="Function" static="true">
    /// </field>
    /// <field name="_addDimensionHandler" type="Function" static="true">
    /// </field>
    /// <field name="_removeDimensionHandler" type="Function" static="true">
    /// </field>
    /// <field name="_disposeHandler" type="Function" static="true">
    /// </field>
}
DesignSpace.Lib._worker._registerEvents = function DesignSpace_Lib__worker$_registerEvents() {
    DesignSpace.Lib._worker._addHandler = function(e) {
        DesignSpace.Lib._worker._addSource();
    };
    DesignSpace.Lib._worker._removeHandler = function(e) {
        var rowId = DesignSpace.Lib._worker._findRowId(e);
        DesignSpace.Lib._worker._removeSource(rowId);
    };
    DesignSpace.Lib._worker._mouseEnterHandler = function(e) {
        DesignSpace.Lib._worker._hoverHandler(e, true);
    };
    DesignSpace.Lib._worker._mouseLeaveHandler = function(e) {
        DesignSpace.Lib._worker._hoverHandler(e, false);
    };
    DesignSpace.Lib._worker._muteInfoHandler = function(e) {
        var rowId = DesignSpace.Lib._worker._findRowId(e);
        if (DesignerSpace.Lib.Util.isChecked('muteInfo_' + rowId)) {
            DesignerSpace.Lib.Util._setDisabled('copyInfo_' + rowId);
        }
        else {
            DesignerSpace.Lib.Util._setEnabled('copyInfo_' + rowId);
        }
        DesignerSpace.Lib.Util.setUnChecked('copyInfo_' + rowId);
    };
    DesignSpace.Lib._worker._copyInfoHandler = function(e) {
        var rowId = DesignSpace.Lib._worker._findRowId(e);
        DesignSpace.Lib._worker._handleCopyInfo(rowId);
    };
    DesignSpace.Lib._worker._copyGroupsHandler = function(e) {
        var rowId = DesignSpace.Lib._worker._findRowId(e);
        DesignSpace.Lib._worker._handleCopyGroups(rowId);
    };
    DesignSpace.Lib._worker._copyLibHandler = function(e) {
        var rowId = DesignSpace.Lib._worker._findRowId(e);
        DesignSpace.Lib._worker._handleCopyLib(rowId);
    };
    DesignSpace.Lib._worker._addDimensionHandler = function(e) {
        var rowId = DesignSpace.Lib._worker._findRowId(e);
        DesignSpace.Lib._worker._handleDimension(rowId);
    };
    DesignSpace.Lib._worker._removeDimensionHandler = function(e) {
        var rowId = DesignSpace.Lib._worker._findRowId(e);
        DesignSpace.Lib._worker._handleRemoveDimension(rowId);
    };
    DesignSpace.Lib._worker._disposeHandler = function(e) {
        DesignSpace.Lib._worker._removeHandler = null;
        DesignSpace.Lib._worker._addHandler = null;
        DesignSpace.Lib._worker._mouseEnterHandler = null;
        DesignSpace.Lib._worker._mouseLeaveHandler = null;
        DesignSpace.Lib._worker._muteInfoHandler = null;
        DesignSpace.Lib._worker._copyInfoHandler = null;
        DesignSpace.Lib._worker._copyGroupsHandler = null;
        DesignSpace.Lib._worker._copyLibHandler = null;
        DesignSpace.Lib._worker._addDimensionHandler = null;
        DesignSpace.Lib._worker._removeDimensionHandler = null;
        DesignSpace.Lib._worker._disposeHandler = null;
    };
}
DesignSpace.Lib._worker._handleRemoveDimension = function DesignSpace_Lib__worker$_handleRemoveDimension(rowId) {
    /// <param name="rowId" type="String">
    /// </param>
    DesignerSpace.Lib.Util.registerClick('remove2_' + rowId, DesignSpace.Lib._worker._removeDimensionHandler);
    var li = document.getElementById('metric_' + rowId);
    li.parentNode.removeChild(li);
}
DesignSpace.Lib._worker._handleDimension = function DesignSpace_Lib__worker$_handleDimension(rowId) {
    /// <param name="rowId" type="String">
    /// </param>
    var val = DesignerSpace.Lib.Util.selectedValue('dimension_' + rowId);
    var text = DesignerSpace.Lib.Util.selectedText('dimension_' + rowId);
    var postFix = val + '_' + rowId;
    var targetId = 'metric_' + postFix;
    if (document.getElementById(targetId) != null) {
        DesignerSpace.Lib.Util._setFocusOnEditableChildById(targetId);
        return;
    }
    var Dict = {};
    Dict['ID'] = rowId;
    Dict['value'] = val;
    Dict['text'] = text;
    var html = DesignerSpace.Lib.Util.applyTemplate('DimensionTemplate', Dict);
    var li = document.createElement('li');
    li.setAttribute('id', targetId);
    li.innerHTML = html;
    var ol = document.getElementById('metrics_' + rowId);
    ol.appendChild(li);
    DesignerSpace.Lib.Util.registerClick('remove2_' + postFix, DesignSpace.Lib._worker._removeDimensionHandler);
}
DesignSpace.Lib._worker._removeDimensionHandlers = function DesignSpace_Lib__worker$_removeDimensionHandlers(rowId) {
    /// <param name="rowId" type="String">
    /// </param>
    var olId = 'metrics_' + rowId;
    if (DesignerSpace.Lib.Util._isAvailable(olId)) {
        var ol = document.getElementById(olId);
        for (var i = 0; i < ol.children.length; i++) {
            var li = ol.children[i];
            if (li.tagName.toLowerCase() === 'li') {
                var postFix = li.id.substr(li.id.indexOf('_') + 1);
                DesignerSpace.Lib.Util.deRegisterClick('remove2_' + postFix, DesignSpace.Lib._worker._removeDimensionHandler);
            }
        }
    }
}
DesignSpace.Lib._worker._handleCopyLib = function DesignSpace_Lib__worker$_handleCopyLib(rowId) {
    /// <param name="rowId" type="String">
    /// </param>
    DesignSpace.Lib._worker._checkBoxesAsRaidos('copyLib_', rowId);
}
DesignSpace.Lib._worker._handleCopyGroups = function DesignSpace_Lib__worker$_handleCopyGroups(rowId) {
    /// <param name="rowId" type="String">
    /// </param>
    DesignSpace.Lib._worker._checkBoxesAsRaidos('copyGroups_', rowId);
}
DesignSpace.Lib._worker._checkBoxesAsRaidos = function DesignSpace_Lib__worker$_checkBoxesAsRaidos(prefix, rowId) {
    /// <param name="prefix" type="String">
    /// </param>
    /// <param name="rowId" type="String">
    /// </param>
    if (rowId == null) {
        rowId = DesignSpace.Lib._worker._findCheckedRowId(prefix);
    }
    if (rowId == null) {
        return;
    }
    var isCheked = DesignerSpace.Lib.Util.isChecked(prefix + rowId);
    var Sources = document.getElementById('sources');
    var n = DesignerSpace.Lib.Util._noOfChildElements(Sources, 'li');
    for (var i = 1; i <= n; i++) {
        if (i.toString() === rowId) {
            continue;
        }
        if (isCheked) {
            DesignerSpace.Lib.Util._setDisabled(prefix + i);
        }
        else {
            DesignerSpace.Lib.Util._setEnabled(prefix + i);
        }
        DesignerSpace.Lib.Util.setUnChecked(prefix + i);
    }
}
DesignSpace.Lib._worker._handleCopyInfo = function DesignSpace_Lib__worker$_handleCopyInfo(rowId) {
    /// <param name="rowId" type="String">
    /// </param>
    if (rowId == null) {
        rowId = DesignSpace.Lib._worker._findCheckedRowId('copyInfo_');
    }
    if (rowId == null) {
        return;
    }
    var isCheked = DesignerSpace.Lib.Util.isChecked('copyInfo_' + rowId);
    var Sources = document.getElementById('sources');
    var n = DesignerSpace.Lib.Util._noOfChildElements(Sources, 'li');
    for (var i = 1; i <= n; i++) {
        if (i.toString() === rowId) {
            continue;
        }
        if (isCheked) {
            DesignerSpace.Lib.Util._setDisabled('copyInfo_' + i);
            DesignerSpace.Lib.Util._setEnabled('muteInfo_' + i);
            DesignerSpace.Lib.Util.setChecked('muteInfo_' + i);
        }
        else {
            DesignerSpace.Lib.Util._setEnabled('copyInfo_' + i);
            DesignerSpace.Lib.Util.setUnChecked('muteInfo_' + i);
        }
        DesignerSpace.Lib.Util.setUnChecked('copyInfo_' + i);
    }
}
DesignSpace.Lib._worker._findCheckedRowId = function DesignSpace_Lib__worker$_findCheckedRowId(preFix) {
    /// <param name="preFix" type="String">
    /// </param>
    /// <returns type="String"></returns>
    var Sources = document.getElementById('sources');
    var n = DesignerSpace.Lib.Util._noOfChildElements(Sources, 'li');
    for (var i = 1; i <= n; i++) {
        var isCheked = DesignerSpace.Lib.Util.isChecked(preFix + i) && DesignerSpace.Lib.Util._isEnalbed(preFix + i);
        if (isCheked) {
            return i.toString();
        }
    }
    return null;
}
DesignSpace.Lib._worker._findRowId = function DesignSpace_Lib__worker$_findRowId(e) {
    /// <param name="e" type="ElementEvent">
    /// </param>
    /// <returns type="String"></returns>
    var elem = (e.srcElement != null) ? e.srcElement : e.target;
    var elemId = elem.id;
    var rowId = elemId.substr(elemId.indexOf('_') + 1);
    return rowId;
}
DesignSpace.Lib._worker._hoverHandler = function DesignSpace_Lib__worker$_hoverHandler(e, isEnter) {
    /// <param name="e" type="ElementEvent">
    /// </param>
    /// <param name="isEnter" type="Boolean">
    /// </param>
    var rowId = DesignSpace.Lib._worker._findRowId(e);
    if (isEnter) {
        DesignerSpace.Lib.Util._setVisible('remove_' + rowId);
    }
    else {
        DesignerSpace.Lib.Util._hide('remove_' + rowId);
    }
}
DesignSpace.Lib._worker._addSource = function DesignSpace_Lib__worker$_addSource() {
    var Sources = document.getElementById('sources');
    var n = DesignerSpace.Lib.Util._noOfChildElements(Sources, 'li');
    if (!n) {
        n = 1;
    }
    while (document.getElementById('source_' + n) != null) {
        n = n + 1;
    }
    var rowId = n.toString();
    var dic = {};
    dic['ID'] = rowId;
    var html = DesignerSpace.Lib.Util.applyTemplate('SourceTemplate', dic);
    var source = document.createElement('li');
    source.innerHTML = html;
    Sources.appendChild(source);
    DesignerSpace.Lib.Util.registerClick('remove_' + rowId, DesignSpace.Lib._worker._removeHandler);
    DesignerSpace.Lib.Util.registerClick('muteInfo_' + rowId, DesignSpace.Lib._worker._muteInfoHandler);
    DesignerSpace.Lib.Util.registerClick('copyInfo_' + rowId, DesignSpace.Lib._worker._copyInfoHandler);
    DesignerSpace.Lib.Util.registerClick('copyGroups_' + rowId, DesignSpace.Lib._worker._copyGroupsHandler);
    DesignerSpace.Lib.Util.registerClick('copyLib_' + rowId, DesignSpace.Lib._worker._copyLibHandler);
    DesignerSpace.Lib.Util.registerClick('add2_' + rowId, DesignSpace.Lib._worker._addDimensionHandler);
    DesignSpace.Lib._worker._handleCopyInfo(null);
    DesignSpace.Lib._worker._handleCopyGroups(null);
    DesignSpace.Lib._worker._handleCopyLib(null);
    DesignerSpace.Lib.Util.setFocus('name_' + rowId);
}
DesignSpace.Lib._worker._removeSource = function DesignSpace_Lib__worker$_removeSource(rowId) {
    /// <param name="rowId" type="String">
    /// </param>
    var Sources = document.getElementById('sources');
    var n = DesignerSpace.Lib.Util._noOfChildElements(Sources, 'li');
    if (n === 1) {
        DesignSpace.Lib._worker._resetSource(rowId);
        return;
    }
    var srcElem = document.getElementById('source_' + rowId);
    DesignerSpace.Lib.Util.deRegisterClick('remove_' + rowId, DesignSpace.Lib._worker._removeHandler);
    DesignerSpace.Lib.Util.deRegisterClick('add_' + rowId, DesignSpace.Lib._worker._addHandler);
    DesignerSpace.Lib.Util.deRegisterClick('muteInfo_' + rowId, DesignSpace.Lib._worker._muteInfoHandler);
    DesignerSpace.Lib.Util.deRegisterClick('copyInfo_' + rowId, DesignSpace.Lib._worker._copyInfoHandler);
    DesignerSpace.Lib.Util.deRegisterClick('copyGroups_' + rowId, DesignSpace.Lib._worker._copyGroupsHandler);
    DesignerSpace.Lib.Util.deRegisterClick('copyLib_' + rowId, DesignSpace.Lib._worker._copyLibHandler);
    DesignerSpace.Lib.Util.deRegisterClick('add2_' + rowId, DesignSpace.Lib._worker._addDimensionHandler);
    DesignSpace.Lib._worker._removeDimensionHandlers(rowId);
    srcElem.parentNode.parentNode.removeChild(srcElem.parentNode);
}
DesignSpace.Lib._worker._resetSource = function DesignSpace_Lib__worker$_resetSource(rowId) {
    /// <param name="rowId" type="String">
    /// </param>
}
DesignSpace.Lib._worker._pageInit = function DesignSpace_Lib__worker$_pageInit() {
    DesignerSpace.Lib.Util.registerClick('add', DesignSpace.Lib._worker._addHandler);
    DesignSpace.Lib._worker._addSource();
}


DesignSpace.Canvas.registerClass('DesignSpace.Canvas');
DesignerSpace.Lib.Events.registerClass('DesignerSpace.Lib.Events');
DesignerSpace.Lib.Util.registerClass('DesignerSpace.Lib.Util');
DesignSpace.Lib._worker.registerClass('DesignSpace.Lib._worker');
DesignerSpace.Lib.Events.click = 'click';
DesignerSpace.Lib.Events.change = 'change';
DesignSpace.Lib._worker._removeHandler = null;
DesignSpace.Lib._worker._addHandler = null;
DesignSpace.Lib._worker._mouseEnterHandler = null;
DesignSpace.Lib._worker._mouseLeaveHandler = null;
DesignSpace.Lib._worker._muteInfoHandler = null;
DesignSpace.Lib._worker._copyInfoHandler = null;
DesignSpace.Lib._worker._copyGroupsHandler = null;
DesignSpace.Lib._worker._copyLibHandler = null;
DesignSpace.Lib._worker._addDimensionHandler = null;
DesignSpace.Lib._worker._removeDimensionHandler = null;
DesignSpace.Lib._worker._disposeHandler = null;
