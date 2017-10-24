import React from 'react';
import RecipeEntry from './recipe-entry';

export default class Bookmarks extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h2>Favorites</h2>
        <div>
          {this.props.bookmarks
            ? this.props.bookmarks.map((bookmark) => <RecipeEntry/>)
            : 'You don\'t have any bookmarked recipes!'}
        </div>
      </div>
    );
  }
}
