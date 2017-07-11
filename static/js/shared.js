var _ = require('ep_etherpad-lite/static/js/underscore');

exports.collectContentPre = function(hook,context) {
    /*console.log("collectContentPre", context.cls);
    console.log(context.state.lineAttributes);
    var url = /(?:^| )url:([A-Za-z0-9./:$#?=&]*)/.exec(context.cls);
    console.log(url)
    if(url == null) {
        url = "hello.com"
    }
    if(url) {
        context.cc.doAttrib(context.state,"url::" + url);
    }*/
/*    var tname = context.tname;
    var state = context.state;
    var lineAttributes = state.lineAttributes;
    var tagIndex = _.indexOf(tags,tname);

    console.log(tagIndex, lineAttributes);

    if(tagIndex >= 0) {
        lineAttributes['url'] = tags[tagIndex];
    }
*/    
}
exports.collectContentPost = function(hook,context) {
    /*var tname = context.tname;
    var state = context.state;
    var lineAttributes = state.lineAttributes;
    var tagIndex = _.indexOf(tags,tname);

    console.log(tagIndex, lineAttributes);

    if(tagIndex >= 0) {
        delete lineAttributes['url'];
    }
*/   
}

