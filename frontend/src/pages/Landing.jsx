import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const token = localStorage.getItem('token');

  // Feature cards data
  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      title: "Instant AI Generation",
      description: "Utilizes keyless Pollinations AI to translate text prompts into high-definition graphics in seconds."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      ),
      title: "Optimal YouTube Aspect Ratio",
      description: "Generates images in exactly 1280x720 resolution (16:9 ratio), ready for immediate upload to YouTube."
    },
    {
      icon: (
        <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      title: "Database Log History",
      description: "Saves all generated prompts and image logs in local MongoDB so you can browse or download past creations."
    }
  ];

  // Static preview mockups for demonstration
  const demos = [
    {
      title: "Cyberpunk Gaming Setup",
      prompt: "A futuristic neon gaming desk, glowing purple lights, triple monitor setup, digital art style",
      imageUrl: "https://image.pollinations.ai/prompt/A%20futuristic%20neon%20gaming%20desk%2C%20glowing%20purple%20lights%2C%20triple%20monitor%20setup%2C%20digital%20art%20style?width=640&height=360&nologo=true&seed=48927"
    },
    {
      title: "Calm Productivity Desk",
      prompt: "Minimalist wooden office desk, MacBook, green desk plant, warm sunlight, photorealistic photography",
      imageUrl: "https://image.pollinations.ai/prompt/Minimalist%20wooden%20office%20desk%2C%20MacBook%2C%20green%20desk%20plant%2C%20warm%20sunlight%2C%20photorealistic%20photography?width=640&height=360&nologo=true&seed=90312"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen text-slate-800">
      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Glow decoration */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 border border-orange-200 text-orange-600 mb-6 tracking-wide">
          AI-POWERED CREATION FOR YOUTUBERS
        </span>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl text-slate-900">
          Generate Stunning YouTube Thumbnails in{' '}
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            One Click
          </span>
        </h1>

        <p className="mt-6 text-slate-500 text-base md:text-xl max-w-2xl font-light leading-relaxed">
          Stop spending hours in Photoshop. Describe your video topic and let our AI model create high-converting thumbnails instantly.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm">
          {token ? (
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg glow-primary flex items-center justify-center gap-2 cursor-pointer"
            >
              Go to Dashboard
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg glow-primary flex items-center justify-center cursor-pointer"
              >
                Get Started For Free
              </Link>
              <Link
                to="/login"
                className="bg-white border border-orange-200 hover:bg-orange-50/50 text-slate-700 hover:text-orange-600 font-semibold px-8 py-4 rounded-xl transition-colors duration-300 flex items-center justify-center cursor-pointer"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16 border-t border-orange-100 bg-orange-50/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800">Built for Modern Creators</h2>
            <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto">
              Simple frontend connected to a Node.js Express server to handle all generation requests.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="glass p-6 rounded-xl border border-orange-100 hover:border-orange-300/60 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="px-6 py-16 border-t border-orange-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-800">See the Output Quality</h2>
            <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto">
              Check out sample thumbnails generated directly using prompts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {demos.map((demo, idx) => (
              <div key={idx} className="glass rounded-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300">
                <div className="aspect-video w-full bg-[#f8fafc]">
                  <img
                    src={demo.imageUrl}
                    alt={demo.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 border-t border-orange-100">
                  <h4 className="font-bold text-slate-800 text-lg mb-1">{demo.title}</h4>
                  <p className="text-xs text-orange-500 font-mono mb-2">Prompt:</p>
                  <p className="text-slate-500 text-xs italic bg-orange-50/20 p-3 rounded-lg border border-orange-100/50 leading-relaxed">
                    "{demo.prompt}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-orange-100 bg-orange-50/5 px-6 text-center text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} ThumbnailAI. Final Year CSE Project.</p>
          <p className="flex gap-4">
            <span className="text-slate-600">React.js</span>
            <span>•</span>
            <span className="text-slate-600">Node.js</span>
            <span>•</span>
            <span className="text-slate-600">MongoDB</span>
            <span>•</span>
            <span className="text-slate-600">Tailwind CSS</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
