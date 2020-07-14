export const copyUrlToClipboard = (url: string): void => {
  const element = document.createElement('input');
  element.value = url;
  document.body.appendChild(element);
  element.select();
  document.execCommand('copy');
  element.remove();
};
