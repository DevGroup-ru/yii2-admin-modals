/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AdminModals = function () {
  function AdminModals() {
    _classCallCheck(this, AdminModals);

    this.init();

    this.bindModals();
  }

  _createClass(AdminModals, [{
    key: 'init',
    value: function init() {
      var _this = this;

      var userSettings = window.AdminModalsSettings || {};
      var settings = {
        modalActionSelector: '.admin-modal-trigger',
        dataAttribute: 'adminModals',
        adminModalPageUrl: '/site/admin-modal',
        adminModalFrameFormSelector: '.admin-modal__frame-form',
        magicParamKey: '__admin_modals',
        adminModalsUniqueParamKey: '__admin-modals__unique-id'
      };
      Object.keys(userSettings).forEach(function (key) {
        settings[key] = userSettings[key];
      });
      this.settings = settings;

      this.events = {};
      this.uniqueIdPrefix = Math.random().toString();
      this.uniqueIdCounter = 0;

      window.addEventListener('storage', function (e) {
        return _this.receiveStorageMessage(e);
      });
    }
  }, {
    key: 'bindModals',
    value: function bindModals() {
      var that = this;

      $(document).on('click', this.settings.modalActionSelector, function () {
        var $this = $(this);
        if ($this.attr('target') === '_blank') {
          return true;
        }
        var tagName = $this.prop('tagName').toLowerCase();
        var modalOpenOptions = {
          url: '#',
          method: 'GET',
          data: {}
        };
        switch (tagName) {
          case 'a':
            modalOpenOptions.url = $this.attr('href');
            modalOpenOptions.data = $this.data(that.settings.dataAttribute) || {};
            break;

          case 'button':
          case 'input':

            break;
          default:
            break;
        }
        that.modalOpen(modalOpenOptions);
        return false;
      });
    }
  }, {
    key: 'modalOpen',
    value: function modalOpen(options) {
      var _this2 = this;

      // create modal
      var $modal = $('\n<div class="modal fade AdminModal" tabindex="-1" role="dialog" style="display:none;" data-width="100%">   \n      <div class="modal-header">\n        <a href="#" data-dismiss="modal" aria-hidden="true" class="pull-right">\n            <i class="fa fa-times fa-2x"></i>\n        </a>\n        <a href="' + this.combineUrl(options, 'tab') + '" target="_blank" class="modal-title">\n            ' + options.url + '\n        </a>\n      </div>\n      <div class="modal-body">\n        <div class="tabs-container"></div>\n        <iframe src="' + this.settings.adminModalPageUrl + '" frameborder="0" class="modal-frame"></iframe>\n      </div>\n    \n      <div class="modal-footer">\n        \n      </div>  \n</div>');
      $modal.find('.modal-title').click(function () {
        $modal.modal('hide');
        return true;
      });
      $modal.data('adminModalsUniqueId', ++this.uniqueIdCounter);

      $modal.on('shown.bs.modal', function () {
        var $frame = $modal.find('.modal-frame');
        $frame.ready(function () {
          _this2.loadInFrame($frame, options, $modal);
          return false;
        });
      }).on('hidden.bs.modal', function () {
        var uniqueId = $modal.data('adminModalsUniqueId');
        // stop listening for storage
        localStorage.removeItem('adminModalsMessage:' + uniqueId);
        delete _this2.events[uniqueId];
        // remove modal DOM element
        $modal.remove();

        if (options.closeCallback) {
          options.closeCallback();
        } else if (_this2.settings.closeCallback) {
          _this2.settings.closeCallback();
        }
      });

      $modal.modal('show');
    }
  }, {
    key: 'loadInFrame',
    value: function loadInFrame($frame, options, $modal) {
      $frame.off('ready');
      var frameDocument = $frame[0].contentWindow.document;

      options.data[this.settings.adminModalsUniqueParamKey] = this.uniqueIdPrefix + '_' + $modal.data('admin-modals-unique-id');

      if (options.method === 'GET') {
        frameDocument.location = this.combineUrl(options, 'modal');
      } else {
        // it's post
        var $form = $frame.find(this.settings.adminModalFrameFormSelector);
        $form.attr('action', this.combineUrl(options.url, 'modal'));
        Object.keys(options.data).forEach(function (key) {
          var value = options.data[key];
          $form.append($('<input type="hidden">').attr('name', key).val(value));
        });
        $form.submit();
      }
      this.events[$modal.data('adminModalsUniqueId')] = function () {
        AdminModals.extractFormButtons($frame, options, $modal);
        AdminModals.extractTabs($frame);
        AdminModals.resizeModal($frame, options, $modal);
      };
    }
  }, {
    key: 'combineUrl',
    value: function combineUrl(options) {
      var magicParamValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'modal';

      var url = options.url;
      url += url.indexOf('?') >= 0 ? '&' : '?';
      url += this.settings.magicParamKey + '=' + magicParamValue;

      if (options.method === 'GET') {
        // append data
        Object.keys(options.data).forEach(function (key) {
          var value = options.data[key];
          url += '&' + key + '=' + value;
        });
      }
      return url;
    }
  }, {
    key: 'receiveStorageMessage',
    value: function receiveStorageMessage(e) {
      console.log('message: ', e);
      if (e.newValue === 'loaded' && e.key.indexOf('adminModalsMessage') === 0) {
        var parsedMessage = e.key.match(/^adminModalsMessage:([\d.]*)_([\d]*)$/);
        if (parsedMessage === null) {
          // not a valid key
          return;
        }
        if (parsedMessage[1] !== this.uniqueIdPrefix) {
          // not our message
          return;
        }
        localStorage.removeItem(e.key);
        // const messageId = `${parsedMessage[1]}_${parsedMessage[2]}`;
        this.events[parsedMessage[2]]();
      }
    }
  }], [{
    key: 'resizeModal',
    value: function resizeModal($frame, options, $modal) {
      if (options.dontResizeWindow === true) {
        return;
      }
      // const maxWindowWidth = options.maxWindowWidth || 95;
      var maxWindowHeight = options.maxWindowHeight || 80;
      // const minWindowWidth = options.minWindowWidth || 300;
      var minWindowHeight = options.minWindowHeight || 200;

      var $frameDocument = $($frame[0].contentWindow.document);
      // const parentWidthLimit = (options.windowWidthLimit || Math.floor($(window).width() * maxWindowWidth / 100)) - 60;
      var parentHeightLimit = (options.windowHeightLimit || Math.floor($(window).height() * maxWindowHeight / 100)) - 120;
      // const frameWidth = Math.max($frameDocument.width() + 20, minWindowWidth);
      var frameHeight = Math.max($frameDocument.height(), minWindowHeight);
      // const newWidth = frameWidth < parentWidthLimit ? frameWidth : parentWidthLimit;
      var newHeight = frameHeight < parentHeightLimit ? frameHeight : parentHeightLimit;
      var modalBody = $modal.find('.modal-body').height();
      if (newHeight < modalBody) {
        newHeight = modalBody;
      }

      $modal.find('.modal-dialog').css('display', 'table');
      // $frame.width(newWidth);
      // $frame.attr('style', `${$frame.attr('style')}; height: ${newHeight}px !important`);
    }
  }, {
    key: 'extractFormButtons',
    value: function extractFormButtons($frame, options, $modal) {
      var frameWindow = $frame[0].contentWindow;
      var f$ = frameWindow.$;
      var $row = f$('.form-actions,.admin-modals__form-buttons');
      if ($row.length) {
        var $buttons = $row.find('input[type=submit],button[type=submit],.btn');
        var $modalButtons = [];
        $buttons.each(function () {
          var _this3 = this;

          var $modalButton = $(this.outerHTML);
          $modalButton.click(function () {
            return $(_this3).click();
          });
          $modalButtons.push($modalButton);
          $(this).hide();
        });

        $modal.find('.modal-footer').empty().append($modalButtons);
      }
    }
  }, {
    key: 'extractTabs',
    value: function extractTabs($frame) {
      var frameWindow = $frame[0].contentWindow;
      var f$ = frameWindow.$;
      var $tabs = f$('.nav-tabs');
      if ($tabs.hasClass('admin-modals__dont_extract')) {
        return;
      }
      var $tabsContainer = $('.tabs-container').empty();
      if ($tabs.length) {
        var html = $tabs[0].outerHTML;
        var $newTabs = $(html);
        $newTabs.find('a').click(function () {
          var clickedHref = $(this).attr('href');
          $tabs.find('a').filter(function () {
            return $(this).attr('href') === clickedHref;
          }).click();
        });
        $tabsContainer.append($newTabs);
        $tabs.hide();
        f$('h1').remove();
      }
    }
  }]);

  return AdminModals;
}();

window.AdminModals = new AdminModals();

/***/ })
/******/ ]);
//# sourceMappingURL=app.bundle.js.map