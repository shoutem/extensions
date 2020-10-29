import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import {
  Button,
  ButtonToolbar,
  FormGroup,
  ControlLabel,
} from 'react-bootstrap';
import { Radio } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default class FeedSelector extends Component {
  constructor(props) {
    super(props);
    this.onFeedChange = this.onFeedChange.bind(this);
    this.onAddClick = this.onAddClick.bind(this);

    this.state = { feed: null };
  }

  onFeedChange(event) {
    this.setState({
      feed: event.target.value,
    });
  }

  onAddClick() {
    this.props.onAddClick(this.state.feed);
  }

  render() {
    const { discoveredFeeds, onCancelClick } = this.props;

    return (
      <div>
        <form>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.CHOOSE_FROM_FEEDS)}
            </ControlLabel>
            <table className="table feed-selector__table">
              <tbody>
                {discoveredFeeds.map(feed => (
                  <tr key={feed.url}>
                    <td>
                      <Radio
                        name="disovered-feed"
                        value={feed.url}
                        onClick={this.onFeedChange}
                      >
                        {feed.url}
                      </Radio>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FormGroup>
        </form>
        <ButtonToolbar>
          <Button
            bsStyle="primary"
            disabled={!this.state.feed}
            onClick={this.onAddClick}
          >
            {i18next.t(LOCALIZATION.ADD_FEED)}
          </Button>
          <Button bsStyle="default" onClick={onCancelClick}>
            {i18next.t(LOCALIZATION.CANCEL_BUTTON)}
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

FeedSelector.propTypes = {
  discoveredFeeds: PropTypes.array,
  onAddClick: PropTypes.func,
  onCancelClick: PropTypes.func,
};
