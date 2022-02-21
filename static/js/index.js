var $ = require('ep_etherpad-lite/static/js/rjquery').$;

var showDialog = function () {
    $('.hyperlink-dialog').addClass('popup-show');
    $('.hyperlink-dialog').css('left', $('.hyperlink-icon').offset().left - 12);
}

var addLinkListeners = function () {
    const padOuter = $('iframe[name="ace_outer"]').contents();
    const padInner = padOuter.find('iframe[name="ace_inner"]');
    const editorInfo = this.editorInfo;
    padInner.contents().find('a').off();
    padInner.contents().find('a').click(function(e) {
        let range = new Range();
        var selection= padInner.contents()[0].getSelection();
        range.selectNodeContents($(this)[0]);
        selection.removeAllRanges();
        selection.addRange(range);
        const rep = editorInfo.ace_getRep();
        showDialog();
        $('.hyperlink-text').val($(this).text());
        $('.hyperlink-url').val($(this).attr("href"));

        e.preventDefault();
        return false;
    });
}
exports.postAceInit = function(hook, context) {


    if (!$('#editorcontainerbox').hasClass('flex-layout')) {
        $.gritter.add({
            title: "Error",
            text: "Ep_embed_hyperlink2: Please upgrade to etherpad 1.9 for this plugin to work correctly",
            sticky: true,
            class_name: "error"
        })
    }
    /* Event: User clicks editbar button */
    $('.hyperlink-icon').on('click', function () {
        $('.hyperlink-text').val('');
        $('.hyperlink-url').val('');

        const padOuter = $('iframe[name="ace_outer"]').contents();
        const padInner = padOuter.find('iframe[name="ace_inner"]').contents()[0];
        var selection= padInner.getSelection();
        $('.hyperlink-text').val(selection.toString());
        showDialog();
    });

    /* Event: User creates new hyperlink */
    $('.hyperlink-save').on('click',function() {
        var url = $('.hyperlink-url').val();
        var text = $('.hyperlink-text').val();
        if(!(/^http:\/\//.test(url)) && !(/^https:\/\//.test(url))) {
            url = "http://" + url;
        }
        context.ace.callWithAce(function(ace) {
            const rep = ace.ace_getRep();
            const start = rep.selStart;
            ace.ace_replaceRange(start, rep.selEnd, text)
            ace.ace_performSelectionChange(start, [start[0], start[1]+text.length], true);
            if(ace.ace_getAttributeOnSelection("url")){
                ace.ace_setAttributeOnSelection("url", false);
              }else{
                ace.ace_setAttributeOnSelection("url", url);
              }

        }, 'insertLink', true);
        $('.hyperlink-text').val('');
        $('.hyperlink-url').val('');
        $('.hyperlink-dialog').removeClass('popup-show');
        addLinkListeners();
    });

    $('.hyperlink-remove').on('click',function() {
        context.ace.callWithAce(function(ace) {
            if(ace.ace_getAttributeOnSelection("url")){
                ace.ace_setAttributeOnSelection("url", false);
            }
        }, 'removeLink', true);
    });

    /* User press Enter on url input */
    $('.hyperlink-url').on("keyup", function(e)
    {
        if(e.keyCode == 13) // ENTER key
        {
          $('.hyperlink-save').click();
        }
    });
    addLinkListeners();
}

exports.acePostWriteDomLineHTML = function (hook, context) {
    addLinkListeners();
};

exports.aceAttribsToClasses = function(hook, context) {
    if(context.key == 'url'){
        var url = /(?:^| )url-(\S*)/.exec(context.value);
        if (!url) {
            url = context.value;
        } else {
            url = url[1]
        }
        console.log('aceAttribsToClasses', ['url', 'url-'+url ])
        return ['url', 'url-'+url ];
    }
}

/* Convert the classes into a tag */
exports.aceCreateDomLine = function(name, context) {
    var cls = context.cls;
    var url = /(?:^| )url-(\S*)/.exec(cls);
    var modifier = {};
    if(url != null) {
        url = url[1];
        if(!(/^http:\/\//.test(url)) && !(/^https:\/\//.test(url))) {
            url = "http://" + url;
        }
        console.log(url);
        modifier = {
            extraOpenTags: '<a href="' + url + '">',
            extraCloseTags: '</a>',
            cls: cls
        }
        return modifier;
    }
    return [];
}

/* I don't know what this does */
exports.aceInitialized = function(hook, context) {
    addLinkListeners = addLinkListeners.bind(context);
}

exports.collectContentPre = function(hook,context) {
    const url = /(?:^| )url-(\S*)/.exec(context.cls);
    if(url) {
        console.log('collectContentPre', url[1]);
        context.cc.doAttrib(context.state,"url::" + url[1]);
    }
}
