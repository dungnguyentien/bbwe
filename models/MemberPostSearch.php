<?php

namespace app\models;

use yii\base\Model;
use yii\data\ActiveDataProvider;
use app\models\MemberPost;

/**
 * MemberPostSearch represents the model behind the search form of `app\models\MemberPost`.
 */
class MemberPostSearch extends MemberPost
{
    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['id', 'idmember'], 'integer'],
            [['title', 'tag', 'cover_picture', 'description', 'datetime'], 'safe'],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function scenarios()
    {
        // bypass scenarios() implementation in the parent class
        return Model::scenarios();
    }

    /**
     * Creates data provider instance with search query applied
     *
     * @param array $params
     *
     * @return ActiveDataProvider
     */
    public function search($params)
    {
        $query = MemberPost::find();

        // add conditions that should always apply here

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
        ]);

        $this->load($params);

        if (!$this->validate()) {
            // uncomment the following line if you do not want to return any records when validation fails
            // $query->where('0=1');
            return $dataProvider;
        }

        // grid filtering conditions
        $query->andFilterWhere([
            'id' => $this->id,
            'idmember' => $this->idmember,
            'datetime' => $this->datetime,
        ]);

        $query->andFilterWhere(['like', 'title', $this->title])
            ->andFilterWhere(['like', 'tag', $this->tag])
            ->andFilterWhere(['like', 'cover_picture', $this->cover_picture])
            ->andFilterWhere(['like', 'description', $this->description]);

        return $dataProvider;
    }
}
