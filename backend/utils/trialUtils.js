exports.calculateTrialEnd = () => {
  const start = new Date();
  const end = new Date(start);
  end.setDate(end.getDate() + 14); // 14-day trial
  return { trialStart: start, trialEnd: end };
};