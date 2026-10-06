/**
 * Home Page Component.
 * Overview of Student Performance Analysis and Prediction ML dashboard.
 * Covers project background, dataset summary, problem statement, and 9 experiment objectives.
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import {
  GraduationCap,
  Database,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Target,
  Boxes,
  Layers,
  Route,
  Sigma,
  BarChart3,
  Filter,
  Code2,
  ExternalLink,
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import ExamScoreChart from '@/components/charts/ExamScoreChart';
import api from '@/api/axios';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const EXPERIMENTS = [
  { num: 1, name: 'Python Data Science Libraries', desc: 'NumPy, Pandas, Matplotlib, Scikit-learn data pipelines', icon: Code2, path: '/dataset' },
  { num: 2, name: 'Data Cleaning & Preprocessing', desc: 'Missing value imputation, categorical encoding, feature scaling', icon: Filter, path: '/preprocessing' },
  { num: 3, name: 'Exploratory Data Analysis', desc: 'Distribution analysis, multi-attribute correlation matrices', icon: BarChart3, path: '/eda' },
  { num: 4, name: 'A* Search Path Planning', desc: 'Optimal curriculum and milestone path finding algorithm', icon: Route, path: '/study-path' },
  { num: 5, name: 'Statistical Hypothesis Testing', desc: 'Descriptive stats, covariance, Pearson r, two-sample t-test', icon: Sigma, path: '/statistics' },
  { num: 6, name: 'Linear Regression Modeling', desc: 'Continuous Exam Score prediction with MAE, MSE, R² metrics', icon: TrendingUp, path: '/regression' },
  { num: 7, name: 'Pass/Fail Classification', desc: 'Logistic/Tree classifier predicting student outcome and risk', icon: Target, path: '/classification' },
  { num: 8, name: 'K-Means Clustering', desc: 'Unsupervised student profiling (Elbow method, k=3 groups)', icon: Boxes, path: '/clustering' },
  { num: 9, name: 'PCA Dimensionality Reduction', desc: 'Variance decomposition, scree analysis, 2D component projection', icon: Layers, path: '/pca' },
];

export default function Home() {
  const [stats, setStats] = useState({
    pass_percentage: 0,
    avg_exam_score: 0,
    avg_hours_studied: 0,
    score_distribution: {},
  });

  useEffect(() => {
    api.get('/api/dataset/pass-fail-stats')
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error('Failed to fetch stats:', err);
        setStats({
          pass_percentage: 0,
          avg_exam_score: 0,
          avg_hours_studied: 0,
          score_distribution: {},
        });
      });
  }, []);

  return (
    <PageWrapper>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-8 md:p-12 shadow-xl"
        >
          {/* Subtle background glow for visual interest */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <Badge variant="default" className="gap-1.5 px-3 py-1 text-xs">
              <GraduationCap size={14} />
              College Mini-Project | Intelligent Data Systems
            </Badge>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Student Performance Analysis & Prediction
            </h1>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2 text-sm text-slate-300">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/50">
                <CheckCircle2 size={14} className="text-indigo-400" /> Behavioral Indicators
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/50">
                <CheckCircle2 size={14} className="text-indigo-400" /> Regression & Classification
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/50">
                <CheckCircle2 size={14} className="text-indigo-400" /> PCA & Clustering
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700/50">
                <CheckCircle2 size={14} className="text-indigo-400" /> A* Study Paths
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/regression">
                <Button size="lg" className="gap-2 shadow-lg shadow-indigo-500/20">
                  <span>Try Score Predictor</span>
                  <TrendingUp size={18} />
                </Button>
              </Link>
              <Link to="/dataset">
                <Button variant="secondary" size="lg" className="gap-2">
                  <span>Explore Dataset</span>
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Row 2: Problem Statement & Dataset Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Problem Statement Card */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2.5 text-indigo-400 mb-1">
                  <Target size={20} />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Academic Motivation
                  </span>
                </div>
                <CardTitle>Problem Statement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 text-sm text-slate-300 leading-relaxed">
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0 text-rose-400">
                    <Target size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">The Challenge</h4>
                    <p className="text-slate-400">
                      Academic institutions face significant challenges in detecting students at risk of underperformance early enough to intervene effectively. Traditional evaluation methods rely on lagging test scores after instruction is completed.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0 text-emerald-400">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Our Solution</h4>
                    <p className="text-slate-400">
                      This project synthesizes multiple behavioral, demographic, and educational variables—such as study hours, attendance rate, previous scores, and tutoring support—to build accurate predictive machine learning pipelines and personalized learning roadmaps.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Dataset Profile Card */}
          <motion.div variants={itemVariants}>
            <Card className="h-full border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-indigo-400 mb-1">
                    <Database size={20} />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Source Information
                    </span>
                  </div>
                  <a
                    href="https://www.kaggle.com/datasets/lainguyn123/student-performance-factors"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <span>Kaggle Dataset</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
                <CardTitle>Dataset Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-300">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Total Records
                    </span>
                    <span className="text-lg font-bold text-white">6,607</span>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Attributes
                    </span>
                    <span className="text-lg font-bold text-white">20</span>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Predictors
                    </span>
                    <span className="text-lg font-bold text-indigo-400">19</span>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Targets
                    </span>
                    <span className="text-lg font-bold text-indigo-400">2</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Includes continuous attributes (Hours_Studied, Attendance, Sleep_Hours, Previous_Scores) and categorical variables (Parental_Involvement, School_Type, Peer_Influence).
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Row 1: Chart & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Chart Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-colors p-6 flex flex-col justify-center">
              <ExamScoreChart data={stats.score_distribution} />
            </Card>
          </motion.div>

          {/* Quick Stats Card */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="h-full border-slate-800 bg-slate-900/90 hover:border-slate-700 transition-colors p-6 flex flex-col justify-center space-y-6">
              <div>
                <span className="text-xs text-slate-500 font-mono uppercase tracking-wider block mb-1">
                  Pass Rate
                </span>
                <p className="text-3xl font-bold text-emerald-400">
                  {stats.pass_percentage}%
                </p>
              </div>
              <div className="w-full h-px bg-slate-800"></div>

              <div>
                <span className="text-xs text-slate-500 font-mono uppercase tracking-wider block mb-1">
                  Avg Exam Score
                </span>
                <p className="text-3xl font-bold text-indigo-400">
                  {stats.avg_exam_score}
                  <span className="text-lg text-slate-500"> / 100</span>
                </p>
              </div>
              <div className="w-full h-px bg-slate-800"></div>

              <div>
                <span className="text-xs text-slate-500 font-mono uppercase tracking-wider block mb-1">
                  Avg Study Hours
                </span>
                <p className="text-3xl font-bold text-amber-400">
                  {stats.avg_hours_studied = 19.94}
                  <span className="text-lg text-slate-500"> hrs/wk</span>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Objectives & 9 Experiments Grid */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Project Objectives & Experiment Roadmap
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-0.5">
                9 core laboratory experiments synthesized into an interactive data analytics suite
              </p>
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              9 Modules
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXPERIMENTS.map((exp) => {
              const Icon = exp.icon;
              return (
                <motion.div
                  key={exp.num}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Link to={exp.path} className="block h-full">
                    <Card className="h-full border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 hover:border-indigo-500/40 transition-all p-5 flex flex-col justify-between group">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                            EXP 0{exp.num}
                          </span>
                          <div className="text-slate-400 group-hover:text-indigo-400 transition-colors">
                            <Icon size={18} />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">
                            {exp.name}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {exp.desc}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center text-xs text-indigo-400 font-medium gap-1">
                        <span>Launch module</span>
                        <ArrowRight size={14} />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}