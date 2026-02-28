"use client"


export const Footer = () => {
  return (
    <footer className="w-full py-6 bg-gray-800 border-t border-gray-700 mt-auto">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <p className="text-sm">
          © {new Date().getFullYear()} True Whisper. All rights reserved.
        </p>
        <p className="text-xs mt-2 text-gray-500">
          Built with Privacy and Security in mind.
        </p>
      </div>
    </footer>
  )
}

export default Footer