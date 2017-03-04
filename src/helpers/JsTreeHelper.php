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
      var jstree = $(node.reference.context).jstree();
      var parent = jstree.get_parent(node.reference[0]);
      jstree.refresh_node(parent);
    }
  });
  return true;
}
js
        );
    }
}
