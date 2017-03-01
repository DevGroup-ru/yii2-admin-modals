<?php

namespace DevGroup\AdminModals\behaviors;

use Yii;
use yii\base\Behavior;
use yii\base\Controller;
use yii\base\InvalidConfigException;
use yii\helpers\Json;

class AdminModalsBehavior extends Behavior
{
    public $magicParamKey = '__admin_modals';
    public $uniqueParamKey = '__admin-modals__unique-id';

    public $layoutFile;

    const MAGIC_VALUE_MODAL = 'modal';
    const MAGIC_VALUE_TAB = 'tab';

    public function attach($owner)
    {
        parent::attach($owner);

        if ($this->layoutFile === null) {
            throw new InvalidConfigException('You must specify layout file for AdminModalsBehavior');
        }

        $owner->on(Controller::EVENT_BEFORE_ACTION, function($e) {
            if ($magicValue = Yii::$app->request->get($this->magicParamKey)) {
                if ($magicValue === static::MAGIC_VALUE_MODAL) {
                    Yii::$app->controller->layout = $this->layoutFile;
                }
            }
            if ($uniqueId = Yii::$app->request->get($this->uniqueParamKey)) {
                $key = Json::encode("adminModalsMessage:$uniqueId");
                $js = <<<js
localStorage.setItem($key, 'loaded');
js;

                Yii::$app->controller->view->registerJs($js);
            }
        });
    }
}
