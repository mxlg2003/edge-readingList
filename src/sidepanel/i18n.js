const getMessage = (key) => {
  return chrome.i18n.getMessage(key);
};

export default getMessage;
