"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { About, SocialHandle } from "../utils/interface";
import { cn } from "../utils/cn";
import Link from "next/link";
import { SectionHeading, TextReveal } from "./ui/Typography";
import { SlideIn, Transition } from "./ui/Transitions";
import { Input, Textarea } from "./ui/Input";
import { sendEmail } from "@/actions/sendEmail";
import toast from "react-hot-toast"; // For success/error messages (install if not already: `npm install react-hot-toast`)

interface ContactProps {
  email: string;
  social_handle: SocialHandle[];
  about: About;
}

const Contact = ({ email, social_handle, about }: ContactProps) => {
  const [status, setStatus] = useState<"SENDING" | "DONE" | "ERROR" | "IDLE">(
    "IDLE"
  );
  const [statusText, setStatusText] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <motion.section className="relative" id="contact">
      <AnimatePresence initial={false}>
        {status !== "IDLE" && (
          <motion.li
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={cn(
              "fixed top-4 right-4 p-2 px-4 w-[300px] z-50 h-16 rounded-xl bg-white flex items-center",
              status === "ERROR"
                ? "bg-red-500"
                : status === "DONE"
                ? "bg-green-400"
                : ""
            )}
          >
            <p className="text-black font-semibold">{statusText}</p>
          </motion.li>
        )}
      </AnimatePresence>
      <span className="blob size-1/2 absolute top-20 right-0 blur-[100px] -z-10" />
      <div className="p-4 md:p-8 md:px-16">
        <SectionHeading className="">
          <SlideIn className="text-white/40">Interested in talking,</SlideIn>{" "}
          <br /> <SlideIn>let’s do it.</SlideIn>
        </SectionHeading>
        <div className="grid md:grid-cols-2 gap-10 md:pt-16">
          {/* Form using Server Action */}
          <form
            className="space-y-4"
            action={async (formData) => { // Use the Server Action in form's action
              setStatus("SENDING"); // Set status to sending

              const result = await sendEmail(formData); // Call the Server Action

              setStatus("IDLE"); // Reset status to IDLE after action completes (or fails)

              if (result?.error) {
                setStatusText(result.error);
                setStatus("ERROR");
                toast.error(result.error); // Display error toast
              } else if (result?.success) {
                setStatusText(result.success);
                setStatus("DONE");
                toast.success(result.success); // Display success toast
                setFormData({ // Clear the form on success
                  email: "",
                  message: "",
                  name: "",
                  subject: "",
                });
              }
            }}
          >
            <div className="flex gap-4">
              <Transition className="w-full">
                <Input
                  id="name"
                  name="name"
                  placeholder="Full name"
                  className="border-0 border-b rounded-none"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Transition>
              <Transition className="w-full">
                <Input
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  className="border-0 border-b rounded-none"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Transition>
            </div>
            <div className="space-y-2">
              <Transition>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Enter the subject"
                  className="border-0 border-b rounded-none"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </Transition>
            </div>
            <div className="space-y-2">
              <Transition>
                <Textarea
                  className="min-h-[100px] rounded-none border-0 border-b resize-none"
                  id="message"
                  name="message"
                  placeholder="Enter your message"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </Transition>
            </div>
            <div>
              <Transition>
                <motion.button
                  whileHover="whileHover"
                  initial="initial"
                  className="border border-white/30 px-8 py-2 rounded-3xl relative overflow-hidden"
                  type="submit"
                  disabled={status === "SENDING"} // Disable button while sending
                >
                  <TextReveal className="uppercase">
                    {status === "SENDING" ? "Sending..." : "discuss project"}
                  </TextReveal>
                </motion.button>
              </Transition>
            </div>
          </form>
          {/* ... rest of the component (right side content) ... */}
          <div className="md:justify-self-end flex flex-col">
            <div className="pb-4">
              <Transition>
                <span className="text-white/90">Get in touch</span>
              </Transition>
              <div className="text-base md:text-2xl font-bold py-2">
                <Transition>
                  <TextReveal>{email}</TextReveal>
                </Transition>
              </div>
              <Transition>
                <div className="pb-1 text-white/80">{about.phoneNumber}</div>
              </Transition>
              <Transition>
                <div className="text-white/80">{about.address}</div>
              </Transition>
            </div>

            <div className="flex md:gap-8 gap-4 mt-auto md:pb-16">
              {social_handle.map((social, index) =>
                social.enabled ? (
                  <Transition
                    key={social._id}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Link href={social.url} target="_blank">
                      <TextReveal>{social.platform}</TextReveal>
                    </Link>
                  </Transition>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ... footer ... */}
    </motion.section>
  );
};

export default Contact;