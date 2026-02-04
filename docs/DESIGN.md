# BeatHub Data Design Decisions

## Why did you reference Songs in the Playlist instead of embedding them?

Songs are referenced in the Playlist model to avoid data duplication and ensure consistency. A single song can appear in many playlists, and referencing allows all playlists to point to the same song document. This design also allows songs to be updated or removed without needing to update every playlist that contains them, making the system more scalable and maintainable.

## Why did you reference the Artist in the Song model?

Referencing the Artist in the Song model establishes a clear ownership relationship and avoids repeating artist data across multiple songs. This allows efficient queries such as fetching all songs by a specific artist and ensures that updates to artist information are reflected everywhere without duplication.