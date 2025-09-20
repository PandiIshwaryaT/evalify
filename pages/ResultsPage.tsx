import React, { useEffect, useState } from 'react';
import { getResultsFromLocalStorage } from '../services/geminiService';
import { OMRResult } from '../types';
import { Download } from 'lucide-react';

const ResultsPage: React.FC = () => {
    const [results, setResults] = useState<OMRResult[]>([]);

    useEffect(() => {
        setResults(getResultsFromLocalStorage());
    }, []);

    const subjectHeaders = results.length > 0 ? Object.keys(results[0].subjectScores) : [];

    const handleExportCSV = () => {
        if (results.length === 0) return;

        const headers = [
            "Evaluation Date",
            "Evaluation Name",
            "File Name",
            "Answer Key",
            ...subjectHeaders,
            "Total Score"
        ];

        const csvRows = results.map(result => {
            const rowData = [
                `"${new Date(result.evaluationDate).toLocaleString()}"`,
                `"${result.evaluationName || ''}"`,
                `"${result.imageFileName}"`,
                `"${result.answerKeyId}"`
            ];

            subjectHeaders.forEach(subject => {
                const scoreInfo = result.subjectScores[subject];
                rowData.push(scoreInfo ? `"${scoreInfo.score}/${scoreInfo.total}"` : '"N/A"');
            });
            
            rowData.push(`"${result.totalScore}/100"`);

            return rowData.join(',');
        });

        const csvString = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'evalify_results.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">All Evaluation Results</h1>
                <button
                    onClick={handleExportCSV}
                    disabled={results.length === 0}
                    className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="border-b-2 border-slate-200 bg-indigo-50 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                <th className="px-5 py-3">Evaluation Date</th>
                                <th className="px-5 py-3">Evaluation Name</th>
                                <th className="px-5 py-3">File Name</th>
                                <th className="px-5 py-3">Answer Key</th>
                                {subjectHeaders.map(subject => (
                                  <th key={subject} className="px-5 py-3 text-center">{subject}</th>
                                ))}
                                <th className="px-5 py-3 text-right">Total Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.length > 0 ? results.map((result, index) => (
                                <tr key={result.id} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-indigo-50/70`}>
                                    <td className="px-5 py-4 text-sm text-slate-700">
                                        {new Date(result.evaluationDate).toLocaleString()}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-700 font-medium">
                                        {result.evaluationName || '--'}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-700 truncate max-w-xs">
                                        {result.imageFileName}
                                    </td>
                                    <td className="px-5 py-4 text-sm">
                                        <span className="bg-slate-200 text-slate-700 py-1 px-3 rounded-full text-xs font-medium">
                                            {result.answerKeyId}
                                        </span>
                                    </td>
                                    {subjectHeaders.map((subject) => (
                                      <td key={subject} className="px-5 py-4 text-sm text-center text-slate-700">
                                        {result.subjectScores[subject] ? `${result.subjectScores[subject].score}/${result.subjectScores[subject].total}` : 'N/A'}
                                      </td>
                                    ))}
                                    <td className="px-5 py-4 text-sm text-right">
                                        <span className={`font-semibold ${result.totalScore > 75 ? 'text-green-600' : result.totalScore > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {result.totalScore} / 100
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5 + subjectHeaders.length} className="text-center py-10 text-slate-500">
                                        No results found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;