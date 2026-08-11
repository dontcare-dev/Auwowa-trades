'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AuroraTrades() {
  const [user, setUser] = useState(null); const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); const [plan, setPlan] = useState('free');
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [authError, setAuthError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); if(session) fetchData(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); if(session) fetchData(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async (id) => {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if(!error && data) { setUser(data); setPlan(data.plan || 'free'); }
  };

  const handleAuth = async (isLogin) => {
    setAuthError('');
    const result = isLogin ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password });
    if(result.error) setAuthError(result.error.message);
    else if(!isLogin && result.data.user) {
      await supabase.from('users').insert([{ id: result.data.user.id, email, plan: 'free', trades: [], accounts: [] }]);
    }
  };

  if (!session) {
    return (<div className="min-h-screen flex items-center justify-center bg-[#050507]" style={{backgroundImage:"url('https://i.ibb.co/DZ62tjL/eb93f90b67e0022291381d4f429e4905.jpg')", backgroundSize:'cover'}}>
      <div className="glass-card p-8 rounded-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Aurora Trades</h2>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="auth-input w-full px-4 py-2.5 rounded-lg text-white text-sm mb-3" />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="auth-input w-full px-4 py-2.5 rounded-lg text-white text-sm mb-3" />
        <button onClick={()=>handleAuth(true)} className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-lg mb-3">Login</button>
        <button onClick={()=>handleAuth(false)} className="w-full py-2.5 bg-transparent border border-gray-700 text-white font-bold rounded-lg">Register</button>
        {authError && <p className="text-red-400 text-xs text-center mt-2">{authError}</p>}
      </div>
    </div>);
  }

  return (<div className="flex flex-col md:flex-row min-h-screen">
    <aside className="hidden md:flex fixed md:static z-50 w-64 h-full bg-[#121215]/80 border-r border-[#2a2a2e] p-4 flex-col">
      <div className="text-white font-bold text-lg mb-8">Aurora Trades</div>
      <nav className="flex flex-col gap-2 flex-1"> {['dashboard'].map(t => (<div key={t} onClick={()=>setActiveTab(t)} className="flex items-center px-3 py-2 rounded-lg cursor-pointer text-gray-400 hover:text-white">{t.charAt(0).toUpperCase()+t.slice(1)}</div>))}
        <div onClick={()=>{supabase.auth.signOut();setSession(null);}} className="text-red-400 hover:text-red-300 cursor-pointer mt-auto px-3 py-2">Logout</div>
      </nav>
    </aside>
    <main className="flex-1 p-4 md:p-8 w-full h-screen overflow-y-auto">
      <header className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold text-white capitalize">{activeTab}</h1></header>
      <div className="glass-card p-6 rounded-xl"><h3 className="text-sm font-semibold text-white mb-4">Welcome, {user?.email}</h3><p className="text-gray-400 text-sm">You are securely authenticated via Supabase. Your current plan: <span className="text-indigo-400 font-bold">{plan.toUpperCase()}</span></p></div>
    </main>
  </div>);
}
