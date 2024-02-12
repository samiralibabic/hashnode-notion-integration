"use client";
import Link from "next/link";
import Image from "next/image";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface EmailFormProps {
  text: string;
  textColor?: string;
  icons: boolean;
  legal: boolean;
}

export default function EmailForm(
  { text, textColor, icons, legal }: EmailFormProps,
) {
  const [email, setEmail] = useState<string>();

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEmail("");
        toast.success("Thank you for joining our waitlist! 🚀");
      } else {
        setEmail("");
        toast.error("Oops! Something went wrong!");
      }
    } catch (err) {
      setEmail("");
      console.error(err);
    }
  };
  return (
    <>
      <div className="grid gap-2 mt-10 w-full max-w-sm">
        <div className="flex flex-row items-end justify-around">
          {icons &&
            (
              <div className="w-24 relative h-10">
                <Image
                  src="avatars.svg"
                  alt="Avatar icons"
                  fill
                />
              </div>
            )}

          <h3
            className={`font-semibold ${textColor ? `text-${textColor}` : ""}`}
          >
            {text}
          </h3>
        </div>
        <form onSubmit={handleSubmit} method="POST" className="">
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <label className="sr-only" htmlFor="email-address">
              Email address
            </label>
            <input
              autoComplete="email"
              className="bg-chalk text-accent-500 block h-10 w-full appearance-none rounded-lg border border-zinc-300 px-4 py-2 placeholder-zinc-400 duration-200 focus:border-zinc-300 focus:outline-none focus:ring-zinc-300 sm:text-sm"
              id="email-address"
              name="email"
              placeholder="Enter your email"
              required
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
            {legal && (
              <div className="flex items-start w-5/6">
                <InfoCircledIcon />
                <p className="text-xs">
                  We handle your data with care. Please read our{" "}
                  <Link className="underline" href="/policy">
                    Privacy Policy
                  </Link>{" "}
                  for details.
                </p>
              </div>
            )}
            <button
              className="flex w-50 h-14 items-center justify-center gap-1 rounded-lg bg-pattens-blue text-blue-ribbon text-xl px-4 py-2 my-5 font-semibold transition-all"
              type="submit"
            >
              <span>Join the waitlist</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
