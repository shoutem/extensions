import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import i18next from 'i18next';
import { Table } from 'react-bootstrap';
import { isBusy } from '@shoutem/redux-io';
import { LoaderContainer } from '@shoutem/react-web-ui';
import { getArrayDisplayLabel } from '../../services';
import LOCALIZATION from './localization';
import './style.scss';

function getCategoryName(resource) {
  const categories = _.filter(resource.categories, { autoCreated: false });
  const categoryNames = _.map(categories, 'name');

  return getArrayDisplayLabel(categoryNames);
}

function getLanguageName(resource, languages) {
  const channels = _.get(resource, 'channels');
  const languageNames = _.compact(
    _.map(channels, channel => {
      const language = _.find(languages, language => {
        // eslint-disable-next-line eqeqeq
        return language.id == _.get(channel, 'id');
      });

      return _.get(language, 'name');
    }),
  );

  return getArrayDisplayLabel(languageNames);
}

export default function ContentPreview({
  resources,
  languages,
  titleProp,
  hasContent,
  hasLanguages,
}) {
  return (
    <div className="content-preview">
      {hasContent && <span className="content-preview__overlay" />}
      <LoaderContainer isLoading={isBusy(resources)} isOverlay>
        <Table className="content-preview__table">
          <thead>
            <tr>
              <th>{i18next.t(LOCALIZATION.HEADER_TITLE)}</th>
              {hasLanguages && (
                <th>{i18next.t(LOCALIZATION.HEADER_LANGUAGE)}</th>
              )}
              <th>{i18next.t(LOCALIZATION.HEADER_CATEGORY)}</th>
            </tr>
          </thead>
          <tbody>
            {!hasContent && (
              <tr>
                <td colSpan="2">
                  {i18next.t(LOCALIZATION.EMPTY_PLACEHOLDER_MESSAGE)}
                </td>
              </tr>
            )}
            {hasContent &&
              resources.map(resource => (
                <tr key={resource.id}>
                  <td>{resource[titleProp] || ''}</td>
                  {hasLanguages && (
                    <td>{getLanguageName(resource, languages)}</td>
                  )}
                  <td>{getCategoryName(resource)}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </LoaderContainer>
    </div>
  );
}

ContentPreview.propTypes = {
  categories: PropTypes.array,
  languages: PropTypes.array,
  resources: PropTypes.object.isRequired,
  titleProp: PropTypes.string.isRequired,
  hasContent: PropTypes.bool,
  hasLanguages: PropTypes.bool,
  inProgress: PropTypes.bool,
};
