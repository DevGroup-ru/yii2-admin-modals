<?php

namespace DevGroup\AdminModals\helpers;

use Yii;
use yii\helpers\Json;
use yii\helpers\Url;
use yii\web\JsExpression;

class JsTreeHelper
{
    public static function modalOpen($route, $method = 'GET', $attributesMapping = ['id' => 'id']) {
        $url = Json::encode(Url::to($route));

        $data = [];
        foreach ($attributesMapping as $to => $from) {
            $data[$to] = new JsExpression(
                '$(node.reference[0]).data(' .
                Json::encode($from) .
                ')'
            );
        }

        $data = Json::encode($data);

        $method = Json::encode($method);

        return new \yii\web\JsExpression(
            <<<js
function modalOpen(node) {
  AdminModals.modalOpen({
    url: $url,
    data: $data,
    method: $method,
    closeCallback: function() {
      var oldUrl =$(node.reference.context).jstree().settings.core.data.url;
      var oldUrlString = oldUrl;
      if (typeof oldUrl === "function") {
        oldUrlString = oldUrl();
      }
      $(node.reference.context).jstree().settings.core.data.url = 
        oldUrlString.replace(/_ts=\d+/, '_ts=R' + (+ new Date())); 
      $(node.reference.context).jstree().refresh();
      $(node.reference.context).jstree().settings.core.data.url = oldUrl;
    }
  });
  return false;
}
js
        );
    }
}
