var eejs = require('ep_etherpad-lite/node/eejs/');
exports.eejsBlock_editbarMenuLeft = function(hook_name, args, cb) {
    args.content = args.content + eejs.require('ep_embedded_hyperlinks/templates/editbarButtons.ejs');
    return cb();
}