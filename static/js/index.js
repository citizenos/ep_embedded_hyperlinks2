var _, $, jQuery;
var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var cssFiles = ["ep_embedded_hyperlinks/static/css/styles.css"];

/* Bind the event handler to the toolbar buttons */
exports.postAceInit = function(hook, context) {
    /* Event: User clicks editbar button */
    $('.hyperlink-icon').on('click',function() {
        $('.hyperlink-dialog').toggle();
    });
    /* Event: User creates new hyperlink */
    $('.hyperlink-save').on('click',function() {
        var url = $('.hyperlink-url').val();
        context.ace.callWithAce(function(ace) {
            ace.ace_doInsertLink(url);
        }, 'insertLink', true);
        $('.hyperlink-url').val('');
    });
}

exports.aceAttribsToClasses = function(hook, context) {
    console.log("aceAttribsToClasses");
    console.log(context,hook);
    if(context.key == 'url'){
        //var url = /(?:^| )url:([A-Za-z0-9./:$#?=&]*)/.exec(context.value);
        // We could validate the URL here
        var url = context.value;
        return ['url:' + url ];
    }
}

/* Convert the classes into a tag */
exports.aceCreateDomLine = function(name, context) {
    console.log("aceCreateDomLine");
    var cls = context.cls;
    var domline = context.domline;
    var url = /(?:^| )url:([A-Za-z0-9./:$#?=&]*)/.exec(cls);
    var modifier = {};
    if(url != null) {
        url = url.substr(4,url.length);
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
    console.log(modifier);
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

/* Event: Selecting Existing Link */
exports.aceEditEvent = function(hook, call, cb) {
    console.log('aceEditEvent');
    var cs = call.callstack;

    /* Disregard non-click events */
    if(!(cs.type == 'handleClick') && !(cs.type == 'handleKeyEvent') && !(cs.docTextChanged)) {
        return false;
    }
    if(cs.type == 'setBaseText' || cs.type == 'setup') return false;
    
    /* Find the selection's existing value */
    setTimeout(function() {
        /* Clear Value */       
        $('.hypelink-url').val('');
        console.log(call.editorInfo.ace_getAttributeOnSelection('url'));
    },250);

}

function doInsertLink(url) {
    console.log("doInsertLink");
    var rep = this.rep,
        documentAttributeManager = this.documentAttributeManager;
    if(!(rep.selStart && rep.selEnd)) {
        return;
    }
    var url = ["url",url];
    console.log(url);
    documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [url]);
}