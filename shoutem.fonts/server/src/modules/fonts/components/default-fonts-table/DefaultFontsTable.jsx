import React, { PureComponent } from 'react';
import autoBindReact from 'auto-bind/react';
import i18next from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  EditableTable,
  FontIcon,
  FontIconPopover,
  LoaderContainer,
  Switch,
} from '@shoutem/react-web-ui';
import LOCALIZATION from './localization';
import './style.scss';

export default class DefaultFontsTable extends PureComponent {
  constructor(props) {
    super(props);
    autoBindReact(this);

    this.state = {
      inProgress: false,
    };
  }

  getTableHeader() {
    return [i18next.t(LOCALIZATION.NAME), i18next.t(LOCALIZATION.INCLUDE)];
  }

  getRowDescriptors() {
    const nameDescriptor = {
      property: 'name',
      isRequired: true,
    };

    const toggleDescriptor = {
      getDisplayValue: this.renderToggleValue,
      isRequired: false,
    };

    return [nameDescriptor, toggleDescriptor];
  }

  handleToggleFont(item) {
    const { excludedFonts, onToggleClick } = this.props;
    const value = _.includes(excludedFonts, item.id);

    return onToggleClick(item.id, !value);
  }

  renderToggleValue(item) {
    const { excludedFonts } = this.props;
    const value = _.includes(excludedFonts, item.id);

    return (
      <Switch onChange={() => this.handleToggleFont(item)} value={!value} />
    );
  }

  render() {
    const { fonts } = this.props;
    const { inProgress } = this.state;

    return (
      <div className="default-fonts-table">
        <div className="fonts-table__title">
          <h3>{i18next.t(LOCALIZATION.DEFAULT_FONTS)}</h3>
          <FontIconPopover
            message={i18next.t(LOCALIZATION.DEFAULT_FONTS_DISCLAIMER)}
          >
            <FontIcon
              className="default-fonts__icon-popover"
              name="info"
              size="24px"
            />
          </FontIconPopover>
        </div>
        <LoaderContainer isLoading={inProgress} isOverlay>
          <EditableTable
            isStatic
            className="fonts-table"
            rows={fonts}
            canUpdate={false}
            canDelete={false}
            headers={this.getTableHeader()}
            rowDescriptors={this.getRowDescriptors()}
          />
        </LoaderContainer>
      </div>
    );
  }
}

DefaultFontsTable.propTypes = {
  excludedFonts: PropTypes.array.isRequired,
  fonts: PropTypes.array.isRequired,
  onToggleClick: PropTypes.func.isRequired,
};
