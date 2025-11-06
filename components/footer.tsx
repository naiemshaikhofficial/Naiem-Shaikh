import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#333333] py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-2">Naiem Shaikh</h3>
            <p className="text-[#999999] text-sm">Digital artist, designer & creative educator</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#999999] hover:text-[#10a37f] smooth-transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-[#999999] hover:text-[#10a37f] smooth-transition">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#contact" className="text-[#999999] hover:text-[#10a37f] smooth-transition">
                  Contact
                </Link>
              </li>
              <li>
                <a href="mailto:naiem@example.com" className="text-[#999999] hover:text-[#10a37f] smooth-transition">
                  Email
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://youtube.com" className="text-[#999999] hover:text-[#10a37f] smooth-transition">
                  YouTube
                </a>
              </li>
              <li>
                <a href="https://twitter.com" className="text-[#999999] hover:text-[#10a37f] smooth-transition">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#333333] pt-8 text-center text-[#999999] text-sm">
          <p>© 2025 Naiem Shaikh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
