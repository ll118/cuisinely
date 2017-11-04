import React from 'react';
import axios from 'axios';
import RecipeEntry from './recipe-entry.js';
import MiniRecipe from './recipe-mini.js';
import ShoppingList from './shopping-list.js';
import { Card, CardTitle, Row, Col, Button, Icon } from 'react-materialize';
import { Link, Route } from 'react-router-dom';
import moment from 'moment';
import { setList, setMealPlan } from '../actions/actions.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };

    this.getRandomRecipes = this.getRandomRecipes.bind(this);
    this.getPlannedRecipes = this.getPlannedRecipes.bind(this);
    this.saveMealPlan = this.saveMealPlan.bind(this);
    this.makeShoppingList = this.makeShoppingList.bind(this);
  }

  componentDidMount() {
    if (this.props.mealPlan.length) {
      this.makeShoppingList(this.props.mealPlan);
    } else {
      this.getPlannedRecipes();
    }
  }

  getPlannedRecipes() {
    let userId = this.props.user.user_id;
    return axios.get('/api/mealPlan', {
      params: {userId: userId}
    })
      .then((response) => {
        if (response.data.recipes) {
          this.props.setMealPlan(response.data.recipes);
          this.makeShoppingList(response.data.recipes);
        }
      });
  }

  getRandomRecipes() {
    axios.get('/api/calendarRecipes')
      .then((response) => {
        let listOfFive = response.data.slice(0, 5);
        this.props.setMealPlan(listOfFive);
      });
  }

  saveMealPlan() {
    let mealPlan = {};
    let datedRecipes = this.props.mealPlan.slice();
    datedRecipes.forEach((recipe, index) => {
      if (recipe.date === undefined ) {
        recipe.date = moment().add(index, 'days').format('ddd L');
      }
    });
    mealPlan.recipes = datedRecipes;
    mealPlan.startDate = moment().format('dddd L');
    mealPlan.endDate = moment().add(4, 'days').format('dddd L');
    mealPlan.userId = this.props.user.user_id;

    axios.post('/api/mealPlan', mealPlan)
      .then((res) => {
        console.log('Meals saved!');
      })
      .catch((err) => {
        console.error(err);
      });
  }

  makeShoppingList(recipes) {
    let list = {};
    let formattedList = [];
    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if (ingredient.name.includes('water')) {
          //in this block we can exclude ingredients you don't need to buy at the store i.e. water
          console.log('Not going to include this.');
        } else if (list[ingredient.name]) {
          let splitIngredient = ingredient.quantity.split(' ');
          let quantityList = list[ingredient.name].split(', ');
          let isNumber = false;
          let isFraction = false;
          let quantityVal;
          if (Number(splitIngredient[0])) {
            quantityVal = Number(splitIngredient[0]);
          } else if (splitIngredient[0].split('/').length === 2) {
            let fraction = splitIngredient[0].split('/');
            quantityVal = Number(fraction[0]) / Number(fraction[1]);
          }
          for (var i = 0; i < quantityList.length; i ++) {
            let currentQuantity = quantityList[i].split(' ');
            if (currentQuantity.slice(1).join(' ') === splitIngredient.slice(1).join(' ')) {
              if (Number(currentQuantity[0])) {
                let currentNumber = Number(currentQuantity[0]);
                currentQuantity[0] = (currentNumber + quantityVal).toString();
                quantityList[i] = currentQuantity.join(' ');
                break;
              } else if (currentQuantity[0].split('/').length === 2) {
                let currentFraction = currentQuantity[0].split('/');
                let currentQuantityVal = Number(currentFraction[0]) / Number(currentFraction[1]);
                currentQuantity[0] = (currentQuantityVal + quantityVal).toString();
                quantityList[i] = currentQuantity.join(' ');
                break;
              }
            }
          }
          list[ingredient.name] = quantityList.join(', ');
        } else {
          list[ingredient.name] = ingredient.quantity;
        }
      });
    });

    for (var key in list) {
      let entry = {};
      entry.name = key;
      entry.quantity = list[key];
      formattedList.push(entry);
    }
    this.props.setList(formattedList);
  }

  render() {
    return (
      <div align="center">
        <h5 className="component-title">My Calendar</h5>
        <Row>
          <Col s={0} m={0} l={1} />
          {this.props.mealPlan.length ? this.props.mealPlan.map(((recipe, index) => {
            return (
              <Col s={12} m={5} l={2} key={recipe.algolia}>
                <Card style={{minWidth: '200px'}}
                  className='large hoverable'
                  header={<div className={recipe.date === moment().format('ddd L') ? 'calendar-today' : 'calendar-date'}>
                    {recipe.date ? recipe.date : moment().add(index, 'days').format('ddd L')}</div>} >
                  <MiniRecipe recipe={recipe} key={recipe.algolia} save={this.saveMealPlan}/>
                </Card>
              </Col>
            );
          })) : 'No Meals Planned!'}
          <Col s={0} m={0} l={1} />
        </Row>
        <Button style={{'marginRight': '5px'}} waves='light' className='red lighten-3' onClick={this.saveMealPlan}>Save<Icon left>save</Icon></Button>
        <Button style={{'marginLeft': '5px'}} waves='light' className='red lighten-3' onClick={this.getRandomRecipes}>Auto 5-Day Meal Plan<Icon left>cloud</Icon></Button>
        <div style={{'marginTop': '10px'}}>
          <Link to='/shoppinglist'>
            <Button waves='light' className='red lighten-3'>Weekly Shopping List<Icon left>shopping_cart</Icon></Button>
          </Link>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ingredients: state.shoppingList,
    mealPlan: state.mealPlan,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setList, setMealPlan }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
