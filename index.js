var eejs = require('ep_etherpad-lite/node/eejs/');
const {JSDOM} = require('jsdom');

exports.eejsBlock_editbarMenuLeft = function(hook_name, args, cb) {
    args.content = args.content + eejs.require('ep_embedded_hyperlinks2/templates/editbarButtons.ejs');
    return cb();
}

exports.eejsBlock_editorContainerBox = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_embedded_hyperlinks2/templates/popup.ejs", {}, module);
  return cb();
}


// Add the props to be supported in export
exports.exportHtmlAdditionalTagsWithData = async (hookName, pad) => {
  const ret = [];
  pad.pool.eachAttrib((k, v) => { console.log(k); if (k === 'url') ret.push([k, v]); });
  return ret;
};


exports.getLineHTMLForExport = async (hookName, context) => {
  const elem = JSDOM.fragment(context.lineContent);
  elem.childNodes.forEach(function (node) {
    const attrs = node.attributes;
    if (attrs){
      for(let i = 0; i < attrs.length; i++) {
          const attr = attrs[i];
          if (attr.name === 'data-url') {
              const nodeHTML = node.outerHTML;
              const replaceHTML = (nodeHTML.substring(0, nodeHTML.length-5) + 'a>').replace('<span data-url', '<a href');
              context.lineContent = context.lineContent.replace(nodeHTML, replaceHTML)
          }
      }
    }
  });
};
