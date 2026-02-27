import 'dotenv/config';

const jwtConfig = {
  get jwt_secret() {
    return process.env.JWT_SECRET;
  },
  get expires_in() {
    return process.env.JWT_EXPIRES_IN;
  },
  get refresh_secret() {
    return process.env.REFRESH_SECRET;
  },
  get refresh_expires_in() {
    return process.env.REFRESH_EXPIRES_IN;
  },
};

export default jwtConfig;
