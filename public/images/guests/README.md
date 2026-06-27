# Guest photos — timeline

The candid photo we take with each guest at the end of the recording. Wired up
in `lib/episodes/guest-meta.ts` (keyed by guest slug).

**Format:** `<slug>.jpg`, ~900px max side (converted from the originals with
`sips -s format jpeg -Z 900`). Drop originals anywhere under
`public/images/guests pictures/` (gitignored) and convert into here.

A guest shows in the timeline once their episode is live in the RSS feed AND
they have a `photo` set in `guest-meta.ts`.

## In the timeline (live)

`tomas-marra` · `justo-mimessi` · `bauti-mazzei` · `fernando-martin-ayala` ·
`toto-artuso` · `bernardo-barcena` · `rafa-smith-estrada` · `mauro-dominguez` ·
`francis-holway` · `ivan-briones` · `eduardo-martins` · `tomas-moreno`

## Ready, pending publish (not yet in the RSS feed)

`rolo-schiavi` (24) · `andres-rieznik` (26) · `juampi-hernandez` (27) — photos
are in place; they surface automatically once the episodes hit the feed.
