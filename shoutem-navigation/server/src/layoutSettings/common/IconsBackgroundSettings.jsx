import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Row, Col, FormGroup } from 'react-bootstrap';
import { Switch } from '@shoutem/se-ui-kit';
import form from '../common/form';
import ShortcutsList from '../../components/ShortcutsList';
import ShortcutBackgroundListItem from '../../components/ShortcutBackgroundListItem';

export class IconsBackgroundSettings extends React.Component {
  constructor(props) {
    super(props);
    this.saveForm = this.saveForm.bind(this);

    props.onFieldChange(this.saveForm);
  }

  saveForm() {
    const newSettings = this.props.form.toObject();
    this.props.onSettingsChanged(newSettings);
  }

  render() {
    const { fields, shortcuts, onIconChanged, normalIconUrl } = this.props;
    const { backgroundImagesEnabled } = fields;

    return (
      <div>
        <form>
          <Row>
            <Col md={8}>
              <h3>Item background settings</h3>
            </Col>
            <Col md={4}>
              <div className="icon-backgrounds__switch">
                <Switch {...backgroundImagesEnabled} />
              </div>
            </Col>
          </Row>
          {backgroundImagesEnabled.value &&
            <Row>
              <Col md={12}>
                <FormGroup>
                  <ShortcutsList
                    className="shortcut-icon__double"
                    shortcuts={shortcuts}
                    headerTitles={['Icon backgrounds', 'Normal']}
                    getListItem={(shortcut) => (
                      <ShortcutBackgroundListItem
                        title={shortcut.title}
                        shortcutType={shortcut.shortcutType}
                        normalIconUrl={_.get(shortcut, normalIconUrl)}
                        shortcutId={shortcut.id}
                        onIconSelected={onIconChanged}
                      />
                    )}
                  />
                </FormGroup>
              </Col>
            </Row>
          }
        </form>
      </div>
    );
  }
}

IconsBackgroundSettings.propTypes = {
  settings: PropTypes.object.isRequired,
  onIconChanged: PropTypes.func.isRequired,
  onSettingsChanged: PropTypes.func.isRequired,
};

export default form((props) => {
  const { settings } = props;
  return {
    fields: ['backgroundImagesEnabled'],
    defaultValues: {
      backgroundImagesEnabled: settings.backgroundImagesEnabled,
    },
    validation: {},
  };
})(IconsBackgroundSettings);
