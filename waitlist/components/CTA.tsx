import EmailForm from "./EmailForm";

export default function CTA() {
  return (
    <>
      <section className="bg-ebony pb-20 justify-items-center">
        <h2 className="mb-5 mt-14 text-white">Stay updated</h2>
        <EmailForm
          text="Be the first to know when it's out"
          textColor='white'
          icons={false}
          legal={false}
        />
      </section>
    </>
  );
}
