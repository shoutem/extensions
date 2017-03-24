import React, { PropTypes } from 'react';
import _ from 'lodash';
import { LoaderContainer } from '@shoutem/react-web-ui';

const MAX_VISIBLE_CATEGORIES = 2;

function getCategoryName(resource) {
  const categories = _.filter(resource.categories, { autoCreated: false });
  const categoryNames = _.map(categories, 'name');

  const visibleCategories = categoryNames.slice(0, MAX_VISIBLE_CATEGORIES);
  if (categories.length > MAX_VISIBLE_CATEGORIES) {
    visibleCategories.push(`+ ${(categoryNames.length - MAX_VISIBLE_CATEGORIES)} more`);
  }

  return visibleCategories.join(', ');
}

export default function ContentTable({ resources, titleProp, hasContent, inProgress }) {
  return (
    <div className="cms__content">
      {hasContent && <span className="cms__content-overlay" />}
      <LoaderContainer isLoading={inProgress} isOverlay>
        <table className="table cms__content-table ">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
          {!hasContent && (
            <tr>
              <td colSpan="2">No content yet.</td>
            </tr>
          )}
          {hasContent && resources.map(resource => (
            <tr key={resource.id}>
              <td>{resource[titleProp] || ''}</td>
              <td>{getCategoryName(resource)}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </LoaderContainer>
    </div>
  );
}

ContentTable.propTypes = {
  resources: PropTypes.object.isRequired,
  titleProp: PropTypes.string.isRequired,
  hasContent: PropTypes.bool,
  inProgress: PropTypes.bool,
};
