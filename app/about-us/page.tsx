"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="pt-32 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-shrink-0 w-full md:w-1/2"
          >
            <div className="relative w-full max-w-[450px] mx-auto md:mx-0">
              <Image
                src="https://imagizer.imageshack.com/img922/310/c8UQzL.jpg"
                alt="Naiem Shaikh - Nemo"
                width={450}
                height={450}
                priority
                className="rounded-3xl shadow-2xl object-cover border border-[#333]"
              />
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 text-center md:text-left"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#10a37f]">Naiem Shaikh</h1>
            <h2 className="text-xl text-[#999999] mb-6">aka Nemo — Independent Rapper, Singer & Producer</h2>
            <p className="text-[#ccc] text-lg leading-relaxed mb-4">
              Naiem Shaikh, also known as <span className="text-white font-semibold">Nemo</span>, is an independent Indian artist blending rap, singing, production, and composition to create music that resonates deeply.
            </p>
            <p className="text-[#ccc] text-lg leading-relaxed mb-4">
              With multiple tracks released, Nemo combines emotion, originality, and innovative sound design, establishing himself as one of India’s rising independent stars.
            </p>
            <p className="text-[#ccc] text-lg leading-relaxed">
              Beyond music, he inspires upcoming artists through his vision, dedication, and boundary-pushing creativity.
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="max-w-6xl mx-auto mt-24 border-t border-[#222]" />

        {/* Vision / Mission */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center mt-16 px-4"
        >
          <h2 className="text-4xl font-bold mb-6 text-[#10a37f]">Vision & Mission</h2>
          <p className="text-[#ccc] text-lg leading-relaxed">
            Nemo’s mission is to create art that connects with people emotionally, transcending boundaries with rhythm, storytelling, and innovative sound. His vision is to redefine independent music in India through authenticity, passion, and creativity in every release.
          </p>
        </motion.div>

        {/* Optional: Achievements Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto text-center mt-24 px-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-[#10a37f]">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className="text-[#ccc] text-lg">🎵 Multiple tracks streamed globally</p>
            </div>
            <div>
              <p className="text-[#ccc] text-lg">🏆 Recognized as a rising independent artist in India</p>
            </div>
            <div>
              <p className="text-[#ccc] text-lg">🎤 Collaborations with notable Indian music talents</p>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
