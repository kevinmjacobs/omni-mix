interface QueryString {
  code?: string;
  state?: string;
  title?: string;
  artist?: string;
  album?: string;
}
interface Artist {
  name: string
}

interface PlaylistItem {
  track: {
    duration_ms: string
    name: string
    album: string
    artists: Artist[]
    artistNames?: string
  }
}

interface Release {
  year: string,
  format: string[],
  label: string[],
  genre: string[],
  style: string[],
  id: number,
  master_id: number,
  title: string
}

export {
  QueryString,
  Artist,
  PlaylistItem,
  Release
}