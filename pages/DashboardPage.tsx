import React, { useEffect, useState, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getResultsFromLocalStorage } from '../services/geminiService';
import { OMRResult } from '../types';
import { SUBJECTS } from '../constants';
import { FileCheck2, Star, Percent, Hourglass } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [results, setResults] = useState<OMRResult[]>([]);

    useEffect(() => {
        setResults(getResultsFromLocalStorage());
    }, []);

    const totalEvaluations = results.length;
    const averageScore = totalEvaluations > 0 
        ? (results.reduce((sum, r) => sum + r.totalScore, 0) / totalEvaluations).toFixed(2)
        : 0;

    const subjectAverages = Object.keys(SUBJECTS).map(subjectName => {
        const totalScoreForSubject = results.reduce((sum, result) => {
            return sum + (result.subjectScores[subjectName]?.score || 0);
        }, 0);
        const subjectTotalQuestions = SUBJECTS[subjectName].end - SUBJECTS[subjectName].start + 1;
        const average = totalEvaluations > 0 ? (totalScoreForSubject / totalEvaluations) : 0;
        
        return {
            name: subjectName,
            'Average Score': parseFloat(average.toFixed(2)),
            'Total Marks': subjectTotalQuestions,
        };
    });
    
    const scoreDistribution = [
        { name: '90-100', value: results.filter(r => r.totalScore >= 90).length },
        { name: '80-89', value: results.filter(r => r.totalScore >= 80 && r.totalScore < 90).length },
        { name: '70-79', value: results.filter(r => r.totalScore >= 70 && r.totalScore < 80).length },
        { name: '60-69', value: results.filter(r => r.totalScore >= 60 && r.totalScore < 70).length },
        { name: '<60', value: results.filter(r => r.totalScore < 60).length },
    ].filter(d => d.value > 0);

    const COLORS = ['#312E81', '#4338CA', '#4F46E5', '#6366F1', '#818CF8'];
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user?.name || 'Evaluator'}!</h1>
                <p className="text-slate-500 mt-1">You have evaluated <span className="font-bold text-indigo-600">{totalEvaluations}</span> sheets. There are <span className="font-bold text-slate-700">0</span> sheets pending evaluation.</p>
            </div>
            
            {totalEvaluations === 0 ? (
                <div className="flex items-center justify-center h-96 bg-white rounded-lg shadow-md">
                    <p className="text-xl text-slate-500">No evaluation data available. Please evaluate some OMR sheets first.</p>
                </div>
            ) : (
             <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <div className="bg-blue-100 p-4 rounded-full mr-4">
                            <FileCheck2 className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Evaluations</p>
                            <p className="text-3xl font-bold text-slate-800">{totalEvaluations}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <div className="bg-green-100 p-4 rounded-full mr-4">
                            <Star className="h-8 w-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Overall Average Score</p>
                            <p className="text-3xl font-bold text-slate-800">{averageScore}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <div className="bg-yellow-100 p-4 rounded-full mr-4">
                            <Percent className="h-8 w-8 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Average Percentage</p>
                            <p className="text-3xl font-bold text-slate-800">{`${averageScore}%`}</p>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                        <div className="bg-orange-100 p-4 rounded-full mr-4">
                            <Hourglass className="h-8 w-8 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Sheets Pending</p>
                            <p className="text-3xl font-bold text-slate-800">0</p>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    <div className="xl:col-span-3 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-slate-700 mb-4">Average Score by Subject</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={subjectAverages}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Average Score" fill="#4F46E5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-slate-700 mb-4">Score Distribution</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={scoreDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    dataKey="value"
                                    // Fix: The 'percent' property can be undefined or a string. Coerce to a number for calculation.
                                    label={({ name, percent }) => `${name} (${(Number(percent || 0) * 100).toFixed(0)}%)`}
                                >
                                    {scoreDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </>
            )}
        </div>
    );
};

export default DashboardPage;