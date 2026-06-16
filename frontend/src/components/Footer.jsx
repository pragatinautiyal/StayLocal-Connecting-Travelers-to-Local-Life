import {
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="border-t mt-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Heading */}
        <h3 className="text-lg font-semibold text-gray-800 text-center sm:text-left">
          Our Social Media Handles
        </h3>

        {/* Social Links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 text-sm text-center">
          <a
            href="https://facebook.com/staylocal"
            className="flex flex-col items-center hover:scale-105 transition"
          >
            <FaFacebook size={26} color="#1877F2" />
            <span className="mt-1 text-gray-700">Facebook</span>
            <span className="text-xs text-gray-400 break-all">
              facebook.com/staylocal
            </span>
          </a>

          <a
            href="https://linkedin.com/company/staylocal"
            className="flex flex-col items-center hover:scale-105 transition"
          >
            <FaLinkedin size={26} color="#0A66C2" />
            <span className="mt-1 text-gray-700">LinkedIn</span>
            <span className="text-xs text-gray-400 break-all">
              linkedin.com/company/staylocal
            </span>
          </a>

          <a
            href="https://youtube.com/@staylocal"
            className="flex flex-col items-center hover:scale-105 transition"
          >
            <FaYoutube size={26} color="#FF0000" />
            <span className="mt-1 text-gray-700">YouTube</span>
            <span className="text-xs text-gray-400 break-all">
              youtube.com/@staylocal
            </span>
          </a>

          <a
            href="https://instagram.com/staylocal"
            className="flex flex-col items-center hover:scale-105 transition"
          >
            <FaInstagram size={26} color="#E4405F" />
            <span className="mt-1 text-gray-700">Instagram</span>
            <span className="text-xs text-gray-400 break-all">
              instagram.com/staylocal
            </span>
          </a>

          <a
            href="https://x.com/staylocal"
            className="flex flex-col items-center hover:scale-105 transition"
          >
            <FaXTwitter size={26} color="#111111" />
            <span className="mt-1 text-gray-700">X</span>
            <span className="text-xs text-gray-400 break-all">
              x.com/staylocal
            </span>
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t text-xs text-gray-400 text-center">
          <p>
            © 2026 StayLocal (formerly StayLocal Private Limited), India. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
