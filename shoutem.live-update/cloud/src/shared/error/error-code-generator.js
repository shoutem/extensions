export function generateErrorCode(module, type, errorId) {
  return `${module}_${type}_${errorId}`;
}
