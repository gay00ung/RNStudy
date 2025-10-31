export default ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    // EAS 빌드 서버에서는 env에 "파일 경로"가 주입됨
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON
      ?? "./android/app/google-services.json", // 로컬 개발용 폴백
  },
});