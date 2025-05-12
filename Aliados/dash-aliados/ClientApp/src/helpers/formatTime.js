const formatTime = (dateTimeStr) => {
  const time = new Date(dateTimeStr);
  return time.toLocaleTimeString([], { timeStyle: "short" });
};

export default formatTime;
