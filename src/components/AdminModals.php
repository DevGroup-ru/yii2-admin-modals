<?php

namespace DevGroup\AdminModals\components;

use Yii;
use yii\base\Component;
use yii\base\Event;
use yii\helpers\Json;
use yii\widgets\ActiveForm;

class AdminModals extends Component
{
    public $magicParamKey = '__admin_modals';
    public $uniqueParamKey = '__admin-modals__unique-id';

    /**
     * @var string|null  The path to simplified layout file without your headers, footers, containers etc.
     *                   This layout is used when your action is rendered inside modal's frame.
     */
    public $layoutFile;

    const MAGIC_VALUE_MODAL = 'modal';
    const MAGIC_VALUE_TAB = 'tab';

    /**
     * @var string The value of magic param describing the type of child window opening(modal or new tab/window).
     */
    public $magicParamValue;

    /** @var string|null Unique ID for communicating with parent window. */
    public $uniqueId;
    /** @var string Json encoded key for local storage(used for communicating with parent window) */
    public $localStorageKeyJson;

    /**
     * @var array Classnames of form classes for rewriting action param(All form classes that are used in your app).
     */
    public $formClasses = [
        'yii\widgets\ActiveForm',
        'DevGroup\Metronic\widgets\ActiveForm',
        'yii\bootstrap\ActiveForm',
    ];

    /**
     * Runs check for admin modals magic params and runs binding to events if needed.
     */
    public function runAdminModals()
    {
        $this->findMagicParams();
        if ($this->uniqueId !== null) {
            $this->bindModifiers();
        }
    }

    /**
     * Finds magic params
     */
    public function findMagicParams()
    {
        if ($this->magicParamValue = Yii::$app->request->get($this->magicParamKey)) {
            if ($this->magicParamValue === static::MAGIC_VALUE_MODAL) {
                Yii::$app->controller->layout = $this->layoutFile;
            }
        }

        if ($this->uniqueId = Yii::$app->request->get($this->uniqueParamKey)) {
            $this->localStorageKeyJson = Json::encode("adminModalsMessage:{$this->uniqueId}");
            $js = <<<js
localStorage.setItem({$this->localStorageKeyJson}, 'loaded');
js;

            Yii::$app->controller->view->registerJs($js);
        }
    }

    /**
     * Binds to events for rewriting URLs of forms, links, etc.
     * It is needed for keeping frame in sync with parent window - all pages inside it MUST have needed magic params
     * for receiving callbacks by parent window.
     */
    public function bindModifiers()
    {
        foreach ($this->formClasses as $class) {
            Event::on($class, ActiveForm::EVENT_BEFORE_RUN, [$this, 'formActionModifier']);
        }

        //! @todo add Links modifier JS - append magicParam and uniqueId to all links on DOM ready
    }

    /**
     * Modifies the action param of all forms to have needed magic params
     * @param $event
     */
    public function formActionModifier($event)
    {
        /** @var ActiveForm $form */
        $form = $event->sender;
        if ($form->action === '') {
            // browsers wil send request to the same URL, which already have everything needed
            return;
        } elseif (is_array($form->action)) {
            if ($this->magicParamValue !== null) {
                $form->action[$this->magicParamKey] = $this->magicParamValue;
            }
            $form->action[$this->uniqueParamKey] = $this->uniqueId;
        } else {
            if (strpos($form->action, '?') === false) {
                $form->action .= '?';
            }
            if ($this->magicParamValue !== null) {
                $form->action .= "&{$this->magicParamKey}={$this->magicParamValue}";
            }
            $form->action .= "&{$this->uniqueParamKey}={$this->uniqueId}";
        }
    }
}
