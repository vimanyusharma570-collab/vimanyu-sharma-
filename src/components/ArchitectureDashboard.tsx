import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, 
  Database, 
  Cpu, 
  Activity, 
  Shield, 
  Zap, 
  Layers, 
  GitBranch, 
  Cloud, 
  Search,
  MessageSquare,
  ChevronRight,
  Terminal,
  Code,
  Box,
  Globe,
  Lock,
  BarChart3,
  RefreshCw,
  Workflow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import Markdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";

// --- Types & Constants ---

interface ServiceCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  tags: string[];
}

const GCP_SERVICES = [
  { name: "Vertex AI", category: "AI/ML", desc: "Gemini 3.1 Pro, Model Garden, Pipelines" },
  { name: "Cloud Run", category: "Compute", desc: "Serverless microservices" },
  { name: "BigQuery", category: "Data", desc: "Data warehouse & analytics" },
  { name: "Cloud Pub/Sub", category: "Messaging", desc: "Event-driven architecture" },
  { name: "Cloud Storage", category: "Storage", desc: "Unstructured data lake" },
  { name: "Cloud Monitoring", category: "Operations", desc: "AIOps & Observability" }
];

const MICROSERVICES = [
  {
    title: "Agent Orchestrator",
    icon: <Cpu className="w-5 h-5" />,
    description: "The core reasoning engine using Gemini 1.5 Pro with function calling for tool orchestration.",
    tags: ["Node.js", "Gemini", "LangChain"]
  },
  {
    title: "Ingestion Engine",
    icon: <Layers className="w-5 h-5" />,
    description: "Multi-modal data processing (PDF, Images, Audio) using Vision and Speech-to-Text APIs.",
    tags: ["Python", "Cloud Run", "Vision API"]
  },
  {
    title: "Knowledge Graph API",
    icon: <Database className="w-5 h-5" />,
    description: "Graph-based retrieval service connecting entities and relationships for RAG grounding.",
    tags: ["Neo4j", "Vertex AI Search", "GraphQL"]
  },
  {
    title: "AIOps Monitor",
    icon: <Activity className="w-5 h-5" />,
    description: "Real-time anomaly detection in system logs and model performance metrics.",
    tags: ["BigQuery ML", "Cloud Logging"]
  }
];

// --- Components ---

const ServiceCard: React.FC<ServiceCardProps> = ({ title, icon, description, tags }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl hover:border-emerald-500/50 transition-all group"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold text-zinc-100">{title}</h3>
    </div>
    <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
      {description}
    </p>
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
          {tag}
        </span>
      ))}
    </div>
  </motion.div>
);

const PipelineStep: React.FC<{ title: string; icon: React.ReactNode; active?: boolean }> = ({ title, icon, active }) => (
  <div className="flex flex-col items-center gap-2 relative group">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
      active ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-500'
    }`}>
      {icon}
    </div>
    <span className={`text-[10px] font-mono uppercase tracking-tighter text-center max-w-[80px] ${active ? 'text-emerald-400' : 'text-zinc-500'}`}>
      {title}
    </span>
  </div>
);

const ArchitectureDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pipelines' | 'tech' | 'agent'>('overview');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: "You are a Senior System Architect specializing in Google Cloud and Agentic AI. You are explaining the 'Nexus' architecture: a multi-modal research assistant using Gemini 3.1 Pro, Vertex AI, and Cloud Run. Be technical, precise, and professional. Use markdown for structure.",
        }
      });
      
      setChatHistory(prev => [...prev, { role: 'bot', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'bot', text: "Error connecting to the architect's brain. Please check your API key." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* --- Sidebar Navigation --- */}
      <nav className="fixed left-0 top-0 h-full w-16 md:w-64 border-r border-zinc-800 bg-zinc-950/50 backdrop-blur-xl z-50 flex flex-col">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-zinc-950 font-bold">N</div>
          <span className="hidden md:block font-bold tracking-tight text-lg">NEXUS ARCHITECT</span>
        </div>
        
        <div className="flex-1 py-6 px-3 space-y-2">
          {[
            { id: 'overview', label: 'Architecture Overview', icon: <Layers className="w-5 h-5" /> },
            { id: 'pipelines', label: 'DevOps & MLOps', icon: <Workflow className="w-5 h-5" /> },
            { id: 'tech', label: 'Tech Stack', icon: <Box className="w-5 h-5" /> },
            { id: 'agent', label: 'Ask the Architect', icon: <MessageSquare className="w-5 h-5" /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === item.id 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              {item.icon}
              <span className="hidden md:block text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-zinc-800">
          <div className="hidden md:flex items-center gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">System Online</span>
          </div>
        </div>
      </nav>

      {/* --- Main Content --- */}
      <main className="pl-16 md:pl-64 min-h-screen">
        <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <Globe className="w-3 h-3" />
            <span>Global Infrastructure / GCP-US-CENTRAL1</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Enterprise Secure</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">System Architecture</h1>
                    <p className="text-zinc-400 max-w-2xl">
                      Nexus is an agentic multi-modal research assistant designed for high-scale enterprise intelligence. 
                      It orchestrates deep learning models with real-time data grounding.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl min-w-[120px]">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Latency</div>
                      <div className="text-2xl font-bold text-emerald-400">124ms</div>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl min-w-[120px]">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Uptime</div>
                      <div className="text-2xl font-bold text-emerald-400">99.99%</div>
                    </div>
                  </div>
                </div>

                {/* --- Visual Flow --- */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700">
                        <Globe className="w-8 h-8 text-zinc-400" />
                      </div>
                      <span className="text-xs font-mono text-zinc-500 uppercase">User Client</span>
                    </div>
                    <ChevronRight className="hidden md:block w-6 h-6 text-zinc-700" />
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 bg-emerald-500/20 rounded-3xl flex items-center justify-center border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <Cpu className="w-10 h-10 text-emerald-400" />
                      </div>
                      <span className="text-xs font-mono text-emerald-400 uppercase font-bold">Agentic Core</span>
                    </div>
                    <ChevronRight className="hidden md:block w-6 h-6 text-zinc-700" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 flex flex-col items-center gap-2">
                        <Search className="w-5 h-5 text-zinc-400" />
                        <span className="text-[10px] uppercase font-mono text-zinc-500">Search Tool</span>
                      </div>
                      <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 flex flex-col items-center gap-2">
                        <Database className="w-5 h-5 text-zinc-400" />
                        <span className="text-[10px] uppercase font-mono text-zinc-500">Vector DB</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {MICROSERVICES.map(service => (
                    <ServiceCard key={service.title} {...service} />
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'pipelines' && (
              <motion.div 
                key="pipelines"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 text-emerald-400" />
                    MLOps & Data Pipeline
                  </h2>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-10 flex flex-wrap justify-center md:justify-between items-center gap-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-800 -translate-y-1/2 hidden md:block" />
                    <PipelineStep title="Ingest" icon={<Layers className="w-6 h-6" />} active />
                    <PipelineStep title="Validate" icon={<Shield className="w-6 h-6" />} active />
                    <PipelineStep title="Train/Tune" icon={<Cpu className="w-6 h-6" />} active />
                    <PipelineStep title="Evaluate" icon={<BarChart3 className="w-6 h-6" />} active />
                    <PipelineStep title="Deploy" icon={<Cloud className="w-6 h-6" />} active />
                    <PipelineStep title="Monitor" icon={<Activity className="w-6 h-6" />} />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <GitBranch className="w-6 h-6 text-emerald-400" />
                    DevOps CI/CD Flow
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-zinc-800 rounded-lg"><Code className="w-5 h-5" /></div>
                        <h3 className="font-bold">Build Phase</h3>
                      </div>
                      <ul className="space-y-3 text-sm text-zinc-400">
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> GitHub Actions Trigger</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Cloud Build Execution</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Artifact Registry Push</li>
                      </ul>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-zinc-800 rounded-lg"><Zap className="w-5 h-5" /></div>
                        <h3 className="font-bold">Deploy Phase</h3>
                      </div>
                      <ul className="space-y-3 text-sm text-zinc-400">
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Cloud Run Revision</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Traffic Splitting (Canary)</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Secret Manager Injection</li>
                      </ul>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-zinc-800 rounded-lg"><Activity className="w-5 h-5" /></div>
                        <h3 className="font-bold">AIOps Phase</h3>
                      </div>
                      <ul className="space-y-3 text-sm text-zinc-400">
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Log Analytics (BigQuery)</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Error Reporting Alerts</li>
                        <li className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Auto-scaling Metrics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tech' && (
              <motion.div 
                key="tech"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Cloud className="w-6 h-6 text-emerald-400" />
                    Google Cloud Infrastructure
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {GCP_SERVICES.map(service => (
                      <div key={service.name} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-colors">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-zinc-100">{service.name}</h4>
                            <span className="text-[10px] font-mono bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">{service.category}</span>
                          </div>
                          <p className="text-xs text-zinc-500">{service.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Terminal className="w-6 h-6 text-emerald-400" />
                    Core Tech Stack
                  </h2>
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-8">
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 uppercase mb-4">Frontend</h4>
                      <div className="flex flex-wrap gap-3">
                        {['React 19', 'TypeScript', 'Tailwind CSS', 'Motion', 'Recharts'].map(t => (
                          <span key={t} className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs font-medium">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 uppercase mb-4">Backend & AI</h4>
                      <div className="flex flex-wrap gap-3">
                        {['Node.js', 'Express', 'Gemini 3.1 Pro', 'Vertex AI SDK', 'D3.js'].map(t => (
                          <span key={t} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-mono text-zinc-500 uppercase mb-4">Security</h4>
                      <div className="flex flex-wrap gap-3">
                        {['IAM', 'VPC Service Controls', 'Cloud Armor', 'Secret Manager'].map(t => (
                          <span key={t} className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs font-medium">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'agent' && (
              <motion.div 
                key="agent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-[calc(100vh-12rem)] flex flex-col bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-zinc-950">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold">Nexus Architect AI</h3>
                      <p className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Expert System Online</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <div className="w-2 h-2 bg-emerald-500/50 rounded-full" />
                    <div className="w-2 h-2 bg-emerald-500/20 rounded-full" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
                  {chatHistory.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                      <MessageSquare className="w-12 h-12" />
                      <div>
                        <p className="font-medium">Ask me anything about the Nexus architecture.</p>
                        <p className="text-xs">How does scalability work? What GCP services are used?</p>
                      </div>
                    </div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-emerald-600 text-white rounded-tr-none' 
                          : 'bg-zinc-800 text-zinc-100 rounded-tl-none border border-zinc-700'
                      }`}>
                        <div className="prose prose-invert prose-sm max-w-none">
                          <Markdown>{msg.text}</Markdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none border border-zinc-700 flex gap-1">
                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-6 border-t border-zinc-800 bg-zinc-900/80">
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleChat(); }}
                    className="flex gap-4"
                  >
                    <input 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask the architect..."
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button 
                      type="submit"
                      disabled={isTyping || !chatInput.trim()}
                      className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-zinc-950 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- Global Styles --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}} />
    </div>
  );
};

export default ArchitectureDashboard;
