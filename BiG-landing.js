'use strict';
var BIG = {

 c: {}, // aqui encontram-se todos os componentes anexados a esta framework

 $: null, // componente jQuery que devemos utilizar na framework!
 $window: null, // a janela actual
 $html: null,
 $head: null,
 $body: null,
 $form: null,
 formInitialTop: null,
 formInitialHeight: null,

 enterAnimTel: false,
 enterAnimPrem: false,

 // A funÃ§Ã£o init vai Ã  procura de alguns elementos no HTML,
 // adicionar alguns handlers de eventos, e iniciar todos os
 // componentes que necessitem de inicializaÃ§Ã£o!
 init: function ($) {
  this.$ = $;
  this.$window = this.$(window);
  this.$html = this.$('html');
  this.$head = this.$html.find('head');
  this.$body = this.$html.find('body');
  this.$form = this.$body.find('.form_container');

  // percorrer todos os componentes,
  // e iniciÃ¡-los, se a funÃ§Ã£o existir
  for (var key in this.c) {
   if (this.c.hasOwnProperty(key)) {
    var obj = this.c[key];
    if (typeof obj.init === 'function') {
     // "BIG.c.COMPONENTE.init" Ã© uma funÃ§Ã£o,
     // portanto executamo-la!
     obj.init();
    }
   }
  }

  // adicionar eventos
  // e executÃ¡-los pelo menos uma vez
  this.$window.on('resize', function (e) { BIG.onResize(e); });

  this.onResize(); // deixar os componentes redimensionarem-se

  this.$window.on('scroll', function (e) {
   BIG.onScroll(e);
  });

  //Country code and flag
  $('.country-options .select-item').click(function () {
   let cc = $(this).find('.ind').text();
   let iso2 = $(this).find('.flags')[0].className.replace('flags ','');

   $('input[name=cc]').val(cc);

   let parent = $(this).parent().parent();
   let $display = parent.find('.display');
   $display.html('');

   let $node1 = $('<div class=\"flags\"></div>');
   let $node2 = $('<div class=\"ind\"></div>');

   $node1.addClass(iso2);
   $node2.text(cc);

   $display.append($node1).append($node2);
  });

  $('.dropdown').click(function(){
   $(this).toggleClass('clicked');
   $('.select-item').slideToggle('fast');
  });

  // DONE!
 },

 // A funÃ§Ã£o onResize vai buscar algumas propriedades tais como
 // tamanho actual da janela, e vai dizer aos outros componentes
 // que a janela foi redimensionada!
 width: 0,
 height: 0,
 onResize: function (e) {
  this.width = this.$window.width();
  this.height = this.$window.height();

  this.$form.removeClass('-fixed').css('top', '');
  this.formInitialTop = this.$form.offset().top;
  this.formInitialHeight = this.$form.outerHeight();
  this.formTop = '';
  this.onScroll();

  for (var key in this.c) {
   if (this.c.hasOwnProperty(key)) {
    var obj = this.c[key];
    if (typeof obj.onResize === 'function') {
     // "BIG.c.COMPONENTE.onResize" Ã© uma funÃ§Ã£o,
     // portanto executamo-la!
     obj.onResize(this.width, this.height);
    }
   }
  }
 },

 scrollTop: 0,
 formTop: '',
 onScroll: function(e) {
  var shouldBeFixed = false;
  var intendedFormTop = this.formTop;

  if (this.width < 1280) {
   shouldBeFixed = false;
   intendedFormTop = '';
  }
  else {
   var formBoundTop = this.$form.data('bound-top');
   var formBoundBottom = this.$form.data('bound-bottom');
   var bodyHeight = Math.round(this.$body.outerHeight());
   var scrollTop = this.$window.scrollTop();
   var scrollBottom = bodyHeight - (scrollTop + this.height);
   var scrollDelta = this.scrollTop - scrollTop;

   // formBottom is the distance from the form to the bottom of the screen WHILE FIXED
   var formBottom = this.height - this.formInitialHeight;

   if (scrollTop >= formBoundTop && scrollBottom >= formBoundBottom) {
    shouldBeFixed = true;

    if (formBottom < 0) {
     intendedFormTop = this.clamp((intendedFormTop || 0) + scrollDelta, formBottom, 0);
    }
   }
   else if (scrollBottom < formBoundBottom) {
    shouldBeFixed = true;

    var scrollElapsedSinceBound = formBoundBottom - scrollBottom;
    intendedFormTop = Math.min(0, formBottom - scrollElapsedSinceBound);
    if (intendedFormTop >= 0) {
     intendedFormTop = '';
    }
   }
   else {
    // it's above top bound, so reset the top
    intendedFormTop = '';
   }

   this.scrollTop = scrollTop;
  }

  this.$form.toggleClass('-fixed', shouldBeFixed).css('top', intendedFormTop);
  this.formTop = intendedFormTop;

 },

 sendPageView: function (page) {
  ga('send', 'pageview', page);
  if (console && console.log) {
   console.log('analytics sent pageview!', page);
  }
 },

 sendEvent: function (category, action, label) {
  ga('send', 'event', category, action, label);
  if (console && console.log) {
   console.log('analytics sent event!', category, action, label);
  }
 },

 clamp: function (value, min, max) {
  return Math.min(max, Math.max(min, value));
 },
 
 generateDLEventLinkClick : function(val) {
Â Â Â Â Â Â Â  window.dataLayer = window.dataLayer || [];Â 
Â Â Â Â Â Â Â  window.dataLayer.push({Â 
Â Â Â Â Â Â Â Â Â Â Â  'event' : 'gaevent_link_click',
Â Â Â Â Â Â Â Â Â Â Â  'link_click' : val,
Â Â Â Â Â Â Â Â Â Â Â  'campanha' : document.getElementById("Campaign").value
Â Â Â Â Â Â Â  })
Â Â Â  },
  
Â Â Â  generateDLEventLinks : function(val) {
Â Â Â Â Â Â Â  window.dataLayer = window.dataLayer || [];Â 
Â Â Â Â Â Â Â  window.dataLayer.push({Â 
Â Â Â Â Â Â Â Â Â Â Â  'event' : 'gaevent_footer_links',
Â Â Â Â Â Â Â Â Â Â Â  'link_click' : val,
Â Â Â Â Â Â Â Â Â Â Â  'campanha' : document.getElementById("Campaign").value
Â Â Â Â Â Â Â  })
Â Â Â  }

};

// Aqui em baixo encontra-se o cÃ³digo que inicializa a framework.
// Este cÃ³digo sÃ³ vai ser executado quando o jQuery estiver pronto!

$(function ($) {
 BIG.init($);
});





BIG.c.form = {

 $element: null,

 init: function () {
  this.$element = BIG.$body.find('.form_fields');
  this.$element.find('#submit_button').on('click', function (e) {
   return BIG.c.form.onSubmit(e);
  });
   
  this.$element.find('[name="Telephone"]').on('keydown keypress keyup', function (e) {
   var $input = $(this);
   var value = $input.val();
   if (value.length > 9) {
    $input.val(value.substring(0, 9));
   }
  });

 },

 onSubmit: function (e) {
  BIG.c.form.$element.find('.-state-error').removeClass('-state-error');
  BIG.c.form.$element.find('input').tooltip('destroy');
  var valid = BIG.c.form.isValid(this.$element);

  if (valid === true) {

   // nÃ£o houve erros, continuar
   var numRand = Math.random() + '';
   numRand = numRand * 1000000;

   numRand = numRand.toString().replace('.','');

   //desabilitar o botÃ£o apÃ³s carregar
   document.getElementById('submit_button').disabled = true;
   var eventid = md5(BIG.c.form.$element.find('input[name="Email"]').val());

   // disparar evento google analytics
   BIG.sendEvent('formulario_super deposito-afiliacao', numRand, eventid);
   BIG.sendEvent('formulario_super deposito', 'click', 'envio sucesso');

   // track code
   var x = document.createElement('img');
   x.setAttribute('src', 'https://action.metaffiliation.com/trk.php?mclic=G4BE411011&argann=' + eventid + '&altid=' + eventid + '&random=' + numRand);
   x.setAttribute('width', '1');
   x.setAttribute('height', '1');
   x.setAttribute('border', '0');
   x.setAttribute('display', 'none');
   x.setAttribute('id','imgTracker');
   document.body.appendChild(x);

   //Call submit() to make the form submit complete
   BIG.c.form.imgTrackerCheck(function() { BIG.c.form.$element.submit(); });

   return false;
  }

  // existem erros, processar
  e.preventDefault();
  e.stopPropagation();

  var campos = [];

  function changeTooltip ($element) {
   $element.attr('title', valid[key]); // mudar a mensagem de erro

   setTimeout(function () {
    $element.tooltip().tooltip('show'); // reconstruir popover
   }, 200);
  }

  // add error to fields
  var key;
  for (var key in valid) {
   if (valid.hasOwnProperty(key)) {
    campos.push(key + ':' + valid[key]);
    var $element = BIG.c.form.$element.find('input[name="' + key + '"]');
    $element.closest('.co-form-input-single').addClass('-state-error');
    //changeTooltip($element);
   }
  }

  // disparar evento google analytics
  BIG.sendEvent('formulario_super deposito erro', 'formulario erro', campos.join('; '));

  return false; // parar aqui
 },

 imgCheckerCounter: 0,
 imgCheckerCounterLimit: 20,
 imgCheckerTimeout: 100,
 imgTrackerCheck: function(callback) {

  //If the image is already loaded, callback
  if(document.getElementById('imgTracker').complete && document.getElementById('imgTracker').naturalHeight !== 0) {
   //Uncomment next line to check in the console if the image was loaded
   if(BIG.debug) { console.log('Tracker image loaded.'); }
   //Send an analytics event, indicating that there was an error loading the tracker image
   BIG.sendEvent('formulario_super deposito imagemOK', 'img', 'sucesso na imagem de tracking');
   //Callback to return after image checking is done
   callback();
  }
  else {
   //Wait for X milliseconds, before looping to check for the image
   var interval = setInterval(
    function() {
     //Counter to prevent infinite loops
     BIG.c.form.imgCheckerCounter++;

     //Prevent infinite loop :-)
     if(BIG.c.form.imgCheckerCounter < BIG.c.form.imgCheckerCounterLimit) {
      //If the image is already loaded, callback
      if(document.getElementById('imgTracker').complete && document.getElementById('imgTracker').naturalHeight !== 0) {
       //Uncomment next line to check the complete path to the image
       if(BIG.debug) { console.log(document.getElementById('imgTracker')); }
       //Uncomment next line to check in the console if the image was loaded
       if(BIG.debug) { console.log('Tracker image loaded.'); }
       //Send an analytics event, indicating that there was an error loading the tracker image
       BIG.sendEvent('formulario_super deposito pixel afiliacao OK', 'img', 'sucesso na imagem de tracking');

       //Clear the interval so the loop can stop
       clearInterval(interval);
       //Callback to return after image checking is done
       callback();
      }
     }
     else {
      //Uncomment next line to check in the console if the image was not loaded
      if(BIG.debug) { console.log('Tracker image NOT loaded.'); }
      //Send an analytics event, indicating that there was an error loading the tracker image
      BIG.sendEvent('formulario_super deposito pixel afiliacao Not OK', 'img', 'falha imagem de tracking');
      //Clear the interval so the loop can stop
      clearInterval(interval);
      //Callback to return after image checking is done
      callback();
     }
    },
    BIG.c.form.imgCheckerTimeout
   );
  }
 },

 isValid: function () {
  var name_ = BIG.c.form.$element.find('input[name="Name"]').val();
  var email_ = BIG.c.form.$element.find('input[name="Email"]').val();
  var phone_ = BIG.c.form.$element.find('input[name="Telephone"]').val();
  //var cp4_ = BIG.c.form.$element.find('input[name="PostalCode1"]').val();
  //var cp3_ = BIG.c.form.$element.find('input[name="PostalCode2"]').val();
  //var nif_ = BIG.c.form.$element.find('input[name="NIF"]').val();

  // objecto de mensagens
  var messages = {};
  
  // erros nome
  if (name_.length === 0) {
   messages['Name'] = 'Campo obrigatÃ³rio';
  }
  else if (name_.length < 5) {
   messages['Name'] = 'Nome invÃ¡lido';
  }
  var nameMatch = name_.match("[A-Za-zÃ€-Ã¿ ]+");
  if (nameMatch.input != nameMatch[0]) {
   messages['Name'] = 'Nome invÃ¡lido';
  }

  // erros telefone
  if (phone_.length === 0) {
   messages['Telephone'] = 'Campo obrigatÃ³rio';
  }
  else if (phone_.length < 9) {
   messages['Telephone'] = 'Telefone invÃ¡lido (tamanho incorreto)';
  }
  else if (!$.isNumeric(phone_)) {
   messages['Telephone'] = 'Telefone invÃ¡lido (caracteres invÃ¡lidos)';
  }
  else if (phone_[0] !== "2" && phone_[0] !== "9") {
   messages['Telephone'] = 'Telefone invÃ¡lido (primeiro caracter invÃ¡lido)';
  }
  else if (phone_ == "210000000" || phone_ == "920000000" || phone_ == "960000000" || phone_ == "910000000" || phone_ == "930000000" ) {
   messages['Telephone'] = 'Telefone invÃ¡lido (numero falso detectado)';
  }

  // erros email
  if (email_.length === 0) {
   messages['Email'] = 'Campo obrigatÃ³rio';
  }
  else if (email_.length < 5) {
   messages['Email'] = 'Email invÃ¡lido';
  }
  else if (!BIG.c.form.isValidEmail(email_)) {
   messages['Email'] = 'Email invÃ¡lido';
  }
  
  /*
  // erros codigo postal - parte 1
  if (cp4_.length === 0) {
   messages['PostalCode1'] = 'Campo obrigatÃ³rio';
  }
  else if (cp4_.length < 4) {
   messages['PostalCode1'] = 'CÃ³digo postal invÃ¡lido';
  }
  else if (!$.isNumeric(cp4_)) {
   messages['PostalCode1'] = 'CÃ³digo postal invÃ¡lido';
  }

  //erros codigo postal - parte 2
  if (cp3_.length === 0) {
   messages['PostalCode2'] = 'Campo obrigatÃ³rio';
  }
  else if (cp3_.length < 3) {
   messages['PostalCode2'] = 'CÃ³digo postal invÃ¡lido';
  }
  else if (!$.isNumeric(cp3_)) {
   messages['PostalCode2'] = 'CÃ³digo postal invÃ¡lido';
  }
  */
  
  // erros nif
  /*
  if (nif_.length === 0) {
   messages['NIF'] = 'Campo obrigatÃ³rio';
  }
  else if (nif_.length < 9) {
   messages['NIF'] = 'N.Âº de contribuinte invÃ¡lido';
  }
  else if (!$.isNumeric(nif_)) {
   messages['NIF'] = 'N.Âº de contribuinte invÃ¡lido';
  }
  */
  
  // return true se nÃ£o hÃ¡ mensagens, logo Ã© vÃ¡lido
  return !$.isEmptyObject(messages) ? messages : true;
 },

 isValidEmail: function (email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailReg.test( email );
 }

};

var inputQuantity = [];
$(function () {
 $('#telefone').each(function (i) {
  inputQuantity[i] = this.defaultValue;
  $(this).data('idx', i); // save this field's index to access later
 });
 $('#telefone').on('keyup', function (e) {
  var $field = $(this),
   val = this.value,
   $thisIndex = parseInt($field.data('idx'), 10); // retrieve the index
  //        window.console && console.log($field.is(':invalid'));
  //  $field.is(':invalid') is for Safari, it must be the last to not error in IE8
  if (this.validity && this.validity.badInput || isNaN(val) || $field.is(':invalid')) {
   this.value = inputQuantity[$thisIndex];
   return;
  }
  if (val.length > Number($field.attr('maxlength'))) {
   val = val.slice(0, 16);
   $field.val(val);
  }
  inputQuantity[$thisIndex] = val;
 });
});

$(function () {
 $('#nc').each(function (i) {
  inputQuantity[i] = this.defaultValue;
  $(this).data('idx', i); // save this field's index to access later
 });
 $('#nc').on('keyup', function (e) {
  var $field = $(this),
   val = this.value,
   $thisIndex = parseInt($field.data('idx'), 10); // retrieve the index
  //        window.console && console.log($field.is(":invalid"));
  //  $field.is(":invalid") is for Safari, it must be the last to not error in IE8
  if (this.validity && this.validity.badInput || isNaN(val) || $field.is(':invalid')) {
   this.value = inputQuantity[$thisIndex];
   return;
  }
  if (val.length > Number($field.attr('maxlength'))) {
   val = val.slice(0, 9);
   $field.val(val);
  }
  inputQuantity[$thisIndex] = val;
 });
});
//# sourceMappingURL=big-landing.js.map