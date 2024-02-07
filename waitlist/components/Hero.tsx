import EmailForm from "./EmailForm"

export default function Hero() {
  return (
    <section className="w-screen h-dvh grid grid-cols-1">
      <h2 className="">NOTION INTEGRATION FOR HASHNODE</h2>
      <main className="flex flex-col gap-8 mt-8 justify-center px-6 pb-10">
        <h1 className="font-semibold tracking-tight text-black-pearl text-3xl leading-tight md:text-4xl max-w-lg">
          Put your Blogs into Notion
        </h1>
        <h3>
          Turn your Hashnode blog into Notion database and manage it together with everything else.
        </h3>
        <p className="text-gray-500">
          Join many others on the waitlist
        </p>

        <EmailForm />
      </main>
    </section>
  )
}
