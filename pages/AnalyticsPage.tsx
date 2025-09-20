import React, { useEffect, useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line
} from 'recharts';
import { getResultsFromLocalStorage } from '../services/geminiService';
import { OMRResult } from '../types';
import { SUBJECTS } from '../constants';

const AnalyticsPage: React.FC = () => {
    const [results, setResults] = useState<OMRResult[]>([]);

    useEffect(() => {
        setResults(getResultsFromLocalStorage());
    }, []);

    const analyticsData = useMemo(() => {
        if (results.length === 0) {
            return null;
        }

        // 1. Score Distribution Data
        const scoreBins: { [key: string]: number } = {
            '0-10': 0, '11-20': 0, '21-30': 0, '31-40': 0, '41-50': 0,
            '51-60': 0, '61-70': 0, '71-80': 0, '81-90': 0, '91-100': 0,
        };
        results.forEach(r => {
            if (r.totalScore > 90) scoreBins['91-100']++;
            else if (r.totalScore > 80) scoreBins['81-90']++;
            else if (r.totalScore > 70) scoreBins['71-80']++;
            else if (r.totalScore > 60) scoreBins['61-70']++;
            else if (r.totalScore > 50) scoreBins['51-60']++;
            else if (r.totalScore > 40) scoreBins['41-50']++;
            else if (r.totalScore > 30) scoreBins['31-40']++;
            else if (r.totalScore > 20) scoreBins['21-30']++;
            else if (r.totalScore > 10) scoreBins['11-20']++;
            else scoreBins['0-10']++;
        });
        const scoreDistribution = Object.entries(scoreBins).map(([name, count]) => ({ name, count }));

        // 2. Subject Performance Data
        const subjectPerformance = Object.keys(SUBJECTS).map(subjectName => {
            const totalScoreForSubject = results.reduce((sum, result) => sum + (result.subjectScores[subjectName]?.score || 0), 0);
            const subjectTotalQuestions = SUBJECTS[subjectName].end - SUBJECTS[subjectName].start + 1;
            const totalPossible = results.length * subjectTotalQuestions;
            const percentage = totalPossible > 0 ? parseFloat(((totalScoreForSubject / totalPossible) * 100).toFixed(2)) : 0;
            return {
                subject: subjectName,
                'Performance (%)': percentage,
                fullMark: 100,
            };
        });

        // 3. Evaluation Trend Data
        const evaluationTrend = [...results]
            .sort((a, b) => new Date(a.evaluationDate).getTime() - new Date(b.evaluationDate).getTime())
            .map((r, index) => ({
                name: `Eval #${index + 1}`,
                score: r.totalScore,
                date: new Date(r.evaluationDate).toLocaleDateString(),
            }));
            
        return { scoreDistribution, subjectPerformance, evaluationTrend };
    }, [results]);

    if (results.length === 0) {
        return (
             <div className="space-y-8">
                <h1 className="text-3xl font-bold text-slate-800">Evaluation Analytics</h1>
                <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-md">
                    <p className="text-xl text-slate-500">No analytics to display. Evaluate some sheets to get started.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Evaluation Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Score Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Score Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsData?.scoreDistribution} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="Number of Students" fill="#4F46E5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Subject Performance */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Subject Performance</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analyticsData?.subjectPerformance}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="Performance" dataKey="Performance (%)" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.6} />
                            <Tooltip />
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Evaluation Trend */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Evaluation Trend Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData?.evaluationTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: '#f3f4f6' }} labelFormatter={(value, payload) => payload[0]?.payload.date || value} />
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AnalyticsPage;