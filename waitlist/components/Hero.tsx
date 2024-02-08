import EmailForm from "./EmailForm";

export default function Hero() {
  return (
    <section>
      <main className="flex flex-col gap-8 mt-8 items-center justify-center px-6 pb-10">
        <p className="font-medium">NOTION INTEGRATION FOR HASHNODE</p>
        <h1>
          Put your Blogs into Notion
        </h1>
        <p>
          Turn your Hashnode blog into a Notion database and manage it together
          with everything else.
        </p>
        <EmailForm />
      </main>
    </section>
  );
}
