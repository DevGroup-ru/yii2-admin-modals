<?php

namespace DevGroup\AdminModals\assets;

use yii\bootstrap\BootstrapPluginAsset;
use yii\web\AssetBundle;

class AdminModalsBundle extends AssetBundle
{
    public $depends = [
        BootstrapPluginAsset::class,
    ];

    public function init()
    {
        $this->sourcePath = __DIR__ . '/dist/';

        $this->js = [
            YII_ENV_DEV ? 'app.bundle.js' : 'app.bundle.min.js'
        ];

        parent::init();
    }
}
