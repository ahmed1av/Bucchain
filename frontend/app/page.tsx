'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-obsidian text-white overflow-x-hidden selection:bg-primary/30">
      {/* Subtle Background - No heavy blurs */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-24 lg:pt-48 lg:pb-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="text-sm font-medium text-gray-300 tracking-wide">Next Generation Supply Chain Intelligence</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1] animate-fade-in-up">
              Trust in every <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">transaction.</span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100 font-light">
              BUCChain empowers enterprises with real-time visibility, automated compliance, and predictive insights to secure global trade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-200">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-semibold text-lg rounded-lg transition-all duration-200 shadow-lg shadow-primary/10 hover:shadow-primary/20"
              >
                Request Demo
              </button>

              <button
                onClick={() => router.push('/register')}
                className="px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white font-semibold text-lg rounded-lg transition-all duration-200"
              >
                Start Free Trial
              </button>
            </div>
          </div>

          {/* Dashboard Preview - Clean & Sharp */}
          <div className="mt-24 relative max-w-6xl mx-auto animate-fade-in-up delay-300 group">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#111625] shadow-2xl relative">
              {/* Browser Bar */}
              <div className="h-8 bg-[#1A2030] border-b border-white/5 flex items-center px-4 gap-2 relative z-20">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>

              {/* Image Container */}
              <div className="relative group-hover:scale-[1.01] transition-transform duration-700">
                <Image
                  src="/dashboard-mockup.png"
                  alt="BUCChain Dashboard"
                  width={1200}
                  height={675}
                  className="w-full h-auto object-cover opacity-80 blur-[3px] scale-105"
                  priority
                />

                {/* HUD Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-[#0B0F19]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center shadow-2xl animate-fade-in-up delay-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="relative">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                      </div>
                      <span className="text-green-400 font-mono font-bold tracking-wider text-sm">SYSTEM ONLINE</span>
                    </div>

                    <div className="grid grid-cols-2 gap-8 text-center w-full">
                      <div>
                        <div className="text-3xl font-bold text-white mb-1 font-mono">542</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest">Active Nodes</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white mb-1 font-mono">8,902</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest">TPS</div>
                      </div>
                    </div>

                    <div className="mt-6 w-full bg-white/5 rounded-full h-1 overflow-hidden">
                      <div className="h-full bg-primary w-2/3 animate-pulse"></div>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-500 font-mono w-full flex justify-between">
                      <span>LATENCY: 12ms</span>
                      <span>BLOCK: #19,204,921</span>
                    </div>
                  </div>
                </div>

                {/* Scanning Line Animation */}
                <div className="absolute left-0 right-0 h-[1px] bg-primary/30 shadow-[0_0_30px_rgba(255,94,0,0.3)] animate-scan z-10 pointer-events-none"></div>

                {/* Gradient Fade Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/20 to-transparent z-10"></div>
              </div>
            </div>

            {/* Ambient Glow behind */}
            <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
          </div>
        </div>
      </section>

      {/* Stats - Bento Grid Style */}
      <section className="relative z-10 py-24 border-y border-white/5 bg-[#0B0F19]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/5 border border-white/5 rounded-2xl overflow-hidden bg-[#111625]">
            {[
              { label: 'Transactions Tracked', value: '$10T+' },
              { label: 'Active Partners', value: '500+' },
              { label: 'Global Coverage', value: '70+' },
              { label: 'Risk Detected', value: '$2B+' },
            ].map((stat, index) => (
              <div key={index} className="p-8 text-center hover:bg-white/[0.02] transition-colors">
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">{stat.value}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Side by Side */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-24 max-w-3xl">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Enterprise-grade <br />Supply Chain Intelligence</h2>
            <p className="text-xl text-gray-400 leading-relaxed">
              Our platform combines blockchain immutability with advanced AI to provide a single source of truth for your entire supply network.
            </p>
          </div>

          <div className="space-y-32">
            {/* Feature 1 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-3xl font-bold mb-4">Automated Compliance</h3>
                <p className="text-lg text-gray-400 leading-relaxed mb-8">
                  Stop manually checking spreadsheets. Our engine automatically screens every supplier and transaction against global watchlists, sanctions, and regulatory requirements in real-time.
                </p>
                <ul className="space-y-4">
                  {['Real-time Sanctions Screening', 'Automated KYB/KYC', 'Regulatory Reporting'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-[#111625] border border-white/10 rounded-xl p-8 h-[400px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Abstract UI representation */}
                <div className="space-y-4">
                  <div className="h-4 w-1/3 bg-white/10 rounded"></div>
                  <div className="h-8 w-2/3 bg-white/5 rounded"></div>
                  <div className="h-32 w-full bg-white/5 rounded border border-white/5 mt-8"></div>
                  <div className="h-4 w-1/2 bg-green-500/20 rounded mt-4"></div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center lg:flex-row-reverse">
              <div className="lg:order-2">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                </div>
                <h3 className="text-3xl font-bold mb-4">Predictive Analytics</h3>
                <p className="text-lg text-gray-400 leading-relaxed mb-8">
                  Leverage our proprietary neural networks to forecast demand, identify potential bottlenecks, and optimize inventory levels before issues impact your bottom line.
                </p>
                <ul className="space-y-4">
                  {['Demand Forecasting', 'Risk Scoring', 'Inventory Optimization'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:order-1 bg-[#111625] border border-white/10 rounded-xl p-8 h-[400px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Abstract UI representation */}
                <div className="flex items-end gap-4 h-full pb-8 px-4">
                  <div className="w-full bg-white/5 rounded-t h-[40%] group-hover:h-[60%] transition-all duration-500"></div>
                  <div className="w-full bg-white/10 rounded-t h-[70%] group-hover:h-[50%] transition-all duration-500"></div>
                  <div className="w-full bg-primary/20 rounded-t h-[50%] group-hover:h-[80%] transition-all duration-500"></div>
                  <div className="w-full bg-white/5 rounded-t h-[60%] group-hover:h-[40%] transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section - Clean */}
      <section className="relative z-10 py-32 bg-[#111625] border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold mb-6">Intelligence in your pocket.</h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                The BUCChain mobile app keeps you connected to your supply chain 24/7. Approve contracts, track shipments, and receive critical alerts wherever you are.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-white text-black rounded-lg font-bold flex items-center gap-3 hover:bg-gray-200 transition-colors">
                  <span className="text-xl"></span> App Store
                </button>
                <button className="px-6 py-3 bg-transparent border border-white/20 text-white rounded-lg font-bold flex items-center gap-3 hover:bg-white/5 transition-colors">
                  <span className="text-xl">▶</span> Google Play
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-[320px] h-[640px] bg-[#0B0F19] border-[12px] border-[#2A3040] rounded-[3rem] shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-[#2A3040] rounded-b-xl z-20"></div>
                <div className="w-full h-full p-6 flex flex-col">
                  <div className="mt-12 mb-8">
                    <div className="text-2xl font-bold">Good morning</div>
                    <div className="text-gray-500">Here's your supply summary</div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 bg-[#1A2030] rounded-xl border border-white/5">
                        <div className="flex justify-between mb-2">
                          <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                          <div className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">Active</div>
                        </div>
                        <div className="h-2 w-2/3 bg-white/10 rounded mb-2"></div>
                        <div className="h-2 w-1/2 bg-white/5 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Minimal */}
      <section className="relative z-10 py-32 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">Ready to transform your supply chain?</h2>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => router.push('/register')}
              className="px-10 py-5 bg-primary hover:bg-primary-hover text-white font-bold text-xl rounded-lg transition-all duration-200 shadow-xl shadow-primary/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
