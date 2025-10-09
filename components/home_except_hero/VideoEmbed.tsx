export default function VideoEmbed({
    src,
    title,
  }: {
    src: string;
    title: string;
  }) {
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg mb-20">
        <iframe
          className="w-full h-full"
          src={src}
          title={title}
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
  