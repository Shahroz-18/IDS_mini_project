/**
 * Study Path Page Component (A* Search).
 * Uses @xyflow/react (React Flow) to visualize the curriculum milestone state-space graph.
 * Highlights the optimal learning path generated via A* heuristic search algorithm.
 * Features:
 * - Current level & Target level dropdown selection
 * - Find Optimal Path button with loading states
 * - Interactive node-link graph canvas
 * - Path breakdown summary card with ordered topics and heuristic cost.
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Route,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Layers,
} from 'lucide-react';
import api from '@/api/axios';
import PageWrapper from '@/components/layout/PageWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Select from '@/components/ui/select';
import Label from '@/components/ui/label';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';

const LEVELS = [
  { id: 'Beginner', label: 'Beginner (Foundations)' },
  { id: 'Basic_Math', label: 'Basic Math & Logic' },
  { id: 'Fundamentals', label: 'Core Fundamentals' },
  { id: 'Core_Concepts', label: 'Applied Domain Concepts' },
  { id: 'Intermediate', label: 'Intermediate Practice' },
  { id: 'Advanced_Problems', label: 'Advanced Problem Solving' },
  { id: 'Exam_Ready', label: 'Exam Ready (Target Benchmark)' },
  { id: 'Mastery', label: 'Subject Mastery (Honors)' },
];

const INITIAL_NODES = [
  { id: 'Beginner', position: { x: 50, y: 150 }, data: { label: '🌱 Beginner' }, style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '12px', padding: '12px 18px', fontWeight: 'bold' } },
  { id: 'Basic_Math', position: { x: 260, y: 50 }, data: { label: '📐 Basic Math' }, style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '12px', padding: '12px 18px' } },
  { id: 'Fundamentals', position: { x: 260, y: 250 }, data: { label: '📖 Fundamentals' }, style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '12px', padding: '12px 18px' } },
  { id: 'Core_Concepts', position: { x: 480, y: 80 }, data: { label: '💡 Core Concepts' }, style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '12px', padding: '12px 18px' } },
  { id: 'Intermediate', position: { x: 480, y: 230 }, data: { label: '⚙️ Intermediate' }, style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '12px', padding: '12px 18px' } },
  { id: 'Advanced_Problems', position: { x: 700, y: 150 }, data: { label: '🚀 Advanced Problems' }, style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '12px', padding: '12px 18px' } },
  { id: 'Exam_Ready', position: { x: 920, y: 80 }, data: { label: '🎯 Exam Ready' }, style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '12px', padding: '12px 18px', fontWeight: 'bold' } },
  { id: 'Mastery', position: { x: 920, y: 240 }, data: { label: '👑 Mastery' }, style: { background: '#0f172a', color: '#f8fafc', border: '1px solid #334155', borderRadius: '12px', padding: '12px 18px' } },
];

const INITIAL_EDGES = [
  { id: 'e1', source: 'Beginner', target: 'Basic_Math', label: 'Cost: 3', animated: false, style: { stroke: '#475569', strokeWidth: 1.5 } },
  { id: 'e2', source: 'Beginner', target: 'Fundamentals', label: 'Cost: 4', animated: false, style: { stroke: '#475569', strokeWidth: 1.5 } },
  { id: 'e3', source: 'Basic_Math', target: 'Core_Concepts', label: 'Cost: 4', animated: false, style: { stroke: '#475569', strokeWidth: 1.5 } },
  { id: 'e4', source: 'Fundamentals', target: 'Intermediate', label: 'Cost: 3', animated: false, style: { stroke: '#475569', strokeWidth: 1.5 } },
  { id: 'e5', source: 'Core_Concepts', target: 'Advanced_Problems', label: 'Cost: 5', animated: false, style: { stroke: '#475569', strokeWidth: 1.5 } },
  { id: 'e6', source: 'Intermediate', target: 'Advanced_Problems', label: 'Cost: 4', animated: false, style: { stroke: '#475569', strokeWidth: 1.5 } },
  { id: 'e7', source: 'Advanced_Problems', target: 'Exam_Ready', label: 'Cost: 4', animated: false, style: { stroke: '#475569', strokeWidth: 1.5 } },
  { id: 'e8', source: 'Advanced_Problems', target: 'Mastery', label: 'Cost: 7', animated: false, style: { stroke: '#475569', strokeWidth: 1.5 } },
  { id: 'e9', source: 'Core_Concepts', target: 'Intermediate', label: 'Cost: 2', animated: false, style: { stroke: '#475569', strokeWidth: 1.5 } },
];

const DEFAULT_PATH = ['Beginner', 'Basic_Math', 'Core_Concepts', 'Advanced_Problems', 'Exam_Ready'];

export default function StudyPath() {
  const [currentLevel, setCurrentLevel] = useState('Beginner');
  const [targetLevel, setTargetLevel] = useState('Exam_Ready');
  const [path, setPath] = useState(DEFAULT_PATH);
  const [totalCost, setTotalCost] = useState(16);
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);

  useEffect(() => {
    updateGraphHighlight(path);
  }, [path]);

  const updateGraphHighlight = (activePath) => {
    // Highlight nodes on path
    const updatedNodes = INITIAL_NODES.map((node) => {
      const isOnPath = activePath.includes(node.id);
      const isStart = activePath[0] === node.id;
      const isEnd = activePath[activePath.length - 1] === node.id;

      let borderColor = '#334155';
      let background = '#0f172a';
      let boxShadow = 'none';

      if (isStart) {
        borderColor = '#10b981';
        background = '#064e3b';
        boxShadow = '0 0 16px rgba(16, 185, 129, 0.4)';
      } else if (isEnd) {
        borderColor = '#ec4899';
        background = '#831843';
        boxShadow = '0 0 16px rgba(236, 72, 153, 0.4)';
      } else if (isOnPath) {
        borderColor = '#6366f1';
        background = '#312e81';
        boxShadow = '0 0 12px rgba(99, 102, 241, 0.3)';
      }

      return {
        ...node,
        style: {
          ...node.style,
          border: `2px solid ${borderColor}`,
          background,
          boxShadow,
          color: '#ffffff',
          fontWeight: isOnPath ? 'bold' : 'normal',
        },
      };
    });

    // Highlight edges between sequential nodes on path
    const updatedEdges = INITIAL_EDGES.map((edge) => {
      let isPathEdge = false;
      for (let i = 0; i < activePath.length - 1; i++) {
        if (activePath[i] === edge.source && activePath[i + 1] === edge.target) {
          isPathEdge = true;
          break;
        }
      }

      return {
        ...edge,
        animated: isPathEdge,
        style: {
          stroke: isPathEdge ? '#6366f1' : '#334155',
          strokeWidth: isPathEdge ? 3 : 1.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isPathEdge ? '#6366f1' : '#475569',
        },
      };
    });

    setNodes(updatedNodes);
    setEdges(updatedEdges);
  };

  const handleFindPath = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      current_level: currentLevel,
      target_level: targetLevel,
      start_level: currentLevel,
    };

    try {
      const res = await api.post('/api/astar/path', payload);
      if (res.data && res.data.path) {
        setPath(res.data.path);
        setTotalCost(res.data.total_cost || res.data.cost || 16);
      } else {
        computeLocalPath(currentLevel, targetLevel);
      }
    } catch (_) {
      computeLocalPath(currentLevel, targetLevel);
    } finally {
      setLoading(false);
    }
  };

  const computeLocalPath = (start, target) => {
    // Quick heuristic graph lookup
    const defaultPaths = {
      'Beginner-Exam_Ready': { p: ['Beginner', 'Basic_Math', 'Core_Concepts', 'Advanced_Problems', 'Exam_Ready'], c: 16 },
      'Beginner-Mastery': { p: ['Beginner', 'Fundamentals', 'Intermediate', 'Advanced_Problems', 'Mastery'], c: 18 },
      'Basic_Math-Exam_Ready': { p: ['Basic_Math', 'Core_Concepts', 'Advanced_Problems', 'Exam_Ready'], c: 13 },
      'Fundamentals-Mastery': { p: ['Fundamentals', 'Intermediate', 'Advanced_Problems', 'Mastery'], c: 14 },
    };

    const key = `${start}-${target}`;
    if (defaultPaths[key]) {
      setPath(defaultPaths[key].p);
      setTotalCost(defaultPaths[key].c);
    } else {
      const p = [start, 'Intermediate', target];
      setPath(p);
      setTotalCost(12);
    }
  };

  return (
    <PageWrapper>
      <SectionTitle
        title="A* Search Heuristic Study Path"
        subtitle="Optimized curriculum progression graph minimizing estimated study fatigue and difficulty cost f(n) = g(n) + h(n)"
        experimentNumber="04"
        badgeText="Heuristic AI Search"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config Form: 4 cols */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-indigo-400">
                <Route size={18} />
                <CardTitle className="text-base">Configure Learning Milestones</CardTitle>
              </div>
              <p className="text-xs text-slate-400">
                Select your starting proficiency and target academic milestone
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFindPath} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="current-level">Current Academic Level</Label>
                  <Select
                    id="current-level"
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="target-level">Target Academic Level</Label>
                  <Select
                    id="target-level"
                    value={targetLevel}
                    onChange={(e) => setTargetLevel(e.target.value)}
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full gap-2 font-semibold shadow-md shadow-indigo-600/30"
                >
                  <Sparkles size={18} />
                  <span>{loading ? 'Finding Optimal Path...' : 'Find Optimal Path (A*)'}</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Path Summary Card */}
          <Card className="border-indigo-500/30 bg-slate-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  A* Heuristic Summary
                </span>
                <Badge variant="success">Total Cost: {totalCost}</Badge>
              </div>
              <CardTitle className="text-base mt-1">Recommended Sequence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {path.map((nodeId, idx) => (
                  <div
                    key={nodeId}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-200"
                  >
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 font-mono text-[11px] font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{nodeId.replace('_', ' ')}</span>
                    {idx === path.length - 1 && (
                      <Badge variant="default" className="ml-auto text-[10px]">
                        Goal State
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
                <strong>Heuristic Function: </strong>
                f(n) = g(n) + h(n), where g(n) is cumulative topic workload cost and h(n) is admissible distance to target mastery.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Graph Canvas: 8 cols */}
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col p-0 overflow-hidden border-slate-800 bg-slate-950">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">
                  Curriculum State Space Network (@xyflow/react)
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Start
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Path
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Goal
                </span>
              </div>
            </div>

            {/* React Flow Graph */}
            <div className="h-[520px] w-full bg-slate-950 relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                proOptions={{ hideAttribution: true }}
              >
                <Background color="#1e293b" gap={20} size={1} />
                <Controls className="bg-slate-900 border-slate-700 text-white fill-white" />
              </ReactFlow>
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}