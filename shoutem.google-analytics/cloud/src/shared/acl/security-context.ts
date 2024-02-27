export interface SecurityContext {
  /**
   * Performs security check for a given action against resource.
   * @param action intended action type identifier
   * @param resourceType resource type identifier
   * @param resource resource object instance
   * @param condition convenience condition which resource instance
   *  must pass in order to perform security check, otherwise if condition
   *  is not met result of this function will always be true
   * @returns {boolean} true if is action is allowed on given resource,
   *  otherwise false
   */
  // eslint-disable-next-line no-unused-vars
  isAllowed(action, resourceType, resource?: object, condition?: object);

  /**
   * Fetches ACL permissions.
   * @returns {Array} ACL permissions
   */
  getAcl();
}
