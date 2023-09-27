import 'dotenv/config';

const generateBearerToken = () => {
  return Buffer.from(process.env.SPOTIFY_CLIENT + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64');
}

export {
  generateBearerToken
}