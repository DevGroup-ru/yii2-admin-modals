<?php

namespace DevGroup\AdminModals\assets;

use Yii;
use yii\bootstrap\BootstrapPluginAsset;
use yii\web\AssetBundle;

class BootstrapModalAsset extends AssetBundle
{
    /**
     * @var string
     */
    public $sourcePath = '@DevGroup/AdminModals/assets/bootstrap-modal/';
    /**
     * @var array
     */
    public $css = [
        'css/bootstrap-modal-bs3patch.css',
        'css/bootstrap-modal.css',
    ];
    /**
     * @var array
     */
    public $js = [
        'js/bootstrap-modalmanager.js',
        'js/bootstrap-modal.js'
    ];
    /**
     * @var array
     */
    public $depends = [
        BootstrapPluginAsset::class
    ];
}
