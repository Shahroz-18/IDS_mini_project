/**
 * Preprocessing Page Component.
 * Visualizes Data Cleaning pipeline: before/after dataset comparison,
 * missing value imputation, one-hot / ordinal encoding decisions, and standard scaling.
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Filter,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sliders,
  Layers,
  FileCheck,
} from 'lucide-react';
import api from '@/api/axios';
import PageWrapper from '@/components/layout/PageWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Loader from '@/components/shared/Loader';
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

const DEFAULT_REPORT = {
  before_shape: [6607, 20],
  after_shape: [6607, 22],
  missing_before: 288,
  missing_after: 0,
  duplicates_before: 0,
  duplicates_after: 0,
  encoding_decisions: [
    { feature: 'Parental_Involvement', method: 'Ordinal Encoding', details: 'Low -> 0, Medium -> 1, High -> 2' },
    { feature: 'Access_to_Resources', method: 'Ordinal Encoding', details: 'Low -> 0, Medium -> 1, High -> 2' },
    { feature: 'Motivation_Level', method: 'Ordinal Encoding', details: 'Low -> 0, Medium -> 1, High -> 2' },
    { feature: 'Family_Income', method: 'Ordinal Encoding', details: 'Low -> 0, Medium -> 1, High -> 2' },
    { feature: 'Teacher_Quality', method: 'Ordinal Encoding', details: 'Low -> 0, Medium -> 1, High -> 2' },
    { feature: 'School_Type', method: 'Binary Encoding', details: 'Public -> 0, Private -> 1' },
    { feature: 'Gender', method: 'Binary Encoding', details: 'Female -> 0, Male -> 1' },
    { feature: 'Internet_Access', method: 'Binary Encoding', details: 'No -> 0, Yes -> 1' },
    { feature: 'Learning_Disabilities', method: 'Binary Encoding', details: 'No -> 0, Yes -> 1' },
  ],
  scaling_decisions: [
    { feature: 'Hours_Studied', method: 'StandardScaler', formula: 'z = (x - μ) / σ', mean: '19.98 hrs', std: '5.98 hrs' },
    { feature: 'Attendance', method: 'StandardScaler', formula: 'z = (x - μ) / σ', mean: '80.01%', std: '11.45%' },
    { feature: 'Sleep_Hours', method: 'StandardScaler', formula: 'z = (x - μ) / σ', mean: '7.02 hrs', std: '1.21 hrs' },
    { feature: 'Previous_Scores', method: 'StandardScaler', formula: 'z = (x - μ) / σ', mean: '69.15 pts', std: '9.15 pts' },
    { feature: 'Tutoring_Sessions', method: 'MinMaxScaler', formula: 'z = (x - min) / (max - min)', mean: '1.49 sess', std: '1.24 sess' },
  ],
};

export default function Preprocessing() {
  const [report, setReport] = useState(DEFAULT_REPORT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/preprocessing/report');
      if (res.data) {
        setReport((prev) => ({
          ...prev,
          ...res.data,
          before_shape: res.data.before_shape || res.data.original_shape || prev.before_shape,
          after_shape: res.data.after_shape || res.data.cleaned_shape || prev.after_shape,
          missing_before: res.data.missing_before ?? res.data.missing_values_before ?? prev.missing_before,
          missing_after: res.data.missing_after ?? res.data.missing_values_after ?? 0,
        }));
      }
    } catch (err) {
      setError(err.message || 'Unable to fetch report from server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <SectionTitle
        title="Data Cleaning & Preprocessing Pipeline"
        subtitle="End-to-end data transformation: handling missing values, categorical encoding, and feature standardization"
        experimentNumber="02"
        badgeText="Pipeline Validated"
      />

      {loading ? (
        <Loader message="Loading preprocessing validation report..." fullPage />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg">
              <AlertCircle size={16} />
              <span>{error} (Using default experimental pipeline metadata)</span>
            </div>
          )}

          {/* Before vs After Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Shape */}
            <motion.div variants={itemVariants}>
              <Card className="h-full border-slate-800 bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Dataset Matrix Shape
                    </span>
                    <Layers size={18} className="text-indigo-400" />
                  </div>
                  <CardTitle className="text-base mt-1">Matrix Dimensions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Raw Input</span>
                      <span className="text-sm font-bold text-slate-200 font-mono">
                        {report.before_shape?.[0]} × {report.before_shape?.[1]}
                      </span>
                    </div>
                    <ArrowRight size={18} className="text-indigo-500" />
                    <div className="text-right">
                      <span className="text-[11px] text-emerald-400 block">Clean & Encoded</span>
                      <span className="text-sm font-bold text-emerald-300 font-mono">
                        {report.after_shape?.[0]} × {report.after_shape?.[1]}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    Expansion from 20 to {report.after_shape?.[1]} columns is due to categorical feature encoding.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Missing Values */}
            <motion.div variants={itemVariants}>
              <Card className="h-full border-slate-800 bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Imputation Health
                    </span>
                    <Filter size={18} className="text-sky-400" />
                  </div>
                  <CardTitle className="text-base mt-1">Missing Value Imputation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <div>
                      <span className="text-[11px] text-rose-400 block">Before Imputation</span>
                      <span className="text-sm font-bold text-rose-300 font-mono">
                        {report.missing_before} Nulls
                      </span>
                    </div>
                    <ArrowRight size={18} className="text-emerald-500" />
                    <div className="text-right">
                      <span className="text-[11px] text-emerald-400 block">After Mode Fill</span>
                      <span className="text-sm font-bold text-emerald-300 font-mono">
                        {report.missing_after} Nulls
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 size={14} />
                    <span>Mode imputation applied to categorical nulls</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Duplicate Rows */}
            <motion.div variants={itemVariants}>
              <Card className="h-full border-slate-800 bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Integrity Check
                    </span>
                    <FileCheck size={18} className="text-emerald-400" />
                  </div>
                  <CardTitle className="text-base mt-1">Duplicate Verification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Identified Duplicates</span>
                      <span className="text-sm font-bold text-slate-200 font-mono">
                        {report.duplicates_before} Rows
                      </span>
                    </div>
                    <ArrowRight size={18} className="text-emerald-500" />
                    <div className="text-right">
                      <span className="text-[11px] text-emerald-400 block">Post-Deduplication</span>
                      <span className="text-sm font-bold text-emerald-300 font-mono">
                        {report.duplicates_after} Rows
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Sparkles size={14} className="text-amber-400" />
                    <span>Zero duplicate student entities found</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* List of Encoding Decisions */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Sliders size={18} />
                    <CardTitle className="text-base">Categorical Encoding Decisions</CardTitle>
                  </div>
                  <p className="text-xs text-slate-400">
                    Features transformed to preserve ordinal hierarchies and binary relationships
                  </p>
                </div>
                <Badge variant="default">9 Decisions</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {report.encoding_decisions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-xs text-slate-200">
                          {item.feature}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                          {item.method}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono bg-slate-900/90 p-1.5 rounded border border-slate-800">
                        {item.details}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* List of Scaling Decisions */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sky-400">
                    <Sparkles size={18} />
                    <CardTitle className="text-base">Feature Scaling & Standardization</CardTitle>
                  </div>
                  <p className="text-xs text-slate-400">
                    Numerical feature scaling ensures equal gradient propagation in regression and Euclidean distance in clustering
                  </p>
                </div>
                <Badge variant="secondary">StandardScaler & MinMax</Badge>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {report.scaling_decisions.map((scale, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {scale.feature}
                        </span>
                        <Badge variant="default" className="text-[10px]">
                          {scale.method}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1 bg-slate-900/80 p-2.5 rounded border border-slate-800/80">
                        <div className="flex justify-between">
                          <span>Formula:</span>
                          <span className="font-mono text-indigo-300">{scale.formula}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mean (μ):</span>
                          <span className="font-mono text-slate-200">{scale.mean}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Std Dev (σ):</span>
                          <span className="font-mono text-slate-200">{scale.std}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </PageWrapper>
  );
}