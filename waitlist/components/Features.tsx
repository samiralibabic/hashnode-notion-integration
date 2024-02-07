import Image from "next/image";

export default function Features() {
  return (
    <section className="w-screen h-dvh grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:h-full h-80 relative overflow-hidden">
        <Image
          src="logo-icon.svg"
          alt="Mobile App Screenshots"
          fill
          className="object-contain mt-8 md:mt-24 px-14 object-bottom"
        />
      </div>

    </section>
  )
}
