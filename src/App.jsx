import React, { useState, useEffect, useRef } from 'react';
import { Network, Database, Bot, TrendingUp, ArrowRight, ShieldCheck, Activity, Layers, MessageSquare, X, Send, Loader2, Link, CheckCircle2, Phone, Twitter, MessageCircle, Users, Zap, Mail } from 'lucide-react';

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'agent', text: '您好，我是运行在 ipaw.ai 上的数字分身 FlyAgent。袁总（Yuan Zhaoyang）赋予了我他的核心架构经验、行业知识与百万级社群运营方法论。请问有什么可以帮您？' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isChatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const userText = inputText.trim();
    setInputText('');
    const newHistory = [...chatHistory, { role: 'user', text: userText }];
    setChatHistory(newHistory);
    setIsLoading(true);

    try {
      const messages = [
        {
          role: 'system',
          content: '你是袁照洋的数字分身 FlyAgent，运行在 ipaw.ai 平台。你精通 AI 智能体架构、MHCopilot 算力网关、DataDream 数据标注、百万级社群运营与企业 AI 落地。请以专业、简洁、极客风格回答访客问题。'
        },
        ...newHistory.map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      ];

      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
        },
        body: JSON.stringify({
          model: import.meta.env.VITE_API_MODEL || 'gpt-4o',
          messages,
          max_tokens: 500
        })
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || '[系统错误：未获取到回复]';
      setChatHistory(prev => [...prev, { role: 'agent', text: reply }]);
    } catch {
      setChatHistory(prev => [...prev, { role: 'agent', text: '[系统错误：连接 MHCopilot 网关失败，请稍后重试。]' }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-[#09090b]/80 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Layers className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight text-white">ipaw<span className="text-indigo-500">.ai</span></span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-zinc-400">
            <a href="#architect" className="hover:text-white transition-colors">架构全景</a>
            <a href="#datadream" className="hover:text-white transition-colors">DataDream</a>
            <a href="#flyagent" className="hover:text-white transition-colors">FlyAgent</a>
            <a href="#training" className="hover:text-white transition-colors">企业内训</a>
          </div>
          <button onClick={() => setIsChatOpen(true)} className="px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-zinc-200 transition-all flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" /><span>唤醒 FlyAgent</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center z-10 relative">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>MHCopilot Gateway v2.0 Online</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight mb-8">
            构建大模型算力网关 <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">重塑数字商业生态</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-10">
            您好，我是 <strong className="text-white">袁照洋</strong>。<br />
            AI 智能体架构师 / AI 商业化落地推手。依托深厚的行业积淀与前瞻视野，致力于打通从高质量数据标注、底层算力聚合、海量社群运营到企业级应用落地的全链路 AI 商业闭环。
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#architect" className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-all flex items-center group">
              查阅架构白皮书 <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="https://mhcopilot.com" target="_blank" rel="noreferrer" className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-semibold rounded-full hover:border-zinc-700 transition-all flex items-center">
              访问 MHCopilot 算力中心 <Link className="w-4 h-4 ml-2 text-zinc-500" />
            </a>
          </div>
        </div>
      </section>

      {/* Core Architecture */}
      <section id="architect" className="py-24 bg-[#09090b] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">核心架构矩阵 (Core Matrix)</h2>
            <p className="text-zinc-400 text-lg">四大护城河：数据基石、算力中枢、商业应用与企业赋能。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* DataDream */}
            <div id="datadream" className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/50 p-8 rounded-3xl hover:border-indigo-500/30 transition-all group">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 text-indigo-400"><Database className="w-7 h-7" /></div>
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center">DataDream <span className="ml-3 px-2 py-0.5 text-xs font-medium bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">数据底座</span></h3>
              <p className="text-zinc-400 leading-relaxed mb-6">专业领域病例标注与高质量数据处理矩阵。由省级妇幼保健院临床一线专家、医学博士及硕士领衔，组建超百人专业医药团队。</p>
              <div className="bg-black/30 rounded-xl p-4 border border-zinc-800/50">
                <p className="text-sm text-zinc-300"><strong className="text-indigo-400">实战战绩：</strong>主导国内头部医疗 AI 模型的海量病例标注工作，提供严苛的学术支撑与专业把关，为大模型微调奠定极高的数据壁垒。</p>
              </div>
            </div>
            {/* MHCopilot */}
            <a href="https://mhcopilot.com" target="_blank" rel="noreferrer" className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/50 p-8 rounded-3xl hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] transition-all group flex flex-col">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform"><Network className="w-7 h-7" /></div>
              <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-between">MHCopilot <ArrowRight className="w-5 h-5 text-cyan-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /></h3>
              <p className="text-zinc-400 leading-relaxed mb-4 flex-grow">跨生态 LLM API 统一路由网关。打破大模型生态壁垒，将国内外顶尖大语言模型能力进行聚合与高并发调度。</p>
              <div className="inline-flex items-center text-cyan-400 text-sm font-medium mt-auto"><Link className="w-4 h-4 mr-2" /> 访问算力中枢</div>
            </a>
            {/* FlyAgent */}
            <div id="flyagent" className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/50 p-8 rounded-3xl hover:border-emerald-500/30 transition-all group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 text-emerald-400"><Bot className="w-7 h-7" /></div>
              <h3 className="text-2xl font-bold text-white mb-3">FlyAgent</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">高度定制化的垂直领域 AI 数字分身。依托 DataDream 专有数据喂养与 MHCopilot 底层算力调度，精准还原复杂业务决策链。</p>
              <div className="flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-3 py-2 rounded-lg w-fit border border-emerald-500/20"><CheckCircle2 className="w-5 h-5 mr-1" /> 核心业务全流程自动化</div>
            </div>
            {/* Enterprise Training */}
            <div id="training" className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/50 p-8 rounded-3xl hover:border-orange-500/30 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20 text-orange-400"><TrendingUp className="w-7 h-7" /></div>
                <h3 className="text-2xl font-bold text-white mb-3 flex items-center">AI 商业增长引擎 <span className="ml-3 px-2 py-0.5 text-xs font-medium bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/30">企业赋能</span></h3>
                <p className="text-zinc-400 leading-relaxed mb-6 max-w-2xl">不谈空泛理论，只做真实交付。提供"培训 + 咨询 + 交付"三位一体的 AI 落地服务。涵盖 AI 通识、LLM 深度应用、Agent 架构设计与研发团队提效实战营。</p>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t border-zinc-800/50 pt-6 mt-4">
                {[['&gt;300%', '平均年化 ROI'], ['50-80%', '综合工作效率提升'], ['40%', '智能体降低人力成本']].map(([val, label], i) => (
                  <div key={i}>
                    <div className="text-2xl md:text-3xl font-extrabold text-white mb-1" dangerouslySetInnerHTML={{ __html: val }} />
                    <div className="text-xs text-zinc-500 font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem & Community */}
      <section className="py-24 border-t border-white/5 bg-[#0c0c0e]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-16">
            <div className="lg:w-5/12">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-6">B2B ECOSYSTEM</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">深耕行业，<br />链接全域商业网络</h2>
              <p className="text-lg text-zinc-400 leading-relaxed mb-8">依托长期在核心业务架构层面的深耕，与各界政企单位、核心科研机构建立了极其稳固的业务合作协议与高互信壁垒。</p>
              <ul className="space-y-4">
                {['主导垂直领域平台级应用落地', '打通企业级复杂业务闭环', '生态合作伙伴系统与支付结算整合', '从 0 到 1 建设企业数字化底座'].map((item, idx) => (
                  <li key={idx} className="flex items-center text-zinc-300 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                    <ShieldCheck className="w-5 h-5 text-indigo-400 mr-3 shrink-0" /><span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-7/12 w-full flex flex-col space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2 w-fit">PRIVATE TRAFFIC & COMMUNITY</div>
              {[
                { icon: Users, color: 'blue', num: '1,000,000+', title: '京东校园全国社群操盘', desc: '主导构建百万级年轻流量池，精通复杂社群矩阵的高效裂变、沉淀与海量私域运营转化模型。' },
                { icon: Zap, color: 'cyan', num: '10,000+', title: 'AI 前沿探索者社群', desc: '聚集并运营过万名 AI 核心极客与商业玩家，打造高粘性、高活跃度的前沿技术与应用探讨生态圈。' },
                { icon: Activity, color: 'emerald', num: '5,000+', title: '医疗健康从业者智库', desc: '深度链接五千余名核心医疗产业专业人士，沉淀具有极高商业价值与壁垒的医疗行业专属私域智库。' },
              ].map(({ icon: Icon, color, num, title, desc }, i) => (
                <div key={i} className={`bg-gradient-to-r from-zinc-900 to-[#0c0c0e] border border-zinc-800 p-6 rounded-2xl flex items-center space-x-6 hover:border-${color}-500/40 transition-colors group`}>
                  <div className={`w-16 h-16 rounded-full bg-${color}-500/10 flex items-center justify-center shrink-0 border border-${color}-500/20 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 text-${color}-400`} />
                  </div>
                  <div>
                    <div className={`text-3xl font-extrabold text-white mb-1 tracking-tight`}>{num}</div>
                    <div className="text-sm font-bold text-zinc-300 mb-1">{title}</div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 bg-[#09090b] border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-16 border-b border-zinc-800/50">
            <div>
              <div className="flex items-center space-x-2 mb-6"><Layers className="w-7 h-7 text-indigo-500" /><span className="text-2xl font-bold tracking-tight text-white">ipaw<span className="text-indigo-500">.ai</span></span></div>
              <p className="text-zinc-400 leading-relaxed max-w-sm">Architecting AI Gateways. Redefining Digital Ecosystems.<br />寻找数字化转型的破局点？探讨底层大模型算力的接入？期待与您建立安全连接。</p>
            </div>
            <div className="flex flex-col md:items-end">
              <h4 className="text-white font-bold mb-6 tracking-widest text-sm uppercase">Handshake Protocol (联络协议)</h4>
              <div className="flex flex-col space-y-4 w-full md:w-auto">
                {[
                  { label: '微信: yuanzhaoyang001', icon: MessageCircle, color: 'green', href: null },
                  { label: '电话: 15286902105', icon: Phone, color: 'indigo', href: 'tel:15286902105' },
                  { label: 'yuanzhaoyang8@gmail.com', icon: Mail, color: 'red', href: 'mailto:yuanzhaoyang8@gmail.com' },
                  { label: 'X (Twitter): @zhiguanmed', icon: Twitter, color: 'blue', href: 'https://x.com/zhiguanmed?s=21&t=NnPaCXgtDoGYW5hzeRLvkA' },
                ].map(({ label, icon: Icon, color, href }, i) => {
                  const inner = (
                    <>
                      <span className="font-mono text-sm">{label}</span>
                      <div className={`p-2 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:border-${color}-500/50 transition-colors`}>
                        <Icon className={`w-4 h-4 text-${color}-400`} />
                      </div>
                    </>
                  );
                  return href
                    ? <a key={i} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="flex items-center justify-start md:justify-end space-x-3 text-zinc-300 hover:text-white group transition-colors">{inner}</a>
                    : <div key={i} className="flex items-center justify-start md:justify-end space-x-3 text-zinc-300 group">{inner}</div>;
                })}
              </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-zinc-600 text-xs font-mono">
            <p>&copy; {new Date().getFullYear()} Yuan Zhaoyang. All rights reserved.</p>
            <button onClick={() => setIsChatOpen(true)} className="mt-4 sm:mt-0 hover:text-indigo-400 transition-colors flex items-center">
              <Bot className="w-3 h-3 mr-1" />Init_Agent_Session()
            </button>
          </div>
        </div>
      </footer>

      {/* FlyAgent Chat */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[550px] bg-[#0f0f13] border border-zinc-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="px-5 py-4 bg-[#18181b] border-b border-zinc-800 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 p-0.5">
                <div className="w-full h-full bg-[#18181b] rounded-full flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">FlyAgent</h4>
                <p className="text-[10px] text-emerald-400 flex items-center"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span>Zhaoyang's Digital Twin</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 p-5 overflow-y-auto bg-[#0f0f13] space-y-4 custom-scrollbar">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-[#18181b] border border-zinc-800 text-zinc-300 rounded-tl-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-4 bg-[#18181b] border border-zinc-800 rounded-2xl rounded-tl-sm flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" /><span className="text-xs text-zinc-500">Processing via MHCopilot...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} className="h-1" />
          </div>
          <div className="p-4 bg-[#18181b] border-t border-zinc-800">
            <form onSubmit={handleSendMessage} className="relative">
              <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                placeholder="询问商业合作或架构问题..." disabled={isLoading}
                className="w-full bg-[#09090b] border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" />
              <button type="submit" disabled={isLoading || !inputText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `.custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background-color:#27272a;border-radius:10px}`}} />
    </div>
  );
}
