export default function Navbar() {
  return (
    <nav className="navbar bg-base-100 border-b border-base-300">
      <div className="navbar-start">
        <div className="flex items-center gap-2 ml-4">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
            <span className="font-bold text-white">SC</span>
          </div>
          <span className="text-xl font-bold">SupplyChain 3.0</span>
        </div>
      </div>
      <div className="navbar-end gap-2 mr-4">
        <button className="btn btn-ghost">Sign In</button>
        <button className="btn btn-primary">Explore Demo</button>
      </div>
    </nav>
  )
}
