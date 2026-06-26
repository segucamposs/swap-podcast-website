export default function SpotifyPlayerCard() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <iframe
        src="https://open.spotify.com/embed/show/1t25iC8KdPXDZ9BUr1KgxY?utm_source=generator&theme=0"
        width="100%"
        height="232"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="SWAP Podcast en Spotify"
        style={{ display: "block" }}
      />
    </div>
  );
}
