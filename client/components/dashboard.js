import React from 'react';
import RecipeEntry from './recipe-entry.js';
import Bookmarks from './bookmarks.js';
import UserStat from './user-stat.js';
import FeedMeter from './feed-meter.js';
import { connect } from 'react-redux';
import { setPoints, setLevel } from '../actions/actions.js';
import { bindActionCreators } from 'redux';
import Recommended from './recommend-recipe.js';
import PopularRecipes from './popular-recipes.js';
import axios from 'axios';
import levels from '../../db/levels';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataInfo: [],
      pointsLeft: levels.levels[this.props.level + 1].points - this.props.points,
      pointsNextLevel: levels.levels[this.props.level + 1].points
    };

    this.getDataInformation = this.getDataInformation.bind(this);
  }

  componentWillMount() {
    this.getDataInformation();
  }

  getDataInformation() {
    axios.get('/api/user-data/' + this.props.user.user_id)
      .then((res) => {
        let arr = [];
        this.props.setPoints(res.data.points);
        this.props.setLevel(res.data.level);
        let nextLevel = levels.levels[res.data.level + 1].points;
        let pointsLeft = nextLevel - res.data.points;
        res.data.pointsGraph.forEach((item) => {
          arr[item.weekDay] = item['points'];
        });
        for (var i = 0; i < 7; i++) {
          if (!arr[i]) {
            arr[i] = 0;
          }
        }

        this.setState({
          dataInfo: arr,
          pointsLeft: pointsLeft,
          pointsNextLevel: nextLevel
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const name = this.props.user.given_name || this.props.user.name.split('@')[0] || 'User';
    return (
      <div className="container">
        <div className="row" align="center">
          <br />
          <h5 className="dashboard"><strong>Welcome {name}! Ready to cook?</strong></h5>
        </div>
        <div className="row">
          <PopularRecipes />
        </div>
        { (this.state.dataInfo.length > 0)
          ? <div>
            <div className="row" align="center">
              <span className="feedmeter"><strong>Points Until Next Level: {this.state.pointsLeft} pts!</strong></span>
              <FeedMeter points={this.props.points} pointsNextLevel={this.state.pointsNextLevel}/>
            </div>
            <div className="row">
              <div className="col s12 m12 l6">
                <UserStat data={this.state.dataInfo}/>
              </div>
              <div className="col s12 m12 l6">
                <Bookmarks userId={this.props.user.user_id} />
              </div>
            </div>
            <div className="row">
              <Recommended id={this.props.user.user_id}/>
            </div>
          </div>
          : <div> Loading ...</div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    points: state.points,
    level: state.level
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ setPoints, setLevel }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
