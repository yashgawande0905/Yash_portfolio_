export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-white/35">
        Crafted by Yash Gawande &middot; {new Date().getFullYear()}
      </p>
    </footer>
  )
}
