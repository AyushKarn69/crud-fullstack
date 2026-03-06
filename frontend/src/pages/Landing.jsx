import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-dark-charcoal text-slate-100 flex flex-col">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <nav className="glass-card-dark max-w-6xl mx-auto px-8 py-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-[20px]"></span>
            </div>
            <span className="text-lg font-bold tracking-tight text-white uppercase">Tasks</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="rounded-lg bg-primary px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all"
            >
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            Modern Task Management
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1]">
            Manage your <span className="text-primary">tasks</span> with clarity
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-400">
            A beautifully designed task management system to organize your workflow, track progress, and boost productivity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <button
              onClick={() => navigate("/register")}
              className="h-12 min-w-[200px] rounded-lg bg-primary px-10 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="h-12 min-w-[200px] rounded-lg border border-slate-700 bg-white/5 px-10 text-sm font-black uppercase tracking-widest text-slate-100 hover:bg-white/10 transition-all"
            >
              View Demo
            </button>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            {[
              { icon: "task_alt", label: "Create Tasks", desc: "Add tasks in seconds" },
              { icon: "check_circle", label: "Track Progress", desc: "Monitor your workflow" },
              { icon: "person", label: "Manage Access", desc: "Admin controls available" },
            ].map((feature) => (
              <div key={feature.label} className="glass-card-dark p-6 rounded-xl border border-white/5">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 mx-auto">
                  <span className="material-symbols-outlined">{feature.icon}</span>
                </div>
                <h3 className="font-bold text-slate-100 mb-2">{feature.label}</h3>
                <p className="text-sm text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-12 text-center text-sm text-slate-500">
        <p>© 2026 Tasks. Designed for productivity.</p>
      </footer>
    </div>
  );
};

export default Landing;
