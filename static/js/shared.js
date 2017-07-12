var _ = require('ep_etherpad-lite/static/js/underscore');

var tags = ['a'];

exports.collectContentPre = function(hook,context) {
    var url = /(?:^| )url-(\S*)/.exec(context.cls);
    console.log(url)
    if(url) {
        context.cc.doAttrib(context.state,"url::" + url);
    }
    /*var tname = context.tname;
    var state = context.state;
    var content = context.cc;
    var lineAttributes = state.lineAttributes;
    var tagIndex = _.indexOf(tags,tname);

    if(tagIndex >= 0) {
        lineAttributes['url'] = tags[tagIndex];
        console.log('Found Tag');
        console.log(state.localAttribs, state.attribs, state.flags);
    }*/
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

