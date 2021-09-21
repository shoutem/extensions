import React from 'react';
import autoBindReact from 'auto-bind/react';
import { connect } from 'react-redux';
import { CmsListScreen } from 'shoutem.cms';
import { navigateTo } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import ListPeopleView from '../components/ListPeopleView';
import { ext } from '../const';

export class PeopleListScreen extends CmsListScreen {
  static propTypes = {
    ...CmsListScreen.propTypes,
  };

  constructor(props, context) {
    super(props, context);

    autoBindReact(this);

    this.state = {
      ...this.state,
      schema: ext('People'),
    };
  }

  openDetailsScreen(person) {
    navigateTo(ext('PeopleDetailsScreen'), { person });
  }

  renderRow(person) {
    return (
      <ListPeopleView
        person={person}
        onPress={this.openDetailsScreen}
        selectedCategoryId={this.props.selectedCategory.id}
      />
    );
  }
}

export const mapStateToProps = CmsListScreen.createMapStateToProps(
  state => state[ext()].allPeople,
);

export const mapDispatchToProps = CmsListScreen.createMapDispatchToProps();

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(connectStyle(ext('PeopleListScreen'), {})(PeopleListScreen));
