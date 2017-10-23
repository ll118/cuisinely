import React from 'react';
import axios from 'axios';
import { Input, Row, Button, Icon, Card } from 'react-materialize';
import { Redirect } from 'react-router-dom';

class SubmitRecipe extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      name: '',
      time: '',
      description: '',
      difficulty: '',
      ingredients: [],
      ingName: '',
      ingQuantity: '',
      equipment: [],
      equipName: '',
      equipQuantity: '',
      instructions: [],
      imageUrl: ''
    };

    this.handleSubmitRecipe = this.handleSubmitRecipe.bind(this);
    this.handleRecipeName = this.handleRecipeName.bind(this);
    this.handleRecipeTime = this.handleRecipeTime.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.addIngredient = this.addIngredient.bind(this);
    this.handleIngName = this.handleIngName.bind(this);
    this.handleIngQuantity = this.handleIngQuantity.bind(this);
    this.removeIngredient = this.removeIngredient.bind(this);
    this.addEquipment = this.addEquipment.bind(this);
    this.handleEquipName = this.handleEquipName.bind(this);
    this.handleEquipQuantity = this.handleEquipQuantity.bind(this);
    this.removeEquipment = this.removeEquipment.bind(this);
    this.handleInstructions = this.handleInstructions.bind(this);
  }

  handleSubmitRecipe(e) {
    e.preventDefault();
    console.log('submit recipe!');
    let recipe = {};
    recipe.name = this.state.name;
    recipe.time = this.state.time;
    recipe.description = this.state.description;
    recipe.ingredients = this.state.ingredients;
    recipe.equipment = this.state.equipment;
    recipe.imageUrl = this.state.imageUrl;
    recipe.userId = '12345';
    recipe.difficulty = 'Easy';
    recipe.rating = 0;

    let instructions = this.state.instructions;

    recipe.instructions = instructions.split('\n');

    axios.post('/api/recipes', recipe)
      .then((res) => {
        this.setState({ redirect: true });
      })
      .catch((err) => {
        console.log('error: ', err);
      });
  }

  handleRecipeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  handleRecipeTime(e) {
    this.setState({
      time: e.target.value
    });
  }

  handleDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  addIngredient(e) {
    e.preventDefault();
    let currIngredients = this.state.ingredients;
    currIngredients.push({
      name: this.state.ingName || 'N/A',
      quantity: this.state.ingQuantity || 'N/A'
    });
    this.setState({
      ingredients: currIngredients,
      ingName: '',
      ingQuantity: ''
    });

  }

  removeIngredient(e) {
    let currIngredients = this.state.ingredients;
    currIngredients.forEach((item, i) => {
      if (item.name === e.target.id) {
        currIngredients.splice(i, 1);
        return;
      }
    });

    this.setState({
      ingredients: currIngredients
    });
  }

  handleIngName(e) {
    this.setState({
      ingName: e.target.value
    });
  }

  handleIngQuantity(e) {
    this.setState({
      ingQuantity: e.target.value
    });
  }

  addEquipment(e) {
    e.preventDefault();
    let currEquipment = this.state.equipment;
    currEquipment.push({
      name: this.state.equipName || 'N/A',
      quantity: this.state.equipQuantity || 'N/A'
    });
    this.setState({
      equipment: currEquipment,
      equipName: '',
      equipQuantity: ''
    });

  }

  handleEquipName(e) {
    this.setState({
      equipName: e.target.value
    });
  }

  handleEquipQuantity(e) {
    this.setState({
      equipQuantity: e.target.value
    });
  }

  removeEquipment(e) {
    let currEquipment = this.state.equipment;
    currEquipment.forEach((equip, i) => {
      if (equip.name === e.target.id) {
        currEquipment.splice(i, 1);
        return;
      }
    });

    this.setState({
      equipment: currEquipment
    });
  }

  handleInstructions(e) {
    this.setState({
      instructions: e.target.value
    });
  }

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to="/recipes" />;
    }

    return (
      <div className="container">
        <h4 className="component-title">Submit a Recipe!</h4>
        <Row>
          <form s={12}>
            <div className="col s12">
              <h5><strong>Recipe Information:</strong></h5>
              <Input s={7} label="Name" type="text" onChange={this.handleRecipeName}/>
              <Input s={3} label="Minutes" type="number" onChange={this.handleRecipeTime}/>
              <Input s={10} label="Short Description" type="text" onChange={this.handleDescription}/>
            </div>
            <div className="col s12 m6">
              <h5><strong>Ingredients:</strong></h5>
              <div id="ingredients-list">
                <table className="col s12">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Item Quantity</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (this.state.ingredients.length !== 0)
                        ? (this.state.ingredients.map(item => (
                          <tr className="ingredients"
                            key={item.name}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td><a id={item.name} onClick={this.removeIngredient}>Remove</a></td>
                          </tr> )))
                        : (null)
                    }
                  </tbody>
                </table>
              </div>
              <div className="valign-wrapper col s12" align="center">
                <Input s={5} label="Name" type="text" onChange={this.handleIngName} value={this.state.ingName}/>
                <Input s={5} label="Number/Unit" type="text" onChange={this.handleIngQuantity} value={this.state.ingQuantity}/>
                <a className="waves-effect waves-light btn" onClick={this.addIngredient}>Add</a>
              </div>
            </div>
            <div className="col s12 m6">
              <h5><strong>Equipment:</strong></h5>
              <div id="equipment-list">
                <table className="col s12">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Item Quantity</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (this.state.equipment.length !== 0)
                        ? (this.state.equipment.map(equip => (
                          <tr className="equipment"
                            key={equip.name}>
                            <td>{equip.name}</td>
                            <td>{equip.quantity}</td>
                            <td><a id={equip.name} onClick={this.removeEquipment}>Remove</a></td>
                          </tr> )))
                        : (null)
                    }
                  </tbody>
                </table>
              </div>
              <div className="valign-wrapper col s12" align="center">
                <Input s={5} label="Name" type="text" onChange={this.handleEquipName} value={this.state.equipName}/>
                <Input s={5} label="Number" type="text" onChange={this.handleEquipQuantity} value={this.state.equipQuantity}/>
                <a className="waves-effect waves-light btn" onClick={this.addEquipment}>Add</a>
              </div>
            </div>
            <div className="col s12">
              <h5><strong>Instructions:</strong></h5>
              <Input s={12} type="textarea" label="Put each step on its own line" onChange={this.handleInstructions}/>
            </div>
            <div className="col s12">
              <h5><strong>Add a Photo:</strong></h5>
            </div>
            <div className="file-field input-field col s10">
              <div className="btn">
                <span>File</span>
                <input type="file" />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" placeholder="Add a photo"/>
              </div>
            </div>
            <div className="col s12" align="center">
              <a className="waves-effect waves-light btn" onClick={this.handleSubmitRecipe}>Submit Recipe!</a>
            </div>
          </form>
        </Row>
      </div>
    );
  }
}

export default SubmitRecipe;
