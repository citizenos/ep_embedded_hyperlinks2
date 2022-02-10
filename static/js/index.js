const $ = require('ep_etherpad-lite/static/js/rjquery').$;

/**
 * Bind the event handler to the toolbar buttons
 *
 * @see https://etherpad.org/doc/v1.8.16/#index_postaceinit
 */
exports.postAceInit = function (hook, context) {
    if (!$('#editorcontainerbox').hasClass('flex-layout')) {
        $.gritter.add({
            title: 'Error',
            text: 'Ep_embed_hyperlink2: Please upgrade to Etherpad 1.9 for this plugin to work correctly',
            sticky: true,
            class_name: 'error'
        })
    }

    /* Event: User clicks editbar button */
    $('.hyperlink-icon').on('click', function () {
        $('.hyperlink-dialog').toggleClass('popup-show');
        $('.hyperlink-dialog').css('left', $('.hyperlink-icon').offset().left - 12);
    });

    /* Event: User creates new hyperlink */
    $('.hyperlink-save').on('click', function () {
        const url = $('.hyperlink-url').val();

        context.ace.callWithAce(function (ace) {
            ace.ace_doInsertLink(url);
        }, 'insertLink', true);

        $('.hyperlink-url').val('');
        $('.hyperlink-dialog').removeClass('popup-show');
    });

    /* User press Enter on url input */
    $('.hyperlink-url').on('keyup', function (e) {
        if (e.code === 13 || e.keyCode === 13) // ENTER key
        {
            $('.hyperlink-save').click();
        }
    });
};

/**
 * @see https://etherpad.org/doc/v1.8.16/#index_aceattribstoclasses
 */
exports.aceAttribsToClasses = function (hook, context) {
    if (context.key === 'url') {
        const url = context.value;
        return ['url-' + url];
    }
};

/**
 * Convert the classes into a tag in the editor UI
 *
 * The element in the DOM will have class "url-${link}" and this will generate HTML <a tag woith href=${url}.
 *
 * https://etherpad.org/doc/v1.8.16/#index_acecreatedomline
 */
exports.aceCreateDomLine = function (name, context) {
    console.log('aceCreateDomLine', name, context);

    const cls = context.cls;
    let url = /(?:^| )url-(\S*)/.exec(cls);
    let modifier = {};
    if (url != null) {
        url = url[1];

        if (!(/^http:\/\//.test(url)) && !(/^https:\/\//.test(url))) {
            url = "http://" + url;
        }

        modifier = {
            extraOpenTags: '<a href="' + url + '">',
            extraCloseTags: '</a>',
            cls: cls
        };

        return modifier;
    }
    return [];
};

function doInsertLink (url) {
    const rep = this.rep;
    const documentAttributeManager = this.documentAttributeManager;
    if (!(rep.selStart && rep.selEnd)) {
        return;
    }
    const urlToInsert = ['url', url];
    documentAttributeManager.setAttributesOnRange(rep.selStart, rep.selEnd, [urlToInsert]);
}

/**
 * @https://etherpad.org/doc/v1.8.16/#index_aceinitialized
 */
exports.aceInitialized = function (hook, context) {
    const editorInfo = context.editorInfo;
    editorInfo.ace_doInsertLink = doInsertLink.bind(context);
};

/**
 * @see https://etherpad.org/doc/v1.8.16/#index_collectcontentpre
 */
exports.collectContentPre = function (hook, context) {
    const url = /(?:^| )url-(\S*)/.exec(context.cls);
    if (url) {
        context.cc.doAttrib(context.state, 'url::' + url);
    }
};
