<?php

namespace DevGroup\AdminModals\helpers;

use Yii;
use yii\helpers\Json;
use yii\helpers\Url;

class JsTreeHelper
{
    public static function modalOpen($route, $method = 'GET', $useId = true) {
        $url = Json::encode(Url::to($route));

        $useId = $useId
            ? 'id: $(node.reference[0]).data(\'id\')'
            : '';

        $method = Json::encode($method);

        return new \yii\web\JsExpression(
            <<<js
function modalOpen(node) {
  AdminModals.modalOpen({
    url: $url,
    data: {
      $useId
    },
    method: $method
  });
  return true;
}
js
        );
    }
}
