import Image from 'next/image';
import placeholder from '../public/video.png';

export default function Video() {
  return (
    <>
      <section className="gap-20 my-20 justify-items-center">
        <h2>See it in action</h2>
        <p className="px-16 ">
          We use OAuth to connect to Notion and your Hashnode Access Key and
          publication to connect to Hashnode.
        </p>
        <Image
          src={placeholder}
          alt="Placeholder for video"
        />
        <video
          className="hidden"
          src=""
          width={300}
          height={200}
        >
        </video>
      </section>
    </>
  );
}
