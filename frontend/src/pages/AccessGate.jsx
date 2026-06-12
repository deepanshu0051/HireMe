import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Briefcase, UserCheck, AlertCircle, Loader2 } from "lucide-react";
import { saveAuth, getToken } from "../utils/auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/* ── 3D Cube CSS ─────────────────────────────────────────────────────── */
const cubeStyles = `
  @keyframes floatY {
    0%, 100% { transform: translateY(0px) rotateX(52deg) rotateZ(25deg); }
    50%       { transform: translateY(-18px) rotateX(52deg) rotateZ(25deg); }
  }
  @keyframes floatY2 {
    0%, 100% { transform: translateY(0px) rotateX(50deg) rotateZ(-20deg); }
    50%       { transform: translateY(-14px) rotateX(50deg) rotateZ(-20deg); }
  }
  @keyframes floatY3 {
    0%, 100% { transform: translateY(0px) rotateX(55deg) rotateZ(40deg); }
    50%       { transform: translateY(-10px) rotateX(55deg) rotateZ(40deg); }
  }

  .cube-wrap {
    position: absolute;
    perspective: 800px;
    transform-style: preserve-3d;
  }
  .cube {
    transform-style: preserve-3d;
    position: relative;
  }
  .cube-face {
    position: absolute;
    border: 1.5px solid rgba(255,255,255,0.18);
    box-shadow: inset 0 0 30px rgba(255,255,255,0.06);
  }
  /* Large cube — top-left */
  .cube-lg { width: 120px; height: 120px; animation: floatY 6s ease-in-out infinite; }
  .cube-lg .cube-face { width: 120px; height: 120px; }

  /* Medium cube — bottom-right */
  .cube-md { width: 80px; height: 80px; animation: floatY2 8s ease-in-out infinite; }
  .cube-md .cube-face { width: 80px; height: 80px; }

  /* Small cube — top-right */
  .cube-sm { width: 50px; height: 50px; animation: floatY3 5s ease-in-out infinite; }
  .cube-sm .cube-face { width: 50px; height: 50px; }

  /* Extra cube — bottom-left */
  .cube-xl { width: 160px; height: 160px; animation: floatY 9s ease-in-out 1s infinite; }
  .cube-xl .cube-face { width: 160px; height: 160px; }

  @media (max-width: 640px) {
    .cube-wrap { zoom: 0.6; opacity: 0.6; }
  }
`;

const BLUE1 = "rgba(26,63,196,0.80)";
const BLUE2 = "rgba(74,111,232,0.65)";
const BLUE3 = "rgba(26,63,196,0.50)";

const CubeFace = ({ transform, bg }) => (
  <div
    className="cube-face"
    style={{ transform, background: bg, borderRadius: 4 }}
  />
);

// Builds one isometric-looking cube using 3 visible faces
const Cube = ({ className }) => {
  const s = className.includes("cube-xl")
    ? 160
    : className.includes("cube-lg")
    ? 120
    : className.includes("cube-md")
    ? 80
    : 50;
  const h = s;
  return (
    <div className={`cube ${className}`} style={{ width: s, height: h }}>
      {/* Top face */}
      <CubeFace
        transform={`rotateX(90deg) translateZ(${s / 2}px)`}
        bg={`linear-gradient(135deg, ${BLUE1}, ${BLUE2})`}
      />
      {/* Front face */}
      <CubeFace
        transform={`translateZ(${s / 2}px)`}
        bg={`linear-gradient(180deg, ${BLUE2}, ${BLUE3})`}
      />
      {/* Right face */}
      <CubeFace
        transform={`rotateY(90deg) translateZ(${s / 2}px)`}
        bg={`linear-gradient(180deg, ${BLUE1}, ${BLUE3})`}
      />
    </div>
  );
};

const AccessGate = () => {
  const navigate = useNavigate();

  // ── Auth Flow Guard ────────────────────────────────────────────────────
  const existingToken = getToken();
  useEffect(() => {
    if (existingToken && existingToken.length > 0) {
      navigate("/", { replace: true });
    }
  }, [existingToken, navigate]);
  // ──────────────────────────────────────────────────────────────────────

  const [accessPassword, setAccessPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!accessPassword.trim() || !secretKey.trim()) {
      setError("Both Access Password and Secret Key are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessPassword, secretKey }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message || "Invalid admin credentials."); return; }
      saveAuth(data.token, data.role);
      navigate("/");
    } catch {
      setError("Could not reach authentication server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setGuestLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/guest`, { method: "POST" });
      const data = await res.json();
      if (!data.success) { setError(data.message || "Failed to issue guest token."); return; }
      saveAuth(data.token, data.role);
      navigate("/");
    } catch {
      setError("Could not reach authentication server. Is the backend running?");
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: "linear-gradient(145deg, #f0f4ff 0%, #e8eeff 100%)" }}
    >
      {/* ── Injected keyframe styles ── */}
      <style>{cubeStyles}</style>

      {/* ── Decorative 3D Cubes ── */}

      {/* Top-left large cube */}
      <div
        className="cube-wrap absolute z-0"
        style={{ top: "4%", left: "3%", transform: "rotateX(52deg) rotateZ(25deg)" }}
      >
        <Cube className="cube-lg" />
      </div>

      {/* Top-left extra large ghost */}
      <div
        className="cube-wrap absolute z-0 hidden lg:block"
        style={{ top: "-6%", left: "12%", transform: "rotateX(52deg) rotateZ(28deg)", opacity: 0.35 }}
      >
        <Cube className="cube-xl" />
      </div>

      {/* Top-right medium */}
      <div
        className="cube-wrap absolute z-0"
        style={{ top: "6%", right: "5%", transform: "rotateX(50deg) rotateZ(-20deg)" }}
      >
        <Cube className="cube-md" />
      </div>

      {/* Top-right small */}
      <div
        className="cube-wrap absolute z-0"
        style={{ top: "22%", right: "14%", transform: "rotateX(55deg) rotateZ(40deg)", opacity: 0.6 }}
      >
        <Cube className="cube-sm" />
      </div>

      {/* Bottom-right large */}
      <div
        className="cube-wrap absolute z-0"
        style={{ bottom: "5%", right: "4%", transform: "rotateX(52deg) rotateZ(-25deg)" }}
      >
        <Cube className="cube-lg" />
      </div>

      {/* Bottom-left xl */}
      <div
        className="cube-wrap absolute z-0 hidden lg:block"
        style={{ bottom: "-4%", left: "2%", transform: "rotateX(52deg) rotateZ(22deg)", opacity: 0.45 }}
      >
        <Cube className="cube-xl" />
      </div>

      {/* Bottom-left small */}
      <div
        className="cube-wrap absolute z-0"
        style={{ bottom: "18%", left: "10%", transform: "rotateX(55deg) rotateZ(-40deg)", opacity: 0.55 }}
      >
        <Cube className="cube-sm" />
      </div>

      {/* Center content */}
      <div className="relative z-10 w-full max-w-md space-y-6">

        {/* ── Logo / Brand ── */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div
            className="p-4 rounded-2xl mb-1 shadow-lg"
            style={{ background: "linear-gradient(135deg, #1a3fc4, #4a6fe8)" }}
          >
            <Briefcase size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#0D1B4B] tracking-tight">HireMe</h1>
          <p className="text-sm font-medium text-slate-500">Enter your credentials to access the dashboard</p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-5 border border-slate-100">
          
          {/* Privacy warning */}
          <div className="flex flex-col items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-2">
            <div className="text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5">
              <Lock size={12} className="text-slate-400" /> Private & Personal Use Only
            </div>
            <p className="text-[11px] text-slate-400 max-w-[280px] leading-relaxed mx-auto text-center font-medium">
               This platform is exclusively owned and operated by the admin. Unauthorized access or use is not permitted.
            </p>
          </div>

          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock size={18} className="text-[#1a3fc4]" /> Admin Access
          </h2>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {/* Access Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Access Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={accessPassword}
                  onChange={(e) => setAccessPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#1a3fc4]/20 focus:border-[#1a3fc4] transition-all bg-slate-50"
                  placeholder="Enter access password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Secret Key */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Secret Key</label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#1a3fc4]/20 focus:border-[#1a3fc4] transition-all bg-slate-50"
                  placeholder="Enter secret key"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-600 text-sm px-3 py-2.5 rounded-xl border border-red-100">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
               type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-bold rounded-xl transition-all text-sm tracking-wide flex items-center justify-center shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #1a3fc4, #4a6fe8)" }}
            >
              {loading ? (
                <><Loader2 size={16} className="mr-2 animate-spin" />Verifying...</>
              ) : (
                "Unlock Dashboard"
              )}
            </button>
          </form>

          {/* OR divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Guest */}
          <button
            onClick={handleGuestLogin}
            disabled={guestLoading}
            className="w-full py-3 bg-slate-50 hover:bg-slate-100 disabled:opacity-60 text-slate-700 font-semibold rounded-xl transition-all flex items-center justify-center text-sm border border-slate-200 gap-2"
          >
            {guestLoading ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
            Continue as Guest
          </button>

          <p className="text-center text-[11px] text-slate-400">
            Guest mode provides read-only access. Admin credentials required for full control.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessGate;
