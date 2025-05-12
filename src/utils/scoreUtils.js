export const getColorByScore = (score) => {
  if (score >= 400) return '#16C01E';
  if (score >= 200) return '#F3C210';
  return '#FE6E6E';
}; 