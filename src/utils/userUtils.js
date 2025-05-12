/**
 * Calculates the completion percentage for a user based on their total and completed products
 * @param {Object} user - The user object
 * @returns {number} The completion percentage (0-100)
 */
export const calculateCompletionPercentage = (user) => {
  const total = user.totalProducts?.total || 0;
  const completed = user.totalProducts?.completed || 0;
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}; 