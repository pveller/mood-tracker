(function (window, document, config) {
  'use strict';

  var Upsamarklet = window[config.k] = {
  
    config: config,
    doc: {},
    hazWindowNow: false,
    saveScrollTop: null,
    personName: null,

    /**
     * Gets or sets the attribute of a element.
     *
     * @param el    Element.
     * @param attr  Attribute to retrieve or set.
     * @param val   [Optional] Value to set to the attribute.
     *              If null, current attribute value will be returned.
     */
    attribute: function (obj, attr, val) {
      // Get.
      if ( ! val) {
        return (typeof obj[attr] === "string") ? obj[attr] : obj.getAttribute(attr);
      }
      
      // Set.
      if (typeof obj[attr] === "string") {
        obj[attr] = val;
      }
      else {
        obj.setAttribute(attr, val);
      }
      
      return val;
    },
    
    
    /**
     * Searches an element in a array and returns its index.
     *
     * @param  array         Haystack array.
     * @param  searchElement Needle element.
     */
    indexOf: function (array, searchElement /*, fromIndex */ ) {
        if (array == null) {
            throw new TypeError();
        }
        var t = Object(array);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 0) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        
        return -1;
    },
    
    
    /**
     * Adds a event listener.
     *
     * @param el         Element to attach event to.
     * @param eventType  Event type.
     * @param callback   Event callback.
     */
    listen: function (element, eventType, callback) {
      // Standard
      if (window.addEventListener) {
        element.addEventListener(eventType, callback, false);
      }
      // IE
      else if (window.attachEvent) {
        element.attachEvent('on' + eventType, callback);
      }
    },
    
    
    unlisten: function (element, eventType, callback) {
      // Standard
      if (window.removeEventListener) {
        element.removeEventListener(eventType, callback, false)
      }
      // IE
      else if (window.detachEvent) {
        element.detachEvent('on' + eventType, callback)
      }
    },
    
    /**
     * Closes the bookmarklet and cleans up the DOM.
     *
     * @param msg Optional message to show to user.
     */
    close: function (msg) {
      // Remove elements from DOM.
      if (document.head) {
        document.head.removeChild(Upsamarklet.doc.styl);
      }
      if (document.body) {
        document.body.removeChild(Upsamarklet.doc.main);
      }
      window.hazWindowNow = false;
      if (msg) {
        window.alert(msg);
      }
      
      // Detach event listeners.
      Upsamarklet.unlisten(document, 'click', Upsamarklet.click);
      Upsamarklet.unlisten(document, 'keydown', Upsamarklet.keydown);
      
      // Return original scroll.
      window.scroll(0, Upsamarklet.saveScrollTop);
    },
    
    
    /**
     * Event handler for clicks.
     */
    click: function (event) {
      var element;
      
      event = event || window.event;
      event.preventDefault ? event.preventDefault() : event.returnValue = false;
      element = event.target || event.srcElement;
      
      // Clicking the Cancel button closes the bookmarklet.
      if (element.id === Upsamarklet.config.k + '_x') {
        Upsamarklet.close();
      }
    },
    
    
    /**
     * Event handler for keydowns.
     */
    keydown: function (event) {
      // Pressing the Esc key closes the bookmarklet.
      if ((event || window.event).keyCode === 27) {
        Upsamarklet.close();
      }
    },
    
    
    /**
     * Adds event listeners to DOM.
     */
    behavior: function () {
      Upsamarklet.listen(document, 'click', Upsamarklet.click);
      Upsamarklet.listen(document, 'keydown', Upsamarklet.keydown);
    },
    
    
    /**
     * Adds styles to DOM.
     */
    presentation: function () {
      var style;
      var template;
      
      style = document.createElement('style');
      Upsamarklet.attribute(style, 'type', 'text/css');
      Upsamarklet.attribute(style, 'id', Upsamarklet.config.k + '_style');
      template = Upsamarklet.template(Upsamarklet.config.templates.styles, { k: Upsamarklet.config.k});
      if (style.styleSheet) {
        style.styleSheet.cssText = template;
      }
      else {
        style.innerHTML = template;
      }
      if (document.head) {
        document.head.appendChild(style);
      }
      else {
        Upsamarklet.doc.main.appendChild(style);
      }
      Upsamarklet.doc.styl = style;
    },
    
    /**
     * Gets the max height of the document.
     */
    getHeight: function () {
      return Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.body.clientHeight
      );
    },
    
    
    /**
     * Adds markup to DOM.
     */
    structure: function () {
      var height;
      var mainContainer;
      
      // Creating a wrapper this way avoids reflow.
      mainContainer = document.createElement('div');
      Upsamarklet.attribute(mainContainer, 'id', Upsamarklet.config.k + '_mainContainer');
      mainContainer.innerHTML = Upsamarklet.template(Upsamarklet.config.templates.bookmarkletMarkup, { k: Upsamarklet.config.k, personName: Upsamarklet.personName });
      document.body.appendChild(mainContainer);
      
      Upsamarklet.doc.main = mainContainer;
      Upsamarklet.doc.bg = document.getElementById(Upsamarklet.config.k + '_bg');
      Upsamarklet.doc.bd = document.getElementById(Upsamarklet.config.k + '_bd');
      
      height = Upsamarklet.getHeight();
      if (Upsamarklet.doc.bd.offsetHeight < height) {
        Upsamarklet.doc.bd.style.height = height + 'px';
        Upsamarklet.doc.bg.style.height = height + 'px';
      }
      
      window.scroll(0, 0);
    },
    

    /**
     * Renders a template.
     * Uses Tim, a tiny, secure JavaScript micro-templating script.
     * https://github.com/premasagar/tim
     *
     * @param template Template as a string.
     * @param data     Data to replace in the template.
     */
    template: (function(){
        var start   = "{{",
            end     = "}}",
            path    = "[a-z0-9_][\\.a-z0-9_]*", // e.g. config.person.name
            pattern = new RegExp(start + "\\s*("+ path +")\\s*" + end, "gi"),
            undef;
        
        return function(template, data){
            // Merge data into the template string
            return template.replace(pattern, function(tag, token){
                var path = token.split("."),
                    len = path.length,
                    lookup = data,
                    i = 0;
    
                for (; i < len; i++){
                    lookup = lookup[path[i]];
                    
                    // Property not found
                    if (lookup === undef){
                        throw "tim: '" + path[i] + "' not found in " + tag;
                    }
                    
                    // Return the required value
                    if (i === len - 1){
                        return lookup;
                    }
                }
            });
        };
    }()),
    
    
    populateData: function() {
       var node = document.evaluate("//*[@id=\"logoTable\"]/tbody/tr/td[2]/table/tbody/tr[3]/td/a/text()", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
       if(typeof(node) !== 'undefined' && node != null) {
          node = node.singleNodeValue;
          if(typeof(node) !== 'undefined' && node != null) {
          Upsamarklet.personName = node.textContent;
       }}
    },

    /**
     * Bootstraps the bookmarklet.
     */
    init: function () {
      // document.head / document.body shim.
      try {
        document.head = document.head || document.getElementsByTagName('HEAD')[0];
        document.body = document.body || document.getElementsByTagName('BODY')[0];
      }
      catch (e) {}
      
      // Checks the document is a valid page.
      if ( ! document.body) {
        alert("Sorry, can't open bookmarklet from non-HTML pages.");
        
        return;
      }
      
      // Checks bookmarklet is not currently shown.
      if (window.hazWindowNow === true) {
        return;
      }
      window.hazWindowNow = true;
      Upsamarklet.saveScrollTop = window.pageYOffset;
           
      if (document.URL.indexOf('upsa.epam.com') == -1) {
        alert("It's not UPSA, bro. Visit upsa.epam.com");
        return;
      }
      
      Upsamarklet.populateData();

      if(!Upsamarklet.personName) {
         alert("Are you logged in, bro?");
         return;
      }
      // Renders the UI.
      Upsamarklet.structure();
      Upsamarklet.presentation();
      
      Upsamarklet.behavior();
    }

  };

  
  Upsamarklet.init();

}(window, document, {
  k: 'APP_' + Date.now(),
  templates: {
    styles: [
      '#{{k}}_bg {z-index:2147483641; position: absolute; top:0; right:0; bottom:0; left:0; background-color:#f2f2f2; opacity:.95; width: 100%; }',
      '#{{k}}_bd {z-index:2147483642; position: absolute; text-align: center; width: 100%; top: 0; left: 0; right: 0; font:16px hevetica neue,arial,san-serif; }',
      '#{{k}}_bd #{{k}}_hd { z-index:2147483643; -moz-box-shadow: 0 1px 2px #aaa; -webkit-box-shadow: 0 1px 2px #aaa; box-shadow: 0 1px 2px #aaa; position: fixed; *position:absolute; width:100%; top: 0; left: 0; right: 0; height: 45px; line-height: 45px; font-size: 14px; font-weight: bold; display: block; margin: 0; background: #fbf7f7; border-bottom: 1px solid #aaa; }',
      '#{{k}}_bd #{{k}}_hd a#{{k}}_x { display: inline-block; cursor: pointer; color: #524D4D; line-height: 45px; text-shadow: 0 1px #fff; float: right; text-align: center; width: 100px; border-left: 1px solid #aaa; }',
      '#{{k}}_bd #{{k}}_hd a#{{k}}_x:hover { color: #524D4D; background: #e1dfdf; text-decoration: none; }',
      '#{{k}}_bd #{{k}}_hd a#{{k}}_x:active { color: #fff; background: #716DBF; text-decoration: none; text-shadow:none;}',
      '#{{k}}_bd #{{k}}_hd #{{k}}_logo {height: 43px; width: 600px; font-size: 20px; text-shadow: 0 1px #fff; display: inline-block; margin-right: -100px; background: transparent 50% 50% no-repeat; border: none;}',
      '@media only screen and (-webkit-min-device-pixel-ratio: 2) { #{{k}}_bd #{{k}}_hd #{{k}}_logo {background-size: 100px 26px; } }',
      '#{{k}}_bd #{{k}}_spacer { display: block; height: 50px; }',
      '#{{k}}_bd span.{{k}}_upsamarkletContainer { height:200px; width:200px; visibility:hidden; display:inline-block; background:#fff; position:relative; -moz-box-shadow:0 0  2px #555; -webkit-box-shadow: 0 0  2px #555; box-shadow: 0 0  2px #555; margin: 10px; }',
      '#{{k}}_bd span.{{k}}_upsamarkletContainer.visible { visibility:visible }',
      '#{{k}}_bd span.{{k}}_upsamarkletContainer { zoom:1; *border: 1px solid #aaa; }',
      '#{{k}}_bd span.{{k}}_upsamarkletContainer img { margin:0; padding:0; border:none; }',
      '#{{k}}_bd span.{{k}}_upsamarkletContainer span.img, #{{k}}_bd span.{{k}}_upsamarkletContainer span.{{k}}_play { position: absolute; top: 0; left: 0; height:200px; width:200px; overflow:hidden; }',
      '#{{k}}_bd span.{{k}}_upsamarkletContainer cite, #{{k}}_bd span.{{k}}_upsamarkletContainer cite span { position: absolute; bottom: 0; left: 0; right: 0; width: 200px; color: #000; height: 22px; line-height: 24px; font-size: 10px; font-style: normal; text-align: center; overflow: hidden; }',
      '#{{k}}_bd span.{{k}}_upsamarkletContainer cite span.{{k}}_mask { background:#eee; opacity:.75; *filter:alpha(opacity=75); }',
      '#{{k}}_bd span.{{k}}_upsamarkletContainer a { -moz-transition-property: background-color; -moz-transition-duration: .25s; -webkit-transition-property: background-color; -webkit-transition-duration: .25s; transition-property: background-color; transition-duration: .25s; }',
      '#{{k}}_bd span.{{k}}_upsamarkletContainer a:hover { background-position: 60px 80px; background-color:rgba(0, 0, 0, 0.5); }',
      '#{{k}}_bd span.{{k}}_upsamarkletContainer a.{{k}}_hideMe { background: rgba(128, 128, 128, .5); *background: #aaa; *filter:alpha(opacity=75); line-height: 200px; font-size: 10px; color: #fff; text-align: center; font-weight: normal!important; }'
    ].join(''),
    bookmarkletMarkup: [
      '<div id="{{k}}_bg"></div>',
      '<div id="{{k}}_bd">',
        '<div id="{{k}}_spacer"></div>',
        '<div id="{{k}}_hd">',
          '<a id="{{k}}_x">Cancel</a>',
          '<span id="{{k}}_logo">{{personName}}, How do you feel today?</span>',
        '</div>',
        '<span id="{{k}}_embedContainer">',
        '<div style="padding-top: 60px;" />',
        '<iframe id="{{k}}_voteFrame" height="310" width="410" frameborder="0" style="overflow: hide; border: 1px green black;" scrolling="no" src="https://epam-mood.herokuapp.com/vote.html?name={{personName}}" />',
        '</span>',
      '</div>'
    ].join('')
  }
}));
