import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonToolbar,
  FormGroup,
  ControlLabel,
} from 'react-bootstrap';
import { Radio } from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default class FeedSelector extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = { feed: null };
  }

  onFeedChange(event) {
    this.setState({
      feed: event.target.value,
    });
  }

  onAddClick() {
    const { onAddClick } = this.props;
    const { feed } = this.state;

    onAddClick(feed);
  }

  render() {
    const { discoveredFeeds, onCancelClick } = this.props;
    const { feed } = this.state;

    return (
      <div>
        <form>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_AVAILABLE_FEEDS)}
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
          <Button bsStyle="primary" disabled={!feed} onClick={this.onAddClick}>
            {i18next.t(LOCALIZATION.BUTTON_ADD_FEED)}
          </Button>
          <Button bsStyle="default" onClick={onCancelClick}>
            {i18next.t(LOCALIZATION.BUTTON_CANCEL)}
          </Button>
        </ButtonToolbar>
      </div>
    );
  }
}

FeedSelector.propTypes = {
  discoveredFeeds: PropTypes.array.isRequired,
  onAddClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
};
