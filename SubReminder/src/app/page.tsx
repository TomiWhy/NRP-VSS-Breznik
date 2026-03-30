import Link from "next/link";

export default function Home() {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">account_balance_wallet</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">SubReminder</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#how-it-works">How It Works</a>
              <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#pricing">Pricing</a>
              <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#privacy">Privacy</a>
              <Link href="/login" className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all">Sign In</Link>
            </div>
            <div className="md:hidden">
              <span className="material-symbols-outlined cursor-pointer">menu</span>
            </div>
          </div>
        </div>
      </nav>

      <header className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            No bank connection required
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Get Your Money Back From <br />
            <span className="text-primary">Unwanted Subscriptions</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            We scan your receipts, find forgotten renewals, and help you get refunds. <strong>Pay nothing upfront.</strong> We only take a small fee if we successfully save you money.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all text-lg">
              Track My Subscriptions Free
            </Link>
            <div className="flex items-center gap-6 mt-4 sm:mt-0 px-4">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">No bank connection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Pay only on success</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-24 bg-white dark:bg-slate-900" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">No subscription. No upfront cost.</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Stop paying for management apps. We only get paid when you do. If we don't recover money for you, our service is 100% free.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="relative p-8 bg-background-light dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="absolute -top-4 left-8 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
              <div className="mb-4 text-primary">
                <span className="material-symbols-outlined text-4xl">search_check</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Track</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Securely upload your digital receipts. No bank login needed. We identify every recurring charge.</p>
            </div>
            <div className="relative p-8 bg-background-light dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="absolute -top-4 left-8 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
              <div className="mb-4 text-primary">
                <span className="material-symbols-outlined text-4xl">assignment_return</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Refund</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">We find unused services and initiate refund requests or cancellations on your behalf.</p>
            </div>
            <div className="relative p-8 bg-background-light dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="absolute -top-4 left-8 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
              <div className="mb-4 text-primary">
                <span className="material-symbols-outlined text-4xl">payments</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Pay on Success</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">You keep the bulk of the recovered funds. We only take a small commission from what you save.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start" id="pricing">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-2xl font-bold mb-8 text-slate-900 dark:text-white flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">account_balance</span>
                Success Commission Table
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <span className="font-medium">Recovered up to $20</span>
                  <span className="text-xl font-bold text-primary">35%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <span className="font-medium">Recovered $21 — $50</span>
                  <span className="text-xl font-bold text-primary">25%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-primary/20">
                  <span className="font-medium">Recovered $51 — $150</span>
                  <span className="text-xl font-bold text-primary">15%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <span className="font-medium">Recovered $150 — $300</span>
                  <span className="text-xl font-bold text-primary">10%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <span className="font-medium">Recovered $300+</span>
                  <span className="text-xl font-bold text-primary">5%</span>
                </div>
              </div>
              <p className="mt-6 text-xs text-slate-500 text-center italic">Example: If we save you $1000, you keep $950.</p>
            </div>

            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                <h4 className="text-sm font-bold mb-8 uppercase tracking-widest text-primary">Real-World Example</h4>
                <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div>
                      <p className="text-slate-400 text-sm mb-1">We recover</p>
                      <p className="text-5xl font-black text-white">$80.00</p>
                    </div>
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-green-400">add_shopping_cart</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border-2 border-primary/50 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">trending_flat</span>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Our Fee (25%)</p>
                        <p className="text-xl font-bold text-white">$20.00</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold text-sm mb-1">YOU KEEP</p>
                      <p className="text-5xl font-black text-green-400 leading-none">$60.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background-light dark:bg-background-dark overflow-hidden" id="privacy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="material-symbols-outlined text-sm">no_encryption</span>
                Zero Login Architecture
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Your Privacy is <br /><span className="text-primary">Non-Negotiable</span></h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Most tools ask for your bank login. We don't. Our technology works by scanning your digital receipts or manual statement uploads. You maintain 100% control over your financial credentials.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-green-500">check_circle</span>
                  <span><strong>No bank connection required</strong> - No login sharing</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-green-500">check_circle</span>
                  <span>Zero-knowledge encryption for all data</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="material-symbols-outlined text-green-500">check_circle</span>
                  <span>GDPR & CCPA compliant infrastructure</span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <span className="material-symbols-outlined">verified</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Privacy Guard Active</p>
                      <p className="text-xs text-slate-500">No external logins connected</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono">ENCRYPTED</div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
                  <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  <div className="h-4 w-4/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                  <span className="material-symbols-outlined text-6xl text-slate-300">fingerprint</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-slate-900" id="support">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Need assistance?</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
            Whether you have questions about our success fees, generating an AI drafted refund, or just want to tell us about a great subscription refund, our dedicated team is here anytime.
          </p>
          <div className="flex justify-center gap-4">
            <a href="mailto:support@subreminder.com" className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">mail</span>
              Contact Support
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-xl">account_balance_wallet</span>
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">SubReminder</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                The ultimate success-based subscription recovery tool. Stop paying for what you don't use.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-slate-900 dark:text-white uppercase text-xs tracking-widest">Product</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                <li><a className="hover:text-primary transition-colors" href="#how-it-works">How it Works</a></li>
                <li><a className="hover:text-primary transition-colors" href="#pricing">Pricing Model</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-slate-900 dark:text-white uppercase text-xs tracking-widest">Trust</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                <li><a className="hover:text-primary transition-colors" href="#privacy">Security</a></li>
                <li><a className="hover:text-primary transition-colors" href="#privacy">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-slate-900 dark:text-white uppercase text-xs tracking-widest">Support</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                <li><a className="hover:text-primary transition-colors" href="#support">Help Center</a></li>
                <li><a className="hover:text-primary transition-colors" href="#support">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© 2024 SubReminder Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">lock</span> SSL Secured
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
