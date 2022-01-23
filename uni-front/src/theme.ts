export interface ThemeType {
  body: string;
  primaryColor: string;
  primaryBgc: string;
  primaryBorder: string;
  bgcBtn: string;
  successColor: string;
  hightlightColor: string;
  secondColor: string;
  successBgc: string;
  errorBgc: string;
  errorColor: string;
  alertErrorBgc: string;
  alertSuccessBgc: string;
  alertInfoBgc: string;
}

export const lightTheme: ThemeType = {
  body: '#ffffff',
  primaryColor: '#717171',
  primaryBgc: '#F8F9F8',
  primaryBorder: '1px solid #C8C8C8',
  bgcBtn: '#ffffff',
  successColor: '#198754',
  successBgc: '#E8F4EF',
  errorColor: '#8C1515',
  errorBgc: '#F4E8E8',
  hightlightColor: '#158C5C',
  secondColor: '#363636',
  alertErrorBgc: '#F4E8E8',
  alertInfoBgc: '#FFFFD7',
  alertSuccessBgc: '#E8F4EF',
};
