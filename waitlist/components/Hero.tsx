import Image from "next/image";
import EmailForm from "./EmailForm";

export default function Hero() {
  return (
    <section className="overflow-hidden">
      <main className="flex flex-col gap-8 mt-8 -mb-20 items-center justify-center px-6">
        <p className="font-medium">NOTION INTEGRATION FOR HASHNODE</p>
        <h1>
          Put your Blogs into Notion
        </h1>
        <p>
          Turn your Hashnode blog into a Notion database and manage it together
          with everything else.
        </p>
        <EmailForm
          text="Join many others on the waitlist"
          icons={true}
          legal={true}
        />
        <div className="relative w-[120%] h-[80vw] -mt-20">
          <Image
            src="hero-icons.svg"
            alt="Background image"
            fill
          />
        </div>
      </main>
    </section>
  );
}
