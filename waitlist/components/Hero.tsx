import EmailForm from "./EmailForm";

export default function Hero() {
  return (
    <section className="overflow-hidden bg-[url('/scribble-bg.svg')] bg-no-repeat bg-bottom bg-contain">
      <main className="flex flex-col gap-8 my-8 items-center justify-center px-6">
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
      </main>
    </section>
  );
}
