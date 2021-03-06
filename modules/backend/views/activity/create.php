<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model app\models\MemberActivity */

$this->title = 'Create Member Activity';
$this->params['breadcrumbs'][] = ['label' => 'Member Activities', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="member-activity-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
