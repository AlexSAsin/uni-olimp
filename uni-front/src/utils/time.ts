const MILLISECONDS_IN_SECOND = 1000;
const SECNDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

export const correctStrDate = (strDate: string): string => {
  if (strDate === undefined) return 'None';
  const updDate = new Date(strDate.replace(' ', 'T'));
  const timedelta = new Date().getTime() - updDate.getTime();
  let daysPass =
    timedelta /
    HOURS_IN_DAY /
    MINUTES_IN_HOUR /
    SECNDS_IN_MINUTE /
    MILLISECONDS_IN_SECOND;
  if (daysPass >= 1) {
    return Math.floor(daysPass).toString() + ' days ago';
  }
  let hoursPass =
    timedelta / MINUTES_IN_HOUR / SECNDS_IN_MINUTE / MILLISECONDS_IN_SECOND;
  if (hoursPass >= 1) {
    return Math.floor(hoursPass).toString() + ' hours ago';
  }
  let minutesPass = timedelta / SECNDS_IN_MINUTE / MILLISECONDS_IN_SECOND;
  if (minutesPass >= 1) {
    return Math.floor(minutesPass).toString() + ' minutes ago';
  }
  let secondsPass = timedelta / MILLISECONDS_IN_SECOND;
  if (secondsPass >= 10) {
    return Math.floor(secondsPass).toString() + ' seconds ago';
  }
  return 'now';
};
