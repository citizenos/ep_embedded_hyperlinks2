'use strict';

describe('ep_embedded_hyperlinks2', function () {
  beforeEach(async function () {
    await helper.aNewPad();
    this.timeout(60000);
  });

  //todo keypress enter
  it('add links via toolbar icon and pressing ok button', async function () {
    let firstLine = helper.linesDiv()[0];

    // select first line content
    firstLine.sendkeys('{selectall}');

    // replace with text
    await helper.edit('1link, 2link, 3link', 0);

    firstLine = helper.linesDiv()[0];
    helper.selectLines(firstLine, firstLine, 0, 5);

    // FIXME convention: click handler does not listen on buttonicon-link
    helper.padChrome$('.hyperlink-icon').click();
    helper.padChrome$('.hyperlink-url').val('beta.etherpad.com/#anchor1');
    helper.padChrome$('.hyperlink-save').click();

    await helper.waitForPromise(() => {
      const lineText = helper.textLines()[0];
      const firstSpan = helper.linesDiv()[0][0].children[0];

      return lineText === '1link, 2link, 3link' &&
        firstSpan.children[0].getAttribute('href') === 'http://beta.etherpad.com/#anchor1' &&
        firstSpan.classList.contains('url-beta.etherpad.com/#anchor1');
    });

    firstLine = helper.linesDiv()[0];
    helper.selectLines(firstLine, firstLine, 7, 12);
    helper.padChrome$('.hyperlink-icon').click();
    helper.padChrome$('.hyperlink-url').val('beta.etherpad.com/#anchor2');
    helper.padChrome$('.hyperlink-save').click();

    await helper.waitForPromise(() => {
      const lineText = helper.textLines()[0];
      const firstSpan = helper.linesDiv()[0][0].children[0];
      const thirdSpan = helper.linesDiv()[0][0].children[2];

      return lineText === '1link, 2link, 3link' &&
        firstSpan.children[0].getAttribute('href') === 'http://beta.etherpad.com/#anchor1' &&
        thirdSpan.children[0].getAttribute('href') === 'http://beta.etherpad.com/#anchor2' &&
        firstSpan.classList.contains('url-beta.etherpad.com/#anchor1') &&
        thirdSpan.classList.contains('url-beta.etherpad.com/#anchor2');
    });

    firstLine = helper.linesDiv()[0];
    helper.selectLines(firstLine, firstLine, 14, 19);
    helper.padChrome$('.hyperlink-icon').click();
    helper.padChrome$('.hyperlink-url').val('beta.etherpad.com/#anchor3');
    helper.padChrome$('.hyperlink-save').click();

    await helper.waitForPromise(() => {
      const lineText = helper.textLines()[0];
      const firstSpan = helper.linesDiv()[0][0].children[0];
      const thirdSpan = helper.linesDiv()[0][0].children[2];
      const fifthSpan = helper.linesDiv()[0][0].children[4];

      return lineText === '1link, 2link, 3link' &&
        firstSpan.children[0].getAttribute('href') === 'http://beta.etherpad.com/#anchor1' &&
        thirdSpan.children[0].getAttribute('href') === 'http://beta.etherpad.com/#anchor2' &&
        fifthSpan.children[0].getAttribute('href') === 'http://beta.etherpad.com/#anchor3' &&
        firstSpan.classList.contains('url-beta.etherpad.com/#anchor1') &&
        thirdSpan.classList.contains('url-beta.etherpad.com/#anchor2') &&
        fifthSpan.classList.contains('url-beta.etherpad.com/#anchor3');
    });
  });

  it('overwriting a link with another one does work', async function () {
    let firstLine = helper.linesDiv()[0];

    // select first line content
    firstLine.sendkeys('{selectall}');

    // replace with text
    await helper.edit('1link, 2link, 3link', 0);

    firstLine = helper.linesDiv()[0];
    helper.selectLines(firstLine, firstLine, 0, 5);

    // FIXME convention: click handler does not listen on buttonicon-link
    helper.padChrome$('.hyperlink-icon').click();
    helper.padChrome$('.hyperlink-url').val('beta.etherpad.com/#anchor1');
    helper.padChrome$('.hyperlink-save').click();

    firstLine = helper.linesDiv()[0];
    helper.selectLines(firstLine, firstLine, 7, 12);
    helper.padChrome$('.hyperlink-icon').click();
    helper.padChrome$('.hyperlink-url').val('beta.etherpad.com/#anchor2');
    helper.padChrome$('.hyperlink-save').click();

    firstLine = helper.linesDiv()[0];
    helper.selectLines(firstLine, firstLine, 14, 19);
    helper.padChrome$('.hyperlink-icon').click();
    helper.padChrome$('.hyperlink-url').val('beta.etherpad.com/#anchor3');
    helper.padChrome$('.hyperlink-save').click();

    firstLine = helper.linesDiv()[0];
    firstLine.sendkeys('{selectall}');
    helper.padChrome$('.hyperlink-icon').click();
    helper.padChrome$('.hyperlink-url').val('beta.etherpad.com/#overwritten');
    helper.padChrome$('.hyperlink-save').click();

    await helper.waitForPromise(() => {
      const lineText = helper.textLines()[0];
      const firstSpan = helper.linesDiv()[0][0].children[0];
      const firstSpanText = firstSpan.textContent;

      return lineText === '1link, 2link, 3link' &&
        firstSpan.children[0].getAttribute('href') === 'http://beta.etherpad.com/#overwritten' &&
        firstSpanText === lineText &&
        firstSpan.classList.contains('url-beta.etherpad.com/#overwritten');
    });
  });

  it('links work for text with additional attributes', async function() {
    let firstLine = helper.linesDiv()[0];

    // select first line content
    firstLine.sendkeys('{selectall}');

    // replace with text
    await helper.edit('1link, 2bold, 3link', 0);

    // make some chars bold
    firstLine = helper.linesDiv()[0];
    helper.selectLines(firstLine, firstLine, 7, 12);
    helper.padChrome$('.buttonicon-bold').click();

    firstLine = helper.linesDiv()[0];
    firstLine.sendkeys('{selectall}');
    helper.padChrome$('.hyperlink-icon').click();
    helper.padChrome$('.hyperlink-url').val('beta.etherpad.com/');
    helper.padChrome$('.hyperlink-save').click();

    await helper.waitForPromise(() => {
      const lineText = helper.textLines()[0];
      const firstSpan = helper.linesDiv()[0][0].children[0];
      const secondSpan = helper.linesDiv()[0][0].children[1];
      const thirdSpan = helper.linesDiv()[0][0].children[2];

      return lineText === '1link, 2bold, 3link' &&
        firstSpan.children[0].getAttribute('href') === 'http://beta.etherpad.com/' &&
        secondSpan.children[0].getAttribute('href') === 'http://beta.etherpad.com/' &&
        thirdSpan.children[0].getAttribute('href') === 'http://beta.etherpad.com/' &&
        firstSpan.classList.contains('url-beta.etherpad.com/') &&
        secondSpan.classList.contains('url-beta.etherpad.com/') &&
        thirdSpan.classList.contains('url-beta.etherpad.com/') &&
        secondSpan.classList.contains('b');
    });
  });
});
