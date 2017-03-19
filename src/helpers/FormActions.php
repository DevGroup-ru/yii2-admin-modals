<?php

namespace DevGroup\AdminModals\helpers;

use DevGroup\AdminModals\components\AdminModals;
use Yii;
use yii\bootstrap\Html;
use yii\web\Controller;

class FormActions
{
    const ACTION_SAVE = 'save';
    const ACTION_SAVE_AND_NEW = 'save-and-new';
    const ACTION_SAVE_AND_BACK = 'save-and-back';

    public static function save()
    {
        return Html::submitButton(
            '<i class="fa fa-floppy-o"></i> ' . Yii::t('app', 'Save'),
            [
                'class' => 'btn btn-primary form-action__save',
                'name' => 'form-action',
                'value' => static::ACTION_SAVE,
            ]
        );
    }

    public static function saveAndNew()
    {
        return Html::submitButton(
            '<i class="fa fa-floppy-o"></i> ' . Yii::t('app', 'Save & New'),
            [
                'class' => 'btn btn-success form-action__save-and-new',
                'name' => 'form-action',
                'value' => static::ACTION_SAVE_AND_NEW,
            ]
        );
    }

    public static function saveAndBack()
    {
        return Html::submitButton(
            '<i class="fa fa-floppy-o"></i> ' . Yii::t('app', 'Save & Back'),
            [
                'class' => 'btn btn-warning form-action__save-and-back',
                'name' => 'form-action',
                'value' => static::ACTION_SAVE_AND_BACK,
            ]
        );
    }

    public static function handleSaveAction(
        Controller $controller,
        $newRoute = ['edit'],
        $backRoute = ['index']
    )
    {
        $action = Yii::$app->request->post('action', static::ACTION_SAVE);
        switch ($action) {
            case static::ACTION_SAVE_AND_NEW:
                $url = $newRoute;
                break;
            case static::ACTION_SAVE_AND_BACK:
                /** @var AdminModals $adminModals */
                $adminModals = Yii::$app->get('adminModals');
                if ($adminModals->uniqueId) {
                    // @todo Add storage event for closing window here
                    return '';
                } else {
                    $url = $backRoute;
                }
                break;
            case static::ACTION_SAVE:
            default:
                $url = Yii::$app->request->getUrl();
                break;
        }
        return $controller->redirect($url);
    }
}
