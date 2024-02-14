import Image from "next/image";

export default function Features() {
  return (
    <section id="features" className="gap-20 pb-20 bg-athens-gray">
      <h1 className="mt-20">Hashnode + Notion = blogging superpowers</h1>
      <h2>Some cool features</h2>
      <div className="flex gap-6 px-5">
        <div className="relative w-20 h-16 row-span-2 align-top">
          <Image
            src="two-way-sync.svg"
            alt="Mobile App Screenshots"
            fill
          />
        </div>
        <div className="text-left">
          <h3 className="mb-3">Two-way synchronisation</h3>
          <p>
            The data flows from one system to another, without you having to
            worry about it.
          </p>
        </div>
      </div>
      <div className="flex gap-6 px-5">
        <div className="relative w-20 h-16 row-span-2 align-top">
          <Image
            src="edit-anywhere.svg"
            alt="Mobile App Screenshots"
            fill
          />
        </div>
        <div className="text-left">
          <h3 className="mb-3">Edit on either platform</h3>
          <p>
            Edit either in Notion or in Hashnode. Your content always stays in
            sync.
          </p>
        </div>
      </div>
      <div className="flex gap-6 px-5">
        <div className="relative w-20 h-16 row-span-2 align-top">
          <Image
            src="link-everything.svg"
            alt="Mobile App Screenshots"
            fill
          />
        </div>
        <div className="text-left">
          <h3 className="mb-3">Link with everything else</h3>
          <p>
            Put your other Notion content into a page and it will show up on
            your Hashnode blog.
          </p>
        </div>
      </div>
    </section>
  );
}
