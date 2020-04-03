export type responseErrorsT = {
  [key: string]: string[];
};

export type errorsT = {
  [key: string]: string;
};

type mapResponseErrorsT = (e: responseErrorsT) => errorsT;
const mapResponseErrors: mapResponseErrorsT = responseErrors => {
  return Object.entries(responseErrors).reduce<errorsT>(
    (previousErrors, [field, messages]) => {
      return {
        ...previousErrors,
        [field]: messages.reduce<string>(
          (previousMessages, message) => `${previousMessages} ${message}.`,
          '',
        ).slice(1),
      };
    },
    {},
  );
};

export default mapResponseErrors;
