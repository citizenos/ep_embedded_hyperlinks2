'use strict';

const Changeset = require('ep_etherpad-lite/static/js/Changeset');

const _analyzeLine = (alineAttrs, apool) => {
  console.log('_analyzeLine', alineAttrs);

  let url = null;
  if (alineAttrs) {
    console.log('alineattrs', alineAttrs);
    const opIter = Changeset.opIterator(alineAttrs);
    if (opIter.hasNext()) {
      const op = opIter.next();
      console.log('op', op, 'apool', apool);
      url = Changeset.opAttributeValue(op, 'url', apool);
      console.log('URL', url);
    }
  }

  return url;
};

exports.getLineHTMLForExport = async (hook, context) => {
  console.log('getLineHTMLForExport', hook, context);
  const url = _analyzeLine(context.attribLine, context.apool);
  if (url) {
    context.lineContent = `<a href="${url}">`;
  }
};
