export default function Video() {
  return (
    <>
      <section className="gap-20 my-20 justify-items-center">
        <h2>See it in action</h2>
        <p className="px-16 ">
          We use OAuth to connect to Notion and your Hashnode Access Key and
          publication to connect to Hashnode.
        </p>
        <video
          className="border rounded-lg border-dark-lila"
          width="80%"
          height={500}
          controls
          preload="none"
          poster="video-placeholder.png"
        >
          <source
            src="hashion-v0.mp4"
            width={500}
            height={500}
          />
          Your browser does not support the video tag.
        </video>
      </section>
    </>
  );
}
