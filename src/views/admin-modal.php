<?php

/** @var \yii\web\View $this */
use yii\widgets\ActiveForm;

?>
<div class="loading">
    <div class="loading__3">
        <p>Loading</p>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
    </div>
</div>

<?php
$form = ActiveForm::begin([
    'action' => '#REPLACE_ME#',
    'method' => 'post',
    'enableClientScript' => false,
    'enableClientValidation' => false,
    'options' => [
        'class' => 'admin-modal__frame-form',
    ],
]);

ActiveForm::end();