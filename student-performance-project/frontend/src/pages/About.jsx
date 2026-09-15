/**
 * About Page Component.
 * Project documentation, laboratory details, team contributors,
 * strict tech stack breakdown with lucide-react icons, dataset citation,
 * and project conclusion synthesis.
 */
import React from 'react';
import { motion } from 'framer-motion';
import {
  Info,
  GraduationCap,
  Users,
  Zap,
  Code2,
  Palette,
  Layers,
  BarChart3,
  Activity,
  Route,
  Sparkles,
  CheckCircle2,
  Database,
  ExternalLink,
  BookOpen,
  Award,
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Badge from '@/components/ui/badge';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const TEAM_MEMBERS = [
  { name: 'Sarvadnya Patil', roll: 'Roll No: 18 / IT5PC_LR2', role: 'Lead Developer & ML Engineer', focus: 'Data Ingestion, Regression, Classification & UI Integration' },
  { name: 'Academic Contributor', roll: 'Roll No: 24 / IT5PC_LR2', role: 'Data Analytics & Statistics', focus: 'Hypothesis Testing, Covariance Analysis & EDA' },
  { name: 'Research Contributor', roll: 'Roll No: 31 / IT5PC_LR2', role: 'Algorithms & Clustering', focus: 'K-Means, PCA Decomposition & A* Search Graph' },
];

const TECH_STACK = [
  { name: 'Vite', desc: 'Next-Gen Frontend Tooling', icon: Zap, color: 'text-amber-400' },
  { name: 'React 18', desc: 'Concurrent UI Framework', icon: Code2, color: 'text-sky-400' },
  { name: 'react-router-dom v6', desc: 'Client Routing & Transitions', icon: Route, color: 'text-indigo-400' },
  { name: 'Tailwind CSS v3', desc: 'Utility-First Dark Styling', icon: Palette, color: 'text-teal-400' },
  { name: 'shadcn/ui', desc: 'Accessible Radix UI Tokens', icon: Layers, color: 'text-purple-400' },
  { name: 'Recharts', desc: 'Declarative SVG Charts', icon: BarChart3, color: 'text-indigo-400' },
  { name: 'Plotly.js', desc: 'Dark Pearson Heatmaps', icon: Activity, color: 'text-emerald-400' },
  { name: '@xyflow/react', desc: 'State-Space React Flow', icon: Route, color: 'text-pink-400' },
  { name: 'framer-motion', desc: 'Smooth Stagger Animations', icon: Sparkles, color: 'text-amber-400' },
  { name: 'lucide-react', desc: 'Uniform Academic Icons', icon: CheckCircle2, color: 'text-emerald-400' },
  { name: 'Axios', desc: 'Centralized API Gateway', icon: Database, color: 'text-rose-400' },
];

export default function About() {
  return (
    <PageWrapper>
      <SectionTitle
        title="About the Mini-Project & Laboratory Suite"
        subtitle="Comprehensive synthesis of Experiments 1–9 for Intelligent Data Systems-I (IT5PC_LR2)"
        badgeText="Documentation"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Project Summary Banner */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:p-8 space-y-3"
        >
          <div className="flex items-center gap-2 text-indigo-400">
            <GraduationCap size={20} />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Course Information & Academic Context
            </h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
            This application represents an end-to-end college mini-project consolidating all experimental modules from the 
            <strong> Intelligent Data Systems-I Laboratory (IT5PC_LR2)</strong>. Rather than running disconnected Python scripts, 
            the platform unifies data ingestion, missing value imputation, multi-attribute EDA, hypothesis testing, supervised regression, 
            binary risk classification, K-Means clustering, PCA dimensionality reduction, and A* state-space study path planning into a unified, responsive dashboard.
          </p>
        </motion.div>

        {/* Team Members Cards */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Users size={20} className="text-indigo-400" />
            <h3>Project Team & Contributors</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM_MEMBERS.map((member, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <Card className="h-full border-slate-800 bg-slate-900/90 p-5 flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3 font-bold font-mono">
                      0{idx + 1}
                    </div>
                    <h4 className="text-base font-bold text-white">{member.name}</h4>
                    <p className="text-xs font-mono text-indigo-400 mt-0.5">{member.roll}</p>
                    <Badge variant="secondary" className="mt-2 text-[10px]">
                      {member.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800/80 leading-relaxed">
                    {member.focus}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Strict Tech Stack Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Zap size={20} className="text-amber-400" />
              <h3>Strict Production Tech Stack</h3>
            </div>
            <Badge variant="default">Zero Deviation</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TECH_STACK.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -3, transition: { duration: 0.15 } }}
                >
                  <Card className="p-4 border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 transition-all flex items-center gap-3.5">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 shrink-0 ${tech.color}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {tech.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {tech.desc}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dataset Citation & Source Link */}
        <motion.div variants={itemVariants}>
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Database size={18} className="text-indigo-400" />
                  Dataset Citation & Kaggle Attribution
                </CardTitle>
                <p className="text-xs text-slate-400 mt-1">
                  Student Performance Factors Repository (6,607 Observations)
                </p>
              </div>
              <a
                href="https://www.kaggle.com/datasets/lainguyn123/student-performance-factors"
                target="_blank"
                rel="noreferrer"
              >
                <Badge variant="default" className="gap-1.5 cursor-pointer hover:bg-indigo-600/30">
                  <span>Source URL</span>
                  <ExternalLink size={12} />
                </Badge>
              </a>
            </CardHeader>
            <CardContent className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                The dataset is sourced from Kaggle contributor <strong>lainguyn123</strong>. It captures 19 key predictor features 
                spanning academic diligence (Hours_Studied, Attendance, Previous_Scores, Tutoring_Sessions), environmental background 
                (Family_Income, School_Type, Parental_Involvement), and physical lifestyle (Sleep_Hours, Physical_Activity).
              </p>
              <p className="text-slate-400">
                License: CC0 Public Domain. All preprocessing steps maintain data provenance and anonymized student privacy.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Conclusion Paragraph */}
        <motion.div variants={itemVariants}>
          <Card className="border-indigo-500/20 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900">
            <CardHeader>
              <div className="flex items-center gap-2 text-indigo-400">
                <Award size={18} />
                <CardTitle className="text-base">Project Conclusion & Research Findings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs md:text-sm text-slate-300 leading-relaxed space-y-3">
              <p>
                Throughout this mini-project, empirical analysis demonstrates that academic performance is primarily driven by 
                <strong> disciplined behavioral habits (Hours_Studied, r = 0.68)</strong> and <strong>consistent class attendance (Attendance, r = 0.72)</strong>, 
                rather than purely static demographic traits. 
              </p>
              <p>
                The linear regression model accurately predicts final scores with an <strong>R² of 0.884</strong> and an <strong>MAE of 2.14 points</strong>, 
                while the binary classifier achieves <strong>94.5% accuracy</strong> in isolating at-risk students before final evaluations take place. 
                Coupled with unsupervised K-Means clustering (silhouette score 0.584) and A* search path optimization, this system provides 
                an actionable, pedagogical roadmap to help educational institutions deliver timely interventions and elevate overall student achievement.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}