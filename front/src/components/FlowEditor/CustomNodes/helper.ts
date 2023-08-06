export const positionPercentage = (index: number, count: number) => {
  if (count < 1) {
    return "0%";
  } else if (count === 1) {
    return "50%";
  } else {
    return `${20 + (60 * index) / (count - 1)}%`;
  }
};
