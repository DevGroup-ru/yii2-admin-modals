<?php

namespace DevGroup\AdminModals;

use DevGroup\AdminModals\components\AdminModals;
use Yii;
use yii\base\Application;
use yii\base\BootstrapInterface;


class ExtensionBootstrap implements BootstrapInterface
{

    /**
     * Bootstrap method to be called during application bootstrap stage.
     *
     * @param Application $app the application currently running
     */
    public function bootstrap($app)
    {
        if ($app instanceof \yii\web\Application === false) {
            return;
        }

        if (array_key_exists('adminModals', $app->components) === false) {
            $app->set('adminModals', [
                'class' => 'DevGroup\AdminModals\components\AdminModals',
            ]);
        }
        $app->on(Application::EVENT_BEFORE_ACTION, function() {
            /** @var AdminModals $adminModals */
            $adminModals = Yii::$app->get('adminModals');
            $adminModals->runAdminModals();
        });
    }
}
