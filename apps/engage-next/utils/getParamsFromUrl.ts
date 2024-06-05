export const getParamsFromUrl = (parameter: string) => {
  return new URLSearchParams(window.location.search).get(parameter);
};
