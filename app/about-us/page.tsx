"use client"

import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      <section className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-shrink-0 w-full md:w-auto"
          >
            <div className="relative w-full max-w-[400px] mx-auto md:mx-0">
              <Image
                src="https://imagizer.imageshack.com/img922/310/c8UQzL.jpg"
                alt="Naiem Shaikh - Nemo"
                width={400}
                height={400}
                priority
                className="rounded-2xl shadow-lg object-cover border border-[#222]"
              />
            </div>
          </motion.div>

          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#10a37f]">About Naiem Shaikh</h1>
            <p className="text-[#999999] text-lg leading-relaxed mb-6">
              Naiem Shaikh, also known as <span className="text-white font-semibold">Nemo</span>, is an Indian independent
              rapper, singer, music producer, composer, and lyricist. Known for his unique style and innovative music, he
              has made a name for himself in the Indian music scene.
            </p>
            <p className="text-[#999999] text-lg leading-relaxed mb-6">
              Naiem has released multiple tracks that deeply resonate with listeners, blending emotion and originality in
              every beat. His dedication to his craft and creative authenticity have earned him recognition as one of the
              rising stars in the independent music industry.
            </p>
            <p className="text-[#999999] text-lg leading-relaxed">
              Beyond music, Naiem continues to inspire aspiring artists with his artistic vision and commitment to pushing
              the boundaries of independent sound.
            </p>
          </motion.div>
        </div>

        {/* Section Divider */}
        <div className="max-w-6xl mx-auto mt-20 border-t border-[#222]" />

        {/* Vision / Mission Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center mt-16 px-4"
        >
          <h2 className="text-3xl font-bold mb-4 text-[#10a37f]">Vision & Mission</h2>
          <p className="text-[#999999] text-lg leading-relaxed">
            Naiem’s mission is to create art that connects with people on a deeper level — transcending boundaries through
            rhythm, emotion, and lyrical storytelling. His vision is to redefine what it means to be an independent artist
            in India by blending authenticity, passion, and innovation in every creation.
          </p>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
