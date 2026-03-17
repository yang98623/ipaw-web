import React, { useState, useEffect, useRef } from 'react';
// App.css intentionally left empty - using Tailwind via CDN
import { Terminal, Cpu, Globe, Database, Github, Mail, ArrowUpRight, Bot, ShieldCheck, Send, Loader2, Activity, BookOpen, Layers, Box, BarChart, Calendar, TerminalSquare } from 'lucide-react';

export default function App() {
  const [terminalText, setTerminalText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const fullText = `> ssh visitor@ipaw.ai\n> Authenticating... Success.\n> Booting ipaw.ai core engine...\n> [INFO] Kernel: Rust/WebAssembly\n> [INFO] Agent Matrix: Online\n> \n> Hello, World. I am Yuan Zhaoyang.\n> Welcome to my Intelligent Personal Agent Workspace.`;

  useEffect(() => {
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < fullText.length) {
        setTerminalText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingEffect);
        setTimeout(() => setIsInteracting(true), 1200);
      }
    }, 30);
    const cursorEffect = setInterval(() => setShowCursor(prev => !prev), 500);
    return () => { clearInterval(typingEffect); clearInterval(cursorEffect); };
  }, []);

  useEffect(() => {
    if (isInteracting && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isInteracting, isLoading]);

  const generateContent = async (userMessage, history) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const url = `${import.meta.env.VITE_GEMINI_API_URL}?key=${apiKey}`;
    const systemPrompt = "你是袁照洋的数字孪生智能体 (Agent Zhaoyang)。你运行在 ipaw.ai 平台上，底层由 Rust 和 WebAssembly 驱动。你精通多智能体协同 (Agentic Workflow, LangGraph, AutoGen)、知识引擎 (RAG, Qdrant) 以及全栈工程化。请以极客、专业且友好的口吻回答访客的问题。尽量保持回复简短精炼，符合极客终端命令行的交流风格。";
    let fullPrompt = history.map(msg => `${msg.role === 'user' ? 'Visitor' : 'Zhaoyang'}: ${msg.text}`).join('\n');
    fullPrompt += `\nVisitor: ${userMessage}\nZhaoyang:`;
    const payload = {
      contents: [{ parts: [{ text: fullPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < 6; i++) {
      try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "[系统提示：未生成有效回复]";
      } catch (error) {
        if (i === 5) return "[系统错误：与 ipaw.ai 核心底层引擎的连接超时，请稍后重试。]";
        await new Promise(resolve => setTimeout(resolve, delays[i]));
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const currentInput = inputText.trim();
    setInputText('');
    setChatHistory(prev => [...prev, { role: 'user', text: currentInput }]);
    setIsLoading(true);
    const agentResponse = await generateContent(currentInput, chatHistory);
    setChatHistory(prev => [...prev, { role: 'agent', text: agentResponse }]);
    setIsLoading(false);
  };

  const handleFocusChat = () => {
    if (isInteracting && inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-300 font-sans selection:bg-emerald-900 selection:text-emerald-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0f1a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Globe className="w-6 h-6 text-emerald-400" />
            <span className="text-xl font-bold tracking-widest text-white">ipaw<span className="text-emerald-400">.ai</span></span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-mono text-slate-400">
            <a href="#about" className="hover:text-emerald-400 transition-colors">~/about</a>
            <a href="#agents" className="hover:text-emerald-400 transition-colors">~/agents</a>
            <a href="#logs" className="hover:text-emerald-400 transition-colors">~/logs</a>
          </div>
          <button className="px-4 py-2 text-xs font-mono border border-emerald-500/30 text-emerald-400 rounded hover:bg-emerald-950/50 transition-all flex items-center space-x-2">
            <Terminal className="w-4 h-4" /><span>Connect_WS()</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between min-h-[90vh]">
        <div className="lg:w-1/2 space-y-8 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-emerald-950/20 border border-emerald-900/50 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>RUST_WASM_ENGINE_ACTIVE</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            架构下一代 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">自主智能体</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
            您好，我是 <strong className="text-slate-200">袁照洋</strong>。<br />
            这里是 <strong>ipaw.ai</strong>，我的数字孪生空间与硬核技术试验场。致力于通过 Rust 与大模型技术，构建具备极致性能与认知能力的 Agent 矩阵。
          </p>
          <div className="flex space-x-4 pt-4 font-mono text-sm">
            <button onClick={handleFocusChat} className={`px-6 py-3 font-bold rounded transition-colors flex items-center space-x-2 ${isInteracting ? 'bg-emerald-500 hover:bg-emerald-400 text-[#0a0f1a]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
              <Bot className="w-5 h-5" />
              <span>{isInteracting ? '> ./chat_with_zhaoyang' : '> System Booting...'}</span>
            </button>
            <button className="px-6 py-3 border border-slate-700 hover:border-emerald-500/50 hover:text-emerald-400 rounded transition-colors flex items-center space-x-2 group">
              <span>View Source</span><Github className="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* Terminal Window */}
        <div className="lg:w-5/12 w-full mt-16 lg:mt-0 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-xl blur opacity-20 transition duration-1000"></div>
          <div className="relative bg-[#0d1322] rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[420px]">
            <div className="flex items-center px-4 py-2 bg-[#151e32] border-b border-slate-800 shrink-0">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto text-xs text-slate-500 font-mono flex items-center">
                <Globe className="w-3 h-3 mr-2 text-emerald-500" />
                {isInteracting ? 'zhaoyang_agent@ipaw.ai:~' : 'visitor@ipaw.ai:~'}
              </div>
            </div>
            <div className="flex-1 p-5 font-mono text-sm bg-[#080c16] shadow-inner flex flex-col overflow-hidden">
              {!isInteracting ? (
                <div className="text-emerald-400 whitespace-pre-wrap leading-relaxed h-full">
                  {terminalText}<span className={`${showCursor ? 'opacity-100' : 'opacity-0'} font-bold`}>_</span>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar pb-4">
                    <div className="text-emerald-500/50 text-xs mb-4 text-center border-b border-emerald-900/30 pb-2">-- Secure Neural Link Established. Agent Online. --</div>
                    {chatHistory.length === 0 && (
                      <div className="text-emerald-600/60 text-xs text-center mt-10">您可以向数字分身询问关于 ipaw.ai 架构、Rust 或多智能体系统的问题。</div>
                    )}
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 mb-1 uppercase tracking-wider">
                          {msg.role === 'user' ? (<><span>Guest</span><Cpu className="w-3 h-3 text-emerald-700" /></>) : (<><Bot className="w-3 h-3 text-emerald-400" /><span>Agent</span></>)}
                        </div>
                        <div className={`p-3 rounded-lg max-w-[90%] whitespace-pre-wrap leading-relaxed ${msg.role === 'user' ? 'bg-emerald-950/40 text-emerald-100 border border-emerald-900/50 rounded-tr-sm' : 'bg-[#121927] text-emerald-300 border border-slate-800/80 rounded-tl-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-start flex-col">
                        <div className="flex items-center space-x-2 text-[10px] text-slate-500 mb-1 uppercase tracking-wider">
                          <Bot className="w-3 h-3 text-emerald-400" /><span>Agent</span>
                        </div>
                        <div className="p-3 bg-[#121927] border border-slate-800/80 rounded-lg rounded-tl-sm flex items-center space-x-2 text-emerald-500/70">
                          <Loader2 className="w-4 h-4 animate-spin" /><span className="text-xs">Processing via LLM Core...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} className="h-1" />
                  </div>
                  <form onSubmit={handleSendMessage} className="mt-2 shrink-0 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">&gt;</span>
                    <input ref={inputRef} type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                      placeholder="发送指令或开始对话..." disabled={isLoading}
                      className="w-full bg-[#0a0f1a] border border-emerald-900/60 rounded-md pl-8 pr-12 py-3 text-emerald-100 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/50 transition-all disabled:opacity-50" />
                    <button type="submit" disabled={isLoading || !inputText.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-500 hover:text-emerald-300 disabled:opacity-30 transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="about" className="py-24 bg-[#0d1322] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center"><Cpu className="w-8 h-8 mr-3 text-emerald-400" />硬核技术栈 (Core Stack)</h2>
            <p className="text-slate-500 font-mono text-sm">ipaw.ai 基础设施参数</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0a0f1a] border border-slate-800 p-8 rounded-xl hover:border-emerald-500/30 transition-colors group">
              <ShieldCheck className="w-8 h-8 text-orange-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-200 mb-3">Rust & Wasm</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">追求极致的内存安全与零成本抽象。使用 Rust 编写高性能 Agent 网关，并编译为 WebAssembly 驱动前端极速交互。</p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-orange-400/80">
                <span className="px-2 py-1 bg-orange-950/30 rounded border border-orange-900/50">Axum</span>
                <span className="px-2 py-1 bg-orange-950/30 rounded border border-orange-900/50">Dioxus</span>
                <span className="px-2 py-1 bg-orange-950/30 rounded border border-orange-900/50">Tokio</span>
              </div>
            </div>
            <div className="bg-[#0a0f1a] border border-slate-800 p-8 rounded-xl hover:border-cyan-500/30 transition-colors group">
              <Bot className="w-8 h-8 text-cyan-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-200 mb-3">多智能体架构</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">深度研究 Agentic Workflow，擅长利用大模型推理能力构建具备反思、规划与工具调用能力的多角色系统。</p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-cyan-400/80">
                <span className="px-2 py-1 bg-cyan-950/30 rounded border border-cyan-900/50">LangGraph</span>
                <span className="px-2 py-1 bg-cyan-950/30 rounded border border-cyan-900/50">AutoGen</span>
              </div>
            </div>
            <div className="bg-[#0a0f1a] border border-slate-800 p-8 rounded-xl hover:border-purple-500/30 transition-colors group">
              <Database className="w-8 h-8 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-slate-200 mb-3">知识引擎与 RAG</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">设计高并发、低延迟的向量检索增强生成系统，将海量非结构化数据转化为数字生命的核心记忆库。</p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-purple-400/80">
                <span className="px-2 py-1 bg-purple-950/30 rounded border border-purple-900/50">Qdrant</span>
                <span className="px-2 py-1 bg-purple-950/30 rounded border border-purple-900/50">Vector Search</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Lab */}
      <section id="agents" className="py-24 bg-[#0a0f1a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center"><Layers className="w-8 h-8 mr-3 text-cyan-400" />Agent 实验室 (Lab)</h2>
              <p className="text-slate-500 font-mono text-sm">Deployment.Instances.List()</p>
            </div>
            <button className="text-sm font-mono text-cyan-400 hover:text-cyan-300 flex items-center border border-cyan-900/50 bg-cyan-950/20 px-4 py-2 rounded transition-colors">查看 GitHub 仓库 <ArrowUpRight className="w-4 h-4 ml-1" /></button>
          </div>
          <div className="space-y-8">
            <div className="group relative bg-[#0d1322] border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 md:p-8 transition-all overflow-hidden flex flex-col md:flex-row items-center gap-8">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="md:w-1/3 w-full bg-[#0a0f1a] rounded-xl aspect-video border border-slate-800 flex items-center justify-center overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors z-10"></div>
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-500/50 animate-[spin_10s_linear_infinite] flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-blue-400/50 animate-[spin_5s_linear_infinite_reverse]"></div>
                  <BarChart className="w-5 h-5 absolute text-cyan-400" />
                </div>
              </div>
              <div className="md:w-2/3 w-full flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="px-2 py-1 bg-cyan-950/50 text-cyan-400 text-xs font-mono rounded border border-cyan-800/50 flex items-center"><Activity className="w-3 h-3 mr-1" /> Online</span>
                    <span className="text-slate-500 text-xs font-mono">v2.1.0 • Rust Backend</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Omni-Data Analyst</h3>
                  <p className="text-slate-400 mb-6 text-sm leading-relaxed">一个完全自主的数据分析智能体系统。用户只需上传 CSV/Excel 文件或连接 SQL 数据库，Agent 矩阵将自动进行数据清洗、多维分析，并生成交互式可视化报告与深度业务洞察。基于 LangGraph 实现复杂状态流转。</p>
                </div>
                <div className="mt-auto flex items-center space-x-6">
                  <a href="#" className="text-sm font-medium text-white hover:text-cyan-400 flex items-center group/link">Launch Instance <ArrowUpRight className="w-4 h-4 ml-1 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" /></a>
                  <a href="#" className="text-sm text-slate-500 hover:text-white flex items-center transition-colors"><Github className="w-4 h-4 mr-1" /> Source</a>
                </div>
              </div>
            </div>
            <div className="group relative bg-[#0d1322] border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 md:p-8 transition-all overflow-hidden flex flex-col md:flex-row items-center gap-8">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="md:w-1/3 w-full bg-[#0a0f1a] rounded-xl aspect-video border border-slate-800 flex items-center justify-center overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors z-10"></div>
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(9)].map((_, i) => (<div key={i} className="w-4 h-4 bg-purple-500/30 rounded-sm" style={{ animation: `pulse ${2 + i * 0.2}s infinite` }}></div>))}
                </div>
              </div>
              <div className="md:w-2/3 w-full flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="px-2 py-1 bg-purple-950/50 text-purple-400 text-xs font-mono rounded border border-purple-800/50 flex items-center"><Box className="w-3 h-3 mr-1" /> AutoGen</span>
                    <span className="text-slate-500 text-xs font-mono">Experimental • Wasm UI</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">AutoCode Weaver</h3>
                  <p className="text-slate-400 mb-6 text-sm leading-relaxed">基于多角色协同（产品经理、架构师、程序员、测试员 Agent）的自动化软件工程框架。支持通过自然语言对话，自动拆解需求并生成包含前后端代码、Docker 配置及测试用例的完整项目结构。</p>
                </div>
                <div className="mt-auto flex items-center space-x-6">
                  <a href="#" className="text-sm font-medium text-white hover:text-purple-400 flex items-center group/link">Read Architecture Docs <ArrowUpRight className="w-4 h-4 ml-1 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Logs */}
      <section id="logs" className="py-24 bg-[#0d1322] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center"><TerminalSquare className="w-8 h-8 mr-3 text-emerald-400" />系统日志 (System Logs)</h2>
            <p className="text-slate-500 font-mono text-sm">Cognitive.Updates.Read() - 认知迭代与技术沉淀</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { date: '2026-03-12', read: '15 min read', color: 'emerald', title: 'Rust 异步在 LLM 流式输出中的性能优化实践', desc: '深度解析如何使用 Tokio 和 Axum 构建极低延迟的 SSE 与 WebSocket 网关，解决大模型生成过程中的高并发连接保持问题。' },
              { date: '2026-02-28', read: '22 min read', color: 'cyan', title: '多智能体协同 (Multi-Agent) 中的记忆管理与反思机制', desc: '探讨长期记忆与短期工作记忆的向量化存储方案，以及如何设计让 Agent 能够"自我纠错"的 Reflection Prompt 架构。' },
              { date: '2026-01-15', read: '18 min read', color: 'purple', title: '从 LangChain 到自研 Agent 网关：极客架构演进之路', desc: '为什么在生产环境中放弃了臃肿的 Python 框架？本文复盘了我如何用 Rust 从零开始手搓高定制化的轻量级 Agent 编排引擎。' },
            ].map((article, i) => (
              <article key={i} className={`bg-[#0a0f1a] border border-slate-800 rounded-xl p-6 hover:border-${article.color}-500/30 transition-colors group cursor-pointer flex flex-col h-full`}>
                <div className={`flex items-center space-x-2 text-xs font-mono text-${article.color}-500/70 mb-4`}>
                  <Calendar className="w-3 h-3" /><span>{article.date}</span><span>•</span><span>{article.read}</span>
                </div>
                <h3 className={`text-lg font-bold text-slate-200 mb-3 group-hover:text-${article.color}-400 transition-colors line-clamp-2`}>{article.title}</h3>
                <p className="text-sm text-slate-400 mb-6 line-clamp-3 leading-relaxed flex-grow">{article.desc}</p>
                <div className={`flex items-center text-${article.color}-500 text-sm font-medium mt-auto`}>
                  <BookOpen className="w-4 h-4 mr-2" /> Read Log
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#0a0f1a] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-slate-800/50">
            {[
              { val: '99.9%', label: 'Gateway Uptime', color: 'emerald' },
              { val: '12+', label: 'Active Agent Clusters', color: 'cyan' },
              { val: '1.5M', label: 'Vector Embeddings', color: 'purple' },
              { val: '~45ms', label: 'Avg Rust API Latency', color: 'orange' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4">
                <span className="text-3xl font-bold text-white mb-1 tracking-tight">{s.val}</span>
                <span className={`text-xs font-mono text-${s.color}-500 uppercase tracking-wider`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0a0f1a] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex items-center space-x-2">
            <Globe className="w-5 h-5 text-emerald-500" />
            <span className="text-lg font-bold text-white tracking-widest">ipaw<span className="text-emerald-500">.ai</span></span>
          </div>
          <div className="text-slate-500 text-sm font-mono flex items-center space-x-6">
            <span>Powered by Rust & AI Agents</span>
            <a href="#" className="hover:text-emerald-400 transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="hover:text-emerald-400 transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `.custom-scrollbar::-webkit-scrollbar{width:6px}.custom-scrollbar::-webkit-scrollbar-track{background:transparent}.custom-scrollbar::-webkit-scrollbar-thumb{background-color:rgba(16,185,129,0.2);border-radius:10px}.custom-scrollbar::-webkit-scrollbar-thumb:hover{background-color:rgba(16,185,129,0.4)}`}} />
    </div>
  );
}
