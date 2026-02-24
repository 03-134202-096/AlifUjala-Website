export default function VideoEmbed({
    src,
    title,
  }: {
    src: string;
    title: string;
  }) {
    return (
      <div className="relative max-w-4xl mx-auto">
        {/* Fun border decoration */}
        <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl opacity-60 blur-sm" />
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-candy-lg border-4 border-white">
          <iframe
            className="w-full h-full"
            src={src}
            title={title}
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  }
  