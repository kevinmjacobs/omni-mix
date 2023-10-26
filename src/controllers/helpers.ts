import 'dotenv/config';
import { Release } from './interfaces';

const generateBearerToken = () => {
  return Buffer.from(process.env.SPOTIFY_CLIENT + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64');
}

const formatDuration = (milliseconds: number) => {
  const seconds = milliseconds / 1000;
  const minutes = Math.trunc(seconds / 60);
  let secondsRemaining: string | number = Math.trunc(seconds % 60);
  if (secondsRemaining < 10) {
    secondsRemaining = '0' + secondsRemaining.toString();
  }
  return minutes + ':' + secondsRemaining;
};

const formatReleases = (releases: Release[]) => {
  return releases.map((release: Release) => {
    return {
      title: release.title,
      year: release.year,
      masterId:  release.master_id,
      releaseId:  release.id,
      thumb: release.thumb,
      label: release.label[0],
      format: release.format.join(','),
      genre: release.genre.join(','),
      style: release.style.join(','),
    }
  });
}

export {
  formatDuration,
  formatReleases,
  generateBearerToken
}