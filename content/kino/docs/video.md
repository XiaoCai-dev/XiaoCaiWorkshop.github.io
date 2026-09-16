# Video Pipeline

From frames to a final cut.

## Frames

Source frames are normalized to a working format early. The asset system
deduplicates identical frames across takes.

## Clips

A clip is a ranged reference into frames plus optional transforms (zoom, crop,
speed). Clips are cheap — they're pointers, not copies.

## Timeline

A timeline is an ordered list of clips with audio tracks layered underneath.
Rendering walks the timeline and emits the final video.

## Notes

- Keep everything content-addressed so a re-render only redoes changed clips.
- Captions are a track, not a burn-in, so they can be restyled without
  re-rendering video.
