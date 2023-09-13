export const isMobile = () => {
  const ratio = window.innerWidth / window.innerHeight;
  return ratio < 1.25;
};
