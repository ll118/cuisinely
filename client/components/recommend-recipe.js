import React from 'react';
import { Carousel, Preloader, Row, Col} from 'react-materialize';
import axios from 'axios';
import { Link } from 'react-router-dom';
export default class Recommended extends React.Component {

  constructor(props) {
    super(props);
    this.getPictures = this.getPictures.bind(this);
    this.state = {
      pictures: [],
      recipes: []
    };
  }
  componentDidMount() {
    this.getPictures();
  }

  getPictures() {
    axios.get('/api/recommended', { params: this.props.points })
      .then((res) => {
        console.log(res.data);
        let arr = res.data.reduce((acc, el) => {
          acc.push(el.imageUrl);
          return acc;
        }, []);
        this.setState({
          pictures: arr,
          recipes: res.data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }


  render() {
    return (
      <div>
        <h5 className="component-title" >Recommended Recipes</h5>
        { (this.state.pictures.length > 0)
          ? <Carousel className="carousel" >
            { this.state.recipes.map( item => {
              return <div className="carousel-pic">
                <Link to={'recipes/' + item.algolia}>{item.name}</Link>
                <img src={(item.imageUrl === 'none') ? '/assets/no_img.jpg' : (item.imageUrl)} />
              </div>;
            })
            }
          </Carousel>
          : <div className="text-center">
            <Preloader size='big' className="text-center"/>
          </div>
        }
      </div>
    );
  }
}
