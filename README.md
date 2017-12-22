# i18n

Demo: <https://kellywoo.github.io/i18n/>

## init

``` javascript
var setLanguage = i18n({ en: {...}, ko: {...} }, {
        init: 'ko', // key name of language to initiate
        applyHtmlLang: true, // applying language key name to HTML lang attribute
        useCurly: true, // if use curly for expression or not;
        useInnerHTML: 'data-html', // with attribute expression, it's the key to distinguish innerHTML and textContent
        langKey: 'data-key', // with attribute expression it is used to show the key of language to use  
        className: 'i18n' // flag class of target elements, searching for elements which contain this className to get change text
      });
      
      setLangage.lang = 'en'
```

## how to use

``` javascript
<!--textContent-->
<li><span class="i18n">{{pf1}}</span></li>
<!--innerHTML-->
<li><span class="i18n">{({pf1})}</span></li> //innerHTML

or
<!--textContent-->
<li><span class="i18n" data-key="key"></span></li>
<!--innerHTML-->
<li><span class="i18n" data-key="key" data-html></span></li>
<!-- data attribute can be set when initiating -->
```

## how to add dictionary
```
setLanguage.addDictionary({ en: { title: 'vanillaI18n(Egnlish)' }, ko: { title: 'vanillaI18n(한국어)' } });

```


## License

MIT © [kelly.kh.woo@gmail.com]()
