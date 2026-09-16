/**
 * Study Path Page Component (A* Search).
 * Uses @xyflow/react (React Flow) to visualize the curriculum milestone state-space graph.
 * Live-highlights the optimal learning path as the user changes their current level.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  MarkerType,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Route,
  Layers,
  Zap,
  ChevronDown,
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Label from '@/components/ui/label';
import Badge from '@/components/ui/badge';

/* ------------------------------------------------------------------ */
/* Custom Select – fully themed dropdown to match the rest of the UI  */
/* ------------------------------------------------------------------ */
function Select({ id, name, value, onChange, options, disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = options.find((o) => String(o.value) === String(value));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      >
        <span>{current?.label ?? 'Select…'}</span>
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-slate-700 bg-slate-950/95 backdrop-blur-sm shadow-xl shadow-black/40">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange({ target: { name, value: opt.value } });
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-sm transition-colors ${
                String(opt.value) === String(value)
                  ? 'bg-indigo-500/20 text-indigo-200'
                  : 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {name && <input type="hidden" name={name} value={value} required />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Backend-mirrored graph — MUST match STUDY_GRAPH in the Python file. */
/* ------------------------------------------------------------------ */
const STUDY_GRAPH = {
  Fundamentals:        { Basic_Concepts: 2, Core_Theory: 3 },
  Basic_Concepts:      { Practice_Problems: 3, Intermediate_Theory: 4 },
  Core_Theory:         { Intermediate_Theory: 3, Practice_Problems: 4 },
  Intermediate_Theory: { Advanced_Problems: 5, Mock_Tests: 4 },
  Practice_Problems:   { Mock_Tests: 3, Advanced_Problems: 5 },
  Mock_Tests:          { Final_Review: 3, Exam_Ready: 2 },
  Advanced_Problems:   { Exam_Ready: 4 },
  Final_Review:        { Exam_Ready: 1 },
  Exam_Ready:          {},
};

const HEURISTIC = {
  Fundamentals: 10,
  Basic_Concepts: 8,
  Core_Theory: 9,
  Intermediate_Theory: 6,
  Practice_Problems: 7,
  Advanced_Problems: 4,
  Mock_Tests: 3,
  Final_Review: 2,
  Exam_Ready: 0,
};

const LEVEL_OPTIONS = [
  { value: 'Fundamentals',        label: 'Beginner — Fundamentals' },
  { value: 'Basic_Concepts',      label: 'Basic Concepts' },
  { value: 'Core_Theory',         label: 'Core Theory' },
  { value: 'Intermediate_Theory', label: 'Intermediate Theory' },
  { value: 'Practice_Problems',   label: 'Practice Problems' },
  { value: 'Advanced_Problems',   label: 'Advanced Problems' },
  { value: 'Mock_Tests',          label: 'Mock Tests' },
  { value: 'Final_Review',        label: 'Final Review' },
];

const GOAL_OPTIONS = [
  { value: 'Exam_Ready', label: 'Exam Ready (Target Benchmark)' },
];

const GOAL_NODE = 'Exam_Ready';

/* ------------------------------------------------------------------ */
/* Custom edge with adjustable label position along the chord          */
/* ------------------------------------------------------------------ */
function ThemedEdge({
  id,
  sourceX, sourceY,
  targetX, targetY,
  sourcePosition, targetPosition,
  style = {},
  markerEnd,
  label,
  data = {},
}) {
  const curvature = data.curvature ?? 0.25;
  const labelT = data.labelT ?? 0.5;

  const [edgePath] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    curvature,
  });

  // Place the label at fraction labelT along the straight chord between endpoints
  const lx = sourceX + (targetX - sourceX) * labelT;
  const ly = sourceY + (targetY - sourceY) * labelT;

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${lx}px, ${ly}px)`,
              background: '#020617',
              border: '1px solid #334155',
              borderRadius: 6,
              padding: '3px 7px',
              fontSize: 11,
              fontWeight: 600,
              color: '#cbd5e1',
              lineHeight: 1,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const edgeTypes = { themed: ThemedEdge };

/* ------------------------------------------------------------------ */
/* Client-side A* — identical to backend astar_study_path logic       */
/* ------------------------------------------------------------------ */
function localAStar(startNode, goalNode = GOAL_NODE) {
  if (!STUDY_GRAPH[startNode]) {
    return { path: [], total_cost: 0, error: 'Unknown start node' };
  }

  const open = [{
    node: startNode,
    g: 0,
    f: HEURISTIC[startNode] ?? 0,
    path: [startNode],
  }];
  const visited = new Set();

  while (open.length) {
    open.sort((a, b) => a.f - b.f);
    const { node, g, f, path } = open.shift();

    if (node === goalNode) {
      return { path, total_cost: g, f_cost: f };
    }
    if (visited.has(node)) continue;
    visited.add(node);

    const neighbors = STUDY_GRAPH[node] || {};
    for (const [next, cost] of Object.entries(neighbors)) {
      if (visited.has(next)) continue;
      const ng = g + cost;
      const nf = ng + (HEURISTIC[next] ?? 0);
      open.push({ node: next, g: ng, f: nf, path: [...path, next] });
    }
  }

  return { path: [], total_cost: 0, error: 'No path found' };
}

/* ------------------------------------------------------------------ */
/* Graph geometry — wide columns, taller rows, prevent overlaps        */
/* ------------------------------------------------------------------ */
const NODE_BASE_STYLE = {
  background: '#0f172a',
  color: '#f8fafc',
  border: '1px solid #334155',
  borderRadius: '12px',
  padding: '12px 18px',
  fontSize: 12,
};

const INITIAL_NODES = [
  { id: 'Fundamentals',        position: { x: 40,   y: 240 }, data: { label: 'Fundamentals' },        style: { ...NODE_BASE_STYLE, fontWeight: 'bold' } },
  { id: 'Basic_Concepts',      position: { x: 360,  y: 20  }, data: { label: 'Basic Concepts' },      style: { ...NODE_BASE_STYLE } },
  { id: 'Core_Theory',         position: { x: 360,  y: 480 }, data: { label: 'Core Theory' },         style: { ...NODE_BASE_STYLE } },
  { id: 'Intermediate_Theory', position: { x: 720,  y: 20  }, data: { label: 'Intermediate Theory' }, style: { ...NODE_BASE_STYLE } },
  { id: 'Practice_Problems',   position: { x: 720,  y: 480 }, data: { label: 'Practice Problems' },   style: { ...NODE_BASE_STYLE } },
  { id: 'Advanced_Problems',   position: { x: 1080, y: 20  }, data: { label: 'Advanced Problems' },   style: { ...NODE_BASE_STYLE } },
  { id: 'Mock_Tests',          position: { x: 1080, y: 480 }, data: { label: 'Mock Tests' },          style: { ...NODE_BASE_STYLE } },
  { id: 'Final_Review',        position: { x: 1420, y: 20  }, data: { label: 'Final Review' },        style: { ...NODE_BASE_STYLE } },
  { id: 'Exam_Ready',          position: { x: 1420, y: 480 }, data: { label: 'Exam Ready' },          style: { ...NODE_BASE_STYLE, fontWeight: 'bold' } },
];

/* Edges with explicit curvature + labelT to prevent any label collision. */
const INITIAL_EDGES = [
  // ── Left side ──
  { id: 'e-f-bc', source: 'Fundamentals', target: 'Basic_Concepts', label: 'Cost: 2',
    sourcePosition: Position.Top, targetPosition: Position.Bottom,
    data: { curvature: 0.2, labelT: 0.5 } },
  { id: 'e-f-ct', source: 'Fundamentals', target: 'Core_Theory', label: 'Cost: 3',
    sourcePosition: Position.Bottom, targetPosition: Position.Top,
    data: { curvature: 0.2, labelT: 0.5 } },

  // ── Crossing pair #1 ──
  { id: 'e-bc-pp', source: 'Basic_Concepts', target: 'Practice_Problems', label: 'Cost: 3',
    sourcePosition: Position.Bottom, targetPosition: Position.Top,
    data: { curvature: 0.15, labelT: 0.28 } },
  { id: 'e-ct-it', source: 'Core_Theory', target: 'Intermediate_Theory', label: 'Cost: 3',
    sourcePosition: Position.Top, targetPosition: Position.Bottom,
    data: { curvature: 0.15, labelT: 0.72 } },

  // ── Top-row arcs ──
  { id: 'e-bc-it', source: 'Basic_Concepts', target: 'Intermediate_Theory', label: 'Cost: 4',
    sourcePosition: Position.Top, targetPosition: Position.Top,
    data: { curvature: 0.5, labelT: 0.5 } },
  { id: 'e-it-ap', source: 'Intermediate_Theory', target: 'Advanced_Problems', label: 'Cost: 5',
    sourcePosition: Position.Top, targetPosition: Position.Top,
    data: { curvature: 0.5, labelT: 0.5 } },

  // ── Bottom-row arcs ──
  { id: 'e-ct-pp', source: 'Core_Theory', target: 'Practice_Problems', label: 'Cost: 4',
    sourcePosition: Position.Bottom, targetPosition: Position.Bottom,
    data: { curvature: 0.5, labelT: 0.5 } },
  { id: 'e-pp-mt', source: 'Practice_Problems', target: 'Mock_Tests', label: 'Cost: 3',
    sourcePosition: Position.Bottom, targetPosition: Position.Bottom,
    data: { curvature: 0.5, labelT: 0.5 } },

  // ── Crossing pair #2 ──
  { id: 'e-it-mt', source: 'Intermediate_Theory', target: 'Mock_Tests', label: 'Cost: 4',
    sourcePosition: Position.Bottom, targetPosition: Position.Top,
    data: { curvature: 0.1, labelT: 0.3 } },
  { id: 'e-pp-ap', source: 'Practice_Problems', target: 'Advanced_Problems', label: 'Cost: 5',
    sourcePosition: Position.Top, targetPosition: Position.Bottom,
    data: { curvature: 0.1, labelT: 0.7 } },

  // ── Crossing pair #3 ──
  { id: 'e-mt-fr', source: 'Mock_Tests', target: 'Final_Review', label: 'Cost: 3',
    sourcePosition: Position.Top, targetPosition: Position.Bottom,
    data: { curvature: 0.15, labelT: 0.28 } },
  { id: 'e-ap-er', source: 'Advanced_Problems', target: 'Exam_Ready', label: 'Cost: 4',
    sourcePosition: Position.Bottom, targetPosition: Position.Top,
    data: { curvature: 0.15, labelT: 0.72 } },

  // ── Right side (no crossing) ──
  { id: 'e-mt-er', source: 'Mock_Tests', target: 'Exam_Ready', label: 'Cost: 2',
    sourcePosition: Position.Bottom, targetPosition: Position.Bottom,
    data: { curvature: 0.4, labelT: 0.5 } },
  { id: 'e-fr-er', source: 'Final_Review', target: 'Exam_Ready', label: 'Cost: 1',
    sourcePosition: Position.Bottom, targetPosition: Position.Top,
    data: { curvature: 0.2, labelT: 0.5 } },
].map((edge) => ({
  ...edge,
  type: 'themed',
  animated: false,
  style: { stroke: '#475569', strokeWidth: 1.5 },
}));

const DEFAULT_RESULT = localAStar('Fundamentals');

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function StudyPath() {
  const [currentLevel, setCurrentLevel] = useState('Fundamentals');
  const [path, setPath] = useState(DEFAULT_RESULT.path);
  const [totalCost, setTotalCost] = useState(DEFAULT_RESULT.total_cost);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);

  /* LIVE PATHFINDING */
  useEffect(() => {
    const result = localAStar(currentLevel, GOAL_NODE);
    if (result.path.length) {
      setPath(result.path);
      setTotalCost(result.total_cost);
    }
  }, [currentLevel]);

  useEffect(() => {
    updateGraphHighlight(path);
  }, [path]);

  const updateGraphHighlight = (activePath) => {
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

  const getEdgeCost = (from, to) => STUDY_GRAPH[from]?.[to];

  return (
    <PageWrapper>
      <SectionTitle
        title="A* Search Heuristic Study Path"
        subtitle="Optimized curriculum progression graph minimizing estimated study fatigue and difficulty cost f(n) = g(n) + h(n)"
        experimentNumber="04"
        badgeText="Heuristic AI Search"
      />

      <div className="space-y-6">
        <Card className="flex flex-col p-0 overflow-hidden border-slate-800 bg-slate-950">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">
                Curriculum State Space Network
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

          <div className="h-[560px] w-full bg-slate-950 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              edgeTypes={edgeTypes}
              fitView
              fitViewOptions={{ padding: 0.1, maxZoom: 1 }}
              minZoom={0.2}
              maxZoom={1.5}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              panOnDrag={false}
              panOnScroll={false}
              zoomOnScroll={false}
              zoomOnPinch={false}
              zoomOnDoubleClick={false}
              preventScrolling={false}
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#1e293b" gap={20} size={1} />
            </ReactFlow>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Route size={18} />
                  <CardTitle className="text-base">Configure Learning Milestones</CardTitle>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  <Zap size={11} className="fill-emerald-400" /> Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                The optimal path updates automatically as you change your starting level
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="current-level">Current Academic Level</Label>
                  <Select
                    id="current-level"
                    name="current-level"
                    value={currentLevel}
                    onChange={(e) => setCurrentLevel(e.target.value)}
                    options={LEVEL_OPTIONS}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="target-level">Target Academic Level</Label>
                  <Select
                    id="target-level"
                    name="target-level"
                    value={GOAL_NODE}
                    onChange={() => {}}
                    options={GOAL_OPTIONS}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>

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
                {path.map((nodeId, idx) => {
                  const prev = idx > 0 ? path[idx - 1] : null;
                  const stepCost = prev ? getEdgeCost(prev, nodeId) : null;
                  const isStart = idx === 0;
                  const isGoal = idx === path.length - 1;

                  return (
                    <div
                      key={`${nodeId}-${idx}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-200"
                    >
                      <span
                        className={`flex items-center justify-center w-5 h-5 rounded-full font-mono text-[11px] font-bold shrink-0 ${
                          isStart
                            ? 'bg-emerald-600/30 text-emerald-400'
                            : isGoal
                            ? 'bg-pink-600/30 text-pink-400'
                            : 'bg-indigo-600/30 text-indigo-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-semibold">{nodeId.replace(/_/g, ' ')}</span>

                      {isStart && (
                        <span className="ml-auto text-[10px] font-semibold text-emerald-400">
                          START
                        </span>
                      )}
                      {stepCost != null && !isGoal && (
                        <span className="ml-auto font-mono text-[10px] text-slate-400">
                          +{stepCost}
                        </span>
                      )}
                      {isGoal && (
                        <Badge variant="default" className="ml-auto text-[10px]">
                          Goal State
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
                <strong>Heuristic Function: </strong>
                f(n) = g(n) + h(n), where g(n) is cumulative topic workload cost and h(n) is admissible distance to target mastery.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}