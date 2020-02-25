import _ from 'lodash';

/**
 * Get author object. It is fetched through post.author ID using redux.
 * @param {Object} post Wordpress post
 */

export default function getAuthorName(post) {
  return _.get(post, 'author_object.name');
}
