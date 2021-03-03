import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBindReact from 'auto-bind/react';
import { Modal, Button, FormGroup, ControlLabel } from 'react-bootstrap';
import _ from 'lodash';
import i18next from 'i18next';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { IMPORTER_SCHEDULE_SETTINGS } from '../../const';
import ImporterLanguageSelector from '../importer-language-selector';
import ImporterScheduleSelector from '../importer-schedule-selector';
import LOCALIZATION from './localization';

export default class ImporterRssForm extends Component {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      feedUrl: null,
      schedule: IMPORTER_SCHEDULE_SETTINGS.ONCE,
      languageIds: [],
      inProgress: false,
    };
  }

  async handleSaveClick() {
    const { appId, apiUrl } = this.props;
    const { feedUrl, schedule, languageIds } = this.state;

    this.setState({ inProgress: true });

    const source = {
      type: 'rss',
      parameters: {
        feed_url: feedUrl,
        api_url: apiUrl,
        nid: appId,
      },
    };

    try {
      await this.props.onSubmit(languageIds, schedule, source);
    } catch (error) {
      // do nothing
      this.setState({ inProgress: false });

      return;
    }

    this.setState({ inProgress: false });
    this.props.onClose();
  }

  handleLanguagesChanged(selectedLanguages) {
    this.setState({ languageIds: selectedLanguages });
  }

  handleFeedUrlChange(event) {
    const feedUrl = _.get(event, 'target.value');
    this.setState({ feedUrl });
  }

  render() {
    const { languages, abortTitle, confirmTitle } = this.props;
    const { feedUrl, languageIds, schedule, inProgress } = this.state;

    const hasLanguages = !_.isEmpty(languages);

    return (
      <React.Fragment>
        <Modal.Body>
          <FormGroup>
            <ControlLabel>
              {i18next.t(LOCALIZATION.FORM_FEED_TITLE)}
            </ControlLabel>
            <input
              defaultValue={feedUrl}
              value={feedUrl}
              className="form-control"
              type="text"
              onChange={this.handleFeedUrlChange}
            />
          </FormGroup>
          {hasLanguages && (
            <ImporterLanguageSelector
              languages={languages}
              onSelectionChanged={this.handleLanguagesChanged}
              selectedLanguages={languageIds}
            />
          )}
          <ImporterScheduleSelector value={schedule} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onClose}>{abortTitle}</Button>
          <Button
            bsStyle="primary"
            onClick={this.handleSaveClick}
            disabled={inProgress || !feedUrl}
          >
            <LoaderContainer isLoading={inProgress}>
              {confirmTitle}
            </LoaderContainer>
          </Button>
        </Modal.Footer>
      </React.Fragment>
    );
  }
}

ImporterRssForm.propTypes = {
  appId: PropTypes.number,
  apiUrl: PropTypes.string,
  languages: PropTypes.array,
  abortTitle: PropTypes.string,
  confirmTitle: PropTypes.string,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
};
