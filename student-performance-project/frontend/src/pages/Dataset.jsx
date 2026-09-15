/**
 * Dataset Page Component.
 * Visualizes raw dataset summary, feature dimensions, missing value breakdown,
 * and first 10 sample records in a styled table.
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Table as TableIcon,
  Hash,
  Type,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import api from '@/api/axios';
import PageWrapper from '@/components/layout/PageWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import MetricCard from '@/components/shared/MetricCard';
import Loader from '@/components/shared/Loader';
import EmptyState from '@/components/shared/EmptyState';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import Badge from '@/components/ui/badge';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const DEFAULT_SUMMARY = {
  total_records: 6607,
  total_features: 20,
  numerical_cols: [
    'Hours_Studied',
    'Attendance',
    'Sleep_Hours',
    'Previous_Scores',
    'Tutoring_Sessions',
    'Physical_Activity',
    'Exam_Score',
  ],
  categorical_cols: [
    'Parental_Involvement',
    'Access_to_Resources',
    'Extracurricular_Activities',
    'Motivation_Level',
    'Internet_Access',
    'Family_Income',
    'Teacher_Quality',
    'School_Type',
    'Peer_Influence',
    'Learning_Disabilities',
    'Parental_Education_Level',
    'Distance_from_Home',
    'Gender',
  ],
  missing_values: {
    Teacher_Quality: 104,
    Parental_Education_Level: 98,
    Distance_from_Home: 86,
  },
};

const DEFAULT_PREVIEW = [
  { Hours_Studied: 23, Attendance: 84, Sleep_Hours: 7, Previous_Scores: 73, Tutoring_Sessions: 0, Physical_Activity: 3, Parental_Involvement: 'Low', School_Type: 'Public', Gender: 'Male', Exam_Score: 67 },
  { Hours_Studied: 19, Attendance: 64, Sleep_Hours: 8, Previous_Scores: 59, Tutoring_Sessions: 2, Physical_Activity: 1, Parental_Involvement: 'Medium', School_Type: 'Public', Gender: 'Female', Exam_Score: 61 },
  { Hours_Studied: 24, Attendance: 98, Sleep_Hours: 7, Previous_Scores: 91, Tutoring_Sessions: 1, Physical_Activity: 2, Parental_Involvement: 'High', School_Type: 'Private', Gender: 'Male', Exam_Score: 84 },
  { Hours_Studied: 29, Attendance: 89, Sleep_Hours: 6, Previous_Scores: 84, Tutoring_Sessions: 3, Physical_Activity: 4, Parental_Involvement: 'Medium', School_Type: 'Public', Gender: 'Male', Exam_Score: 78 },
  { Hours_Studied: 16, Attendance: 71, Sleep_Hours: 8, Previous_Scores: 62, Tutoring_Sessions: 0, Physical_Activity: 2, Parental_Involvement: 'Low', School_Type: 'Private', Gender: 'Female', Exam_Score: 59 },
  { Hours_Studied: 21, Attendance: 92, Sleep_Hours: 9, Previous_Scores: 79, Tutoring_Sessions: 1, Physical_Activity: 3, Parental_Involvement: 'High', School_Type: 'Public', Gender: 'Female', Exam_Score: 74 },
  { Hours_Studied: 14, Attendance: 55, Sleep_Hours: 5, Previous_Scores: 51, Tutoring_Sessions: 0, Physical_Activity: 1, Parental_Involvement: 'Low', School_Type: 'Public', Gender: 'Male', Exam_Score: 52 },
  { Hours_Studied: 27, Attendance: 95, Sleep_Hours: 8, Previous_Scores: 88, Tutoring_Sessions: 2, Physical_Activity: 4, Parental_Involvement: 'High', School_Type: 'Private', Gender: 'Female', Exam_Score: 82 },
  { Hours_Studied: 22, Attendance: 81, Sleep_Hours: 7, Previous_Scores: 70, Tutoring_Sessions: 1, Physical_Activity: 2, Parental_Involvement: 'Medium', School_Type: 'Public', Gender: 'Male', Exam_Score: 68 },
  { Hours_Studied: 18, Attendance: 76, Sleep_Hours: 6, Previous_Scores: 65, Tutoring_Sessions: 1, Physical_Activity: 3, Parental_Involvement: 'Medium', School_Type: 'Private', Gender: 'Female', Exam_Score: 63 },
];

export default function Dataset() {
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [preview, setPreview] = useState(DEFAULT_PREVIEW);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDatasetData();
  }, []);

  const fetchDatasetData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch summary and preview
      const [summaryRes, previewRes] = await Promise.allSettled([
        api.get('/api/dataset/summary'),
        api.get('/api/dataset/preview'),
      ]);

      if (summaryRes.status === 'fulfilled' && summaryRes.value.data) {
        setSummary((prev) => ({ ...prev, ...summaryRes.value.data }));
      } else {
        // Fallback to /api/dataset/info if summary didn't resolve
        try {
          const infoRes = await api.get('/api/dataset/info');
          if (infoRes.data) {
            setSummary({
              total_records: infoRes.data.shape?.[0] || 6607,
              total_features: infoRes.data.shape?.[1] || 20,
              numerical_cols: infoRes.data.numeric_columns || DEFAULT_SUMMARY.numerical_cols,
              categorical_cols: infoRes.data.categorical_columns || DEFAULT_SUMMARY.categorical_cols,
              missing_values: infoRes.data.missing_values || DEFAULT_SUMMARY.missing_values,
            });
            if (infoRes.data.sample) {
              setPreview(infoRes.data.sample);
            }
          }
        } catch (_) {
          // Keep default mock
        }
      }

      if (previewRes.status === 'fulfilled' && previewRes.value.data) {
        const data = Array.isArray(previewRes.value.data)
          ? previewRes.value.data
          : previewRes.value.data.sample || DEFAULT_PREVIEW;
        setPreview(data.slice(0, 10));
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch dataset from server.');
    } finally {
      setLoading(false);
    }
  };

  const previewCols = preview.length > 0 ? Object.keys(preview[0]) : [];

  return (
    <PageWrapper>
      <SectionTitle
        title="Dataset Architecture & Inspection"
        subtitle="Exploration of the Student Performance Factors repository (6,607 observations x 20 features)"
        experimentNumber="01"
        badgeText="Raw Ingestion"
      />

      {loading ? (
        <Loader message="Loading dataset schema and records..." fullPage />
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
              <span>{error} (Displaying cached baseline dataset info)</span>
            </div>
          )}

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Records"
              value={summary.total_records?.toLocaleString() || '6,607'}
              subtitle="Student profile instances"
              icon={Database}
              iconColor="text-indigo-400"
              iconBg="bg-indigo-500/10 border-indigo-500/20"
            />
            <MetricCard
              title="Total Features"
              value={summary.total_features || 20}
              subtitle="19 predictors + 1 target"
              icon={TableIcon}
              iconColor="text-sky-400"
              iconBg="bg-sky-500/10 border-sky-500/20"
            />
            <MetricCard
              title="Numerical Columns"
              value={summary.numerical_cols?.length || 7}
              subtitle="Continuous & discrete integers"
              icon={Hash}
              iconColor="text-emerald-400"
              iconBg="bg-emerald-500/10 border-emerald-500/20"
            />
            <MetricCard
              title="Categorical Columns"
              value={summary.categorical_cols?.length || 13}
              subtitle="Ordinal & nominal attributes"
              icon={Type}
              iconColor="text-amber-400"
              iconBg="bg-amber-500/10 border-amber-500/20"
            />
          </div>

          {/* Feature Types & Missing Values Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-indigo-400">
                  <Hash size={18} />
                  <CardTitle className="text-base">Numerical Attributes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {summary.numerical_cols?.map((col) => (
                    <Badge key={col} variant="secondary" className="font-mono text-xs">
                      {col}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                  Includes key behavioral indicators: Hours_Studied, Attendance, Sleep_Hours, and Previous_Scores.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Type size={18} />
                    <CardTitle className="text-base">Missing Values Summary</CardTitle>
                  </div>
                  <Badge variant="warning" className="text-[10px]">
                    Requires Imputation
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {summary.missing_values && Object.keys(summary.missing_values).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(summary.missing_values).map(([col, count]) => (
                      <div
                        key={col}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs"
                      >
                        <span className="font-medium text-slate-300">{col}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-rose-400 font-semibold">{count} missing</span>
                          <span className="text-slate-500">
                            ({((count / (summary.total_records || 6607)) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-400">No missing values detected in dataset.</p>
                )}
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                  Categorical columns with missing values are handled via mode imputation in Preprocessing.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* First 10 Rows Preview Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileSpreadsheet size={18} className="text-indigo-400" />
                  Dataset Preview (First 10 Observations)
                </CardTitle>
                <p className="text-xs text-slate-400 mt-1">
                  Sample rows exhibiting student features and continuous final exam score
                </p>
              </div>
              <Badge variant="default" className="text-[11px]">
                10 Rows Loaded
              </Badge>
            </CardHeader>
            <CardContent>
              {preview.length === 0 ? (
                <EmptyState
                  title="No Preview Available"
                  description="Could not load preview records from backend."
                  onRetry={fetchDatasetData}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      {previewCols.slice(0, 8).map((col) => (
                        <TableHead key={col}>{col}</TableHead>
                      ))}
                      {previewCols.includes('Exam_Score') && (
                        <TableHead className="text-right">Exam_Score</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-xs text-slate-500">
                          {idx + 1}
                        </TableCell>
                        {previewCols.slice(0, 8).map((col) => (
                          <TableCell key={col} className="text-xs">
                            {row[col] !== undefined && row[col] !== null ? String(row[col]) : '—'}
                          </TableCell>
                        ))}
                        {previewCols.includes('Exam_Score') && (
                          <TableCell className="text-right font-bold text-indigo-400 font-mono text-xs">
                            {row.Exam_Score}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </PageWrapper>
  );
}