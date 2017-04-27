var _, $, jQuery;
var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var cssFiles = ["ep_embedded_hyperlinks/static/css/styles.css"];

/* Bind the event handler to the toolbar buttons */
exports.postAceInit = function(hook, context) {
    /* Event: User creates new hyperlink */
    $('.hyperlink-save').on('click',function() {
        var url = $('.hyperlink-url');
        context.ace.callWithAce(function(ace) {
            ace.ace_doInsertLink(url,"");
        }, 'insertLink',true);
    });
    /* Event: User clicks editbar button */
    $('.hyperlink-icon').on('click',function() {
        $('#hyperlink-dialog').toggle();
    });
}

/* Convert the classes into a tag */
exports.aceCreateDomLine = function(name, context) {
    var cls = context.cls;
    var domline = context.domline;
    var url = /(?:^| )url:([A-Za-z0-9./:$#&]*)/.exec(cls);
    var modifier = {};
    if(url) {
        modifier = {
            extraOpenTags: '<a href="' + url + '">',
            extraCloseTags: '</a>',
            cls: ''
        }
    } else {
        modifier = {
            extraOpenTags: '',
            extraCloseTags: '',
            cls: ''
        }
    }
    return [modifier];
}

/* I don't know what this does */
exports.aceInitialized = function(hook, context) {
    var editorInfo = context.editorInfo;
    editorInfo.ace_doInsertLink = _(doInsertLink).bind(context);
}

exports.aceEditorCSS = function() {
    return cssFiles;
}

function doInsertLink(url,title) {
    var rep = this.rep,
        documentAttributeManager = this.documentAttributeManager;
    if(!(rep.selStart && rep.selEnd)) {
        return;
    }
    var url = ["url",url];
    documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [url]);
}