class AdminModals {
  constructor() {
    this.init();

    this.bindModals();
  }

  init() {
    const userSettings = window.AdminModalsSettings || {};
    const settings = {
      modalActionSelector: '.admin-modal-trigger',
      dataAttribute: 'adminModals',
      adminModalPageUrl: '/site/admin-modal',
      adminModalFrameFormSelector: '.admin-modal__frame-form',
      magicParamKey: '__admin_modals',
      adminModalsUniqueParamKey: '__admin-modals__unique-id'
    };
    Object.keys(userSettings).forEach(key => {
      settings[key] = userSettings[key];
    });
    this.settings = settings;

    this.events = {};
    this.uniqueIdPrefix = Math.random().toString();
    this.uniqueIdCounter = 0;

    window.addEventListener('storage', (e) => this.receiveStorageMessage(e));
  }

  bindModals() {
    const that = this;

    $(document).on('click', this.settings.modalActionSelector, function () {
      const $this = $(this);
      const tagName = $this.prop('tagName').toLowerCase();
      const modalOpenOptions = {
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

  modalOpen(options) {
    // create modal
    const $modal = $(`
<div class="modal fade AdminModal" tabindex="-1" role="dialog" data-width="100%">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <a href="#" data-dismiss="modal" aria-hidden="true" class="pull-right">
            <i class="fa fa-times fa-2x"></i>
        </a>
        <a href="${this.combineUrl(options, 'tab')}" target="_blank" class="modal-title">
            ${options.url}
        </a>
      </div>
     
      <iframe src="${this.settings.adminModalPageUrl}" frameborder="0" class="modal-body modal-frame"></iframe>
    
      <div class="modal-footer">
        
      </div>
    </div>
  </div>
</div>`);
    $modal.find('.modal-title').click(function() {
      $modal.modal('hide');
      return true;
    });
    $modal.data('adminModalsUniqueId', ++this.uniqueIdCounter);

    $modal
      .on('shown.bs.modal', () => {
        const $frame = $modal.find('.modal-frame');
        $frame.ready(() => {
          this.loadInFrame($frame, options, $modal);
          return false;
        });
      })
      .on('hidden.bs.modal', () => {
        const uniqueId = $modal.data('adminModalsUniqueId');
        // stop listening for storage
        localStorage.removeItem(`adminModalsMessage:${uniqueId}`);
        delete this.events[uniqueId];
        // remove modal DOM element
        $modal.remove();
      });

    $modal.modal('show');
  }

  loadInFrame($frame, options, $modal) {
    $frame.off('ready');
    const frameDocument = $frame[0].contentWindow.document;

    options.data[this.settings.adminModalsUniqueParamKey] =
      `${this.uniqueIdPrefix}_${$modal.data('admin-modals-unique-id')}`;

    if (options.method === 'GET') {
      frameDocument.location = this.combineUrl(options, 'modal');
    } else {
      // it's post
      const $form = $frame.find(this.settings.adminModalFrameFormSelector);
      $form.attr('action', this.combineUrl(options.url, 'modal'));
      Object.keys(options.data).forEach((key) => {
        const value = options.data[key];
        $form.append(
          $('<input type="hidden">')
            .attr('name', key)
            .val(value)
        );
      });
      $form.submit();
    }
    this.events[$modal.data('adminModalsUniqueId')] = () => {
      AdminModals.extractFormButtons($frame, options, $modal);
      AdminModals.resizeModal($frame, options, $modal);
    };
  }

  static resizeModal($frame, options, $modal) {
    if (options.dontResizeWindow === true) {
      return;
    }
    const maxWindowWidth = options.maxWindowWidth || 95;
    const maxWindowHeight = options.maxWindowHeight || 80;
    const minWindowWidth = options.minWindowWidth || 300;
    const minWindowHeight = options.minWindowHeight || 200;

    const $frameDocument = $($frame[0].contentWindow.document);
    const parentWidthLimit = (options.windowWidthLimit || Math.floor($(window).width() * maxWindowWidth / 100)) - 60;
    const parentHeightLimit = (options.windowHeightLimit || Math.floor($(window).height() * maxWindowHeight / 100)) - 100;
    const frameWidth = Math.max($frameDocument.width() + 20, minWindowWidth);
    const frameHeight = Math.max($frameDocument.height(), minWindowHeight);
    const newWidth = frameWidth < parentWidthLimit ? frameWidth : parentWidthLimit;
    const newHeight = frameHeight < parentHeightLimit ? frameHeight : parentHeightLimit;

    $modal.find('.modal-dialog').css('display', 'table');
    $frame.width(newWidth);
    $frame.height(newHeight);
  }

  static extractFormButtons($frame, options, $modal) {
    const frameWindow = $frame[0].contentWindow;
    const f$ = frameWindow.$;
    const $buttons = f$('.form-group,.form-actions,.admin-modals__form-buttons').find('input[type=submit],button[type=submit],.btn');
    const $modalButtons = [];
    $buttons.each(function() {
      const $modalButton = $(this.outerHTML);
      $modalButton.click(() => $(this).click());
      $modalButtons.push($modalButton);
      $(this).hide();
    });

    $modal.find('.modal-footer')
      .empty()
      .append(
        $modalButtons
      );
  }

  combineUrl(options, magicParamValue = 'modal') {
    let url = options.url;
    url += url.indexOf('?') >= 0 ? '&' : '?';
    url += `${this.settings.magicParamKey}=${magicParamValue}`;

    if (options.method === 'GET') {
      // append data
      Object.keys(options.data).forEach(key => {
        const value = options.data[key];
        url += `&${key}=${value}`;
      });
    }
    return url;
  }

  receiveStorageMessage(e) {
    console.log('message: ', e);
    if (e.newValue === 'loaded' && e.key.indexOf('adminModalsMessage') === 0) {
      const parsedMessage = e.key.match(/^adminModalsMessage:([\d.]*)_([\d]*)$/);
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
}

window.AdminModals = new AdminModals();
