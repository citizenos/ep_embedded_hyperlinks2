'use strict';

const eejs = require('ep_etherpad-lite/node/eejs/');
const {JSDOM} = require('jsdom');

exports.eejsBlock_editbarMenuLeft = (hook, args, cb) => {
  args.content += eejs.require('ep_embedded_hyperlinks2/templates/editbarButtons.ejs');
  return cb();
};

exports.eejsBlock_body = (hook, args, cb) => {
  args.content += eejs.require('ep_embedded_hyperlinks2/templates/popup.ejs', {}, module);
  return cb();
};


// Add the props to be supported in export
exports.exportHtmlAdditionalTagsWithData = async (hook, pad) => {
  const ret = [];
  pad.pool.eachAttrib((k, v) => { if (k === 'url') ret.push([k, v]); });
  return ret;
};


exports.getLineHTMLForExport = async (hook, context) => {
  const elem = JSDOM.fragment(context.lineContent);
  const parseNode = async (node) => {
    const attrs = node.attributes;

    if (attrs) {
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr.name === 'data-url') {
          const nodeHTML = node.outerHTML.trim();

          const replaceHTML = (`${nodeHTML.substring(0, nodeHTML.length - 5)}a>`)
              .replace('<span data-url', '<a href');
          context.lineContent = JSDOM
              .fragment(`<div>${context.lineContent}</div>`).firstChild.innerHTML
              .replace(nodeHTML, replaceHTML);
        }
      }
    }

    if (node.childNodes) {
      node.childNodes.forEach(async (child) => {
        await parseNode(child);
      });
    }
  };

  await parseNode(elem);
};
