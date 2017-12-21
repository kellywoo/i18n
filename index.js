(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? (module.exports = factory) :
    typeof define === 'function' && define.amd ? define(factory) : (function () {
      global.i18n = factory;
    })();
})(this,
  function translate (dictionary, option) {

    function i18n (dictionary, option) {
      var $this = this;
      var INNERHTML = option.useInnerHTML || 'data-html';
      var LANGKEY = option.langKey || 'data-key';
      var _currentLang = option.init;
      var _className = option.className || 'i18n';
      var _applyToHtml = option.applyHtmlLang || false;
      var _useCurly = option.useCurly || true;
      var _dictionary = dictionary;
      var useInnerHtml = {};
      var elements;

      function assign (obj) {
        if ( typeof obj !== 'object' ) {
          return false;
        }
        var tempObj = {};
        for ( var key in obj ) {
          tempObj[ key ] = '';
        }
        return tempObj;
      }

      /*
       * detects when dom elements is removed or inserted to the document
       * */
      function documentDetect () {
        document.addEventListener('DOMNodeRemoved', function (e) {
          var target = e.target;
          if ( target.tagName ) {
            var i, j,
              list = target.classList.contains(_className) ? [ target ]
                : [].slice.call(target.querySelectorAll('.' + _className));
            for ( j = 0; j < list.length; j++ ) {
              var key = list[ j ].__translate__
              for ( i = 0; i < elements[ key ].length; i++ ) {
                if ( elements[ key ][ i ] === target ) {
                  elements[ key ].splice(i, 1);
                }
              }
            }
          }
        })
        document.addEventListener('DOMNodeInserted', function (e) {
          var target = e.target;
          if ( target.tagName ) {
            var i,
              list = target.classList.contains(_className) ? [ target ]
                : [].slice.call(target.querySelectorAll('.' + _className));
            for ( i = 0; i < list.length; i++ ) {
              initDom(list[ i ]);
            }
          }
        })
      }

      /*
       * execute changing language
       * it is provoked by $this.lang's setter
       * */
      function changeLang (lang) {
        Object.keys(elements).forEach(function (key) {
          if ( (elements[ key ] && elements[ key ].length) ) {
            if ( useInnerHtml[ key ] ) {
              elements[ key ].forEach(function (el) {
                el.innerHTML = _dictionary[ lang ][ key ] || key
              })
            } else {
              elements[ key ].forEach(function (el) {
                el.textContent = _dictionary[ lang ][ key ] || key
              })
            }
          }
        })
      }

      /*
       * get value of attributes from the element
       * @attribute language Key
       * @attribute whether to use innerHTML or textContent
       * */
      function getLangKeyAttribute (el) {
        var key = el.getAttribute(LANGKEY);
        el.removeAttribute(LANGKEY);
        useInnerHtml[ key ] = typeof el.getAttribute(INNERHTML) === 'string';
        return key;
      }

      /*
       * get language key from element
       * */
      function getKeyWhenInitDom (el, useCurly) {
        var key;

        // curlybracket expression
        if ( useCurly ) {
          var text = el.textContent.trim();

          // 1.first check innerHTML
          key = text.match(/^{{{\s?(\S+)\s?}}}$/);
          if ( key ) {
            key = key[ 1 ];
            useInnerHtml[ key ] = true;
            return key
          } else {
            // 2.check textContent
            key = text.match(/^{{\s?(\S+)\s?}}$/);
            if ( key ) {
              return key[ 1 ];
            } else {
              // 3.in case used as attribute
              return getLangKeyAttribute(el)
            }
          }
          // attribute expression
        } else {
          return getLangKeyAttribute(el)
        }
      }


      /*
       * register dom to elements for translatiion by it's key
       * */
      function initDom (el) {
        var key;

        // once initiated like the case it is removed
        // from the document and inserted again
        console.log(el);
        if ( key = el.__translate__ ) {
          updateDom([el],key);
          elements[ key ].push(el);
          // if it's the first time dom init
        } else {
          key = getKeyWhenInitDom(el, _useCurly)
          el.classList.remove(_className);

          if ( key ) {
            // elements can have duplicated wording, so keep in in array
            elements[ key ] = elements[ key ] || [];
            elements[ key ].push(el);
            el.__translate__ = key;

            if ( el.getAttribute(INNERHTML) ) {
              // innerHTML and textContent differed by words not elements
              // so it doesn't have to be recorded separately
              useInnerHtml[ key ] = true;
            }
            updateDom([el],key);
          }
        }
      }

      function updateDom (elArr, key) {
        elArr.forEach(
          function (el) {
            if ( useInnerHtml[ key ] ) {
              el.innerHTML = _dictionary[ $this.lang ][ key ] || key
            } else {
              el.textContent = _dictionary[ $this.lang ][ key ] || key
            }
          }
        )
      }

      // when dictionary updated it should update elements as well

      var _keysToUpdate = [];

      function mergeDic (to, from) {
        if ( !from ) {
          return to;
        }
        for ( var i in from ) {
          if ( to[ i ] !== from [ i ] ) {
            _keysToUpdate.push(i);
            to[ i ] = from [ i ]
          }
        }
        return to;
      }

      function addDictionary (name, obj){
        _keysToUpdate = [];
        mergeDic(_dictionary[ name ], obj);
        while (_keysToUpdate.length) {
          var key = _keysToUpdate.pop();
          updateDom(elements[key], key)
        }
      }

      $this.addDictionary = function (name, obj) {
        if ( typeof name === 'object' ) {
          var lang = Object.keys(name);
          for ( var i = 0; i < lang.length; i++ ) {
            addDictionary( lang[i], name[ lang[i]])
          }
        } else if ( typeof name === 'string' && _dictionary[ name ] && typeof obj === 'object' ) {
          addDictionary( name, obj)
        } else {
          console.warn('parameters put in are not right format.')
        }
      }

      const nextTick = (function () {
        return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60)
          }
      })()
      function sliceInterval (arr, limit, fn, callback) {
        var len= Math.min(arr.length,limit);
        console.log(len);
        var runner = function(){
          for(var i = 0; i < len; i++) {
            fn(arr.shift())
          }
          if(arr.length > 0) {
            nextTick(function(){ sliceInterval(arr,limit,fn, callback)});
          } else {
            typeof callback ==='function' && callback();
          }
        }
        runner(arr,limit,fn, callback);
      }

      function init () {

        // there would be some elements which will draw later, so check dictionary not displayed element
        elements = assign(dictionary[ Object.keys(dictionary)[ 0 ] ]);

        /*
         * only lang property exposed out side
         * */

        Object.defineProperty($this, 'lang', {
          get: function () {
            return _currentLang;
          },
          set: function (val) {
            if ( _dictionary[ val ] ) {
              _currentLang = val;
              changeLang(val);
              if ( _applyToHtml ) {
                document.documentElement.lang = val
              }
            } else {
              console.warn('You are trying to set the language dictionary doesn\'t support\n please add language pack for ' + val + ' to dictionary')
            }
          }
        });
        sliceInterval([].slice.call(document.querySelectorAll('.' + _className)), 100, initDom, documentDetect)
        //[].forEach.call(document.querySelectorAll('.' + _className), initDom);
        //documentDetect();
      }

      init();
      return $this;
    }

    return new i18n(dictionary, option)

  })