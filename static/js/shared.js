var _ = require('ep_etherpad-lite/static/js/underscore');

exports.collectContentPre = function(hook,context) {
    console.log("collectContentPre", context.cls);
    var url = /(?:^| )url:([A-Za-z0-9./:$#?=&]*)/.exec(context.cls);
     console.log(url)
    if(url) {
        context.cc.doAttrib(context.state,"url::" + url);
    }
    
}
exports.collectContentPost = function(hook,context) {

}