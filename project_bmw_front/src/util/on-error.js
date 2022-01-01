export const onError = (error, setError, offTimer) => {
  setError(error.toString());
  return offTimer
    ? false
    : setTimeout(() => {
        setError('');
      }, 3000);
};
