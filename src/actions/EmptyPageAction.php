<?php

namespace DevGroup\AdminModals\actions;

use yii\base\Action;

class EmptyPageAction extends Action
{
    public $viewFile = '@DevGroup/AdminModals/views/admin-modal';

    public $layoutFile;

    public function run()
    {
        if ($this->layoutFile !== null) {
            $this->controller->layout = $this->layoutFile;
        }

        return $this->controller->render($this->viewFile);
    }
}
