module.exports = {
  swcMinify: false,
  trailingSlash: true,
  env: {
    // HOST
    HOST_API_KEY: 'https://api-dev-minimal-v4.vercel.app',
    // EMAIL
    SMTP_USERNAME: 'nttuancntt4@gmail.com',
    SMTP_PASSWORD: 'dqhbfnqowzzvxqmj',
    MAIL_HOST: 'smtp.gmail.com',
    // DB PTM
    DB_PTM_USER: 'system',
    DB_PTM_PASS: 'Aesx5099',
    DB_PTM_CONNECT: '172.104.47.232:1521/xe',
    // DB HDNT cũ
    DB_HDNT_CU_USER: 'hdnt_owner',
    DB_HDNT_CU_PASS: 'hdnto',
    DB_HDNT_CU_CONNECT: '10.151.69.52:1521/orcl',
    HOSTTING_REDIRECT_ENDPOINT: 'http://127.0.0.1:8084/'
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
