import React, { useState, useCallback, useEffect } from 'react';
import { Upload, CheckCircle, XCircle, Loader, FileText, Key, FileSignature, PlusCircle, Pencil, Image as ImageIcon } from 'lucide-react';
import { 
    evaluateOMRWithGemini, 
    calculateScores, 
    saveResultToLocalStorage, 
    addNotification, 
    getAllAnswerKeys, 
    saveCustomAnswerKey 
} from '../services/geminiService';
import { OMRResult, AnswerKey, DetectedAnswers } from '../types';
import { SUBJECTS } from '../constants';

const ManualKeyEntry: React.FC<{ answers: AnswerKey, setAnswers: React.Dispatch<React.SetStateAction<AnswerKey>> }> = ({ answers, setAnswers }) => {
    const handleAnswerChange = (qNum: number, value: string) => {
        const validValue = value.toUpperCase().match(/[A-E]/);
        setAnswers(prev => ({ ...prev, [qNum]: validValue ? validValue[0] as 'A'|'B'|'C'|'D'|'E' : '' }));
    };

    return (
        <div className="space-y-4">
            {Object.entries(SUBJECTS).map(([subjectName, { start, end }]) => (
                <div key={subjectName}>
                    <h4 className="font-semibold text-slate-600 mb-2">{subjectName} ({start}-{end})</h4>
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-x-2 gap-y-3">
                        {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(qNum => (
                            <div key={qNum} className="flex items-center">
                                <label htmlFor={`q-${qNum}`} className="text-xs text-slate-500 mr-1 w-6 text-right">{qNum}</label>
                                <input
                                    id={`q-${qNum}`}
                                    type="text"
                                    maxLength={1}
                                    value={answers[qNum] || ''}
                                    onChange={e => handleAnswerChange(qNum, e.target.value)}
                                    className="w-8 h-8 text-center border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};


const AnswerKeyModal: React.FC<{ onClose: () => void, onKeyAdded: (name: string) => void }> = ({ onClose, onKeyAdded }) => {
    const [keyName, setKeyName] = useState('');
    const [method, setMethod] = useState<'manual' | 'upload'>('manual');
    const [manualAnswers, setManualAnswers] = useState<AnswerKey>({});
    const [keyImageFile, setKeyImageFile] = useState<File | null>(null);
    const [keyImagePreview, setKeyImagePreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [modalError, setModalError] = useState('');

    const handleKeyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setKeyImageFile(file);
            setModalError('');
            const reader = new FileReader();
            reader.onloadend = () => setKeyImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!keyName.trim()) {
            setModalError('Please provide a name for the answer key.');
            return;
        }
        setModalError('');
        setIsSaving(true);

        try {
            let newKey: AnswerKey;
            if (method === 'manual') {
                const filledAnswers = Object.entries(manualAnswers)
                    .filter(([, value]) => value)
                    .reduce((obj, [key, value]) => ({...obj, [key]: value}), {});
                newKey = filledAnswers;
            } else {
                if (!keyImageFile) {
                    setModalError('Please upload an OMR sheet image for the key.');
                    setIsSaving(false);
                    return;
                }
                const detectedAnswers = await evaluateOMRWithGemini(keyImageFile);
                newKey = detectedAnswers;
            }
            saveCustomAnswerKey(keyName, newKey);
            onKeyAdded(keyName);
            onClose();
        } catch (err: any) {
            console.error(err);
            setModalError(err.message || 'Failed to save answer key. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" aria-modal="true">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 transform transition-all max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold text-slate-800">Create New Answer Key</h2>
                </div>
                <div className="p-6 space-y-6 overflow-y-auto">
                    <div>
                        <label htmlFor="key-name" className="block text-sm font-medium text-slate-700">Answer Key Name</label>
                        <input type="text" id="key-name" value={keyName} onChange={e => setKeyName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Final Exam 2024" />
                    </div>
                    <div className="border border-slate-200 rounded-lg p-1 bg-slate-100 flex space-x-1">
                        <button onClick={() => setMethod('manual')} className={`w-1/2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${method === 'manual' ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:bg-slate-200'}`}>
                           <Pencil className="inline h-4 w-4 mr-2"/> Manual Entry
                        </button>
                        <button onClick={() => setMethod('upload')} className={`w-1/2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${method === 'upload' ? 'bg-white shadow text-indigo-600' : 'text-slate-600 hover:bg-slate-200'}`}>
                           <ImageIcon className="inline h-4 w-4 mr-2"/> Upload OMR Image
                        </button>
                    </div>
                    {method === 'manual' ? (
                        <ManualKeyEntry answers={manualAnswers} setAnswers={setManualAnswers} />
                    ) : (
                        <div>
                            {!keyImagePreview ? (
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                                        <div className="flex text-sm text-slate-600"><label htmlFor="key-file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"><span>Upload a file</span><input id="key-file-upload" type="file" className="sr-only" onChange={handleKeyFileChange} accept="image/*" /></label><p className="pl-1">of a master OMR sheet.</p></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-2 rounded-md overflow-hidden border border-slate-200"><img src={keyImagePreview} alt="Key Preview" className="w-full h-auto" /></div>
                            )}
                        </div>
                    )}
                </div>
                <div className="p-6 border-t bg-slate-50 rounded-b-xl flex justify-between items-center">
                    {modalError && <p className="text-sm text-red-600">{modalError}</p>}
                    <div className="flex gap-3 ml-auto">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center">
                            {isSaving && <Loader className="animate-spin h-4 w-4 mr-2" />}
                            {isSaving ? 'Saving...' : 'Save Answer Key'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const VerifierPage: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [allAnswerKeys, setAllAnswerKeys] = useState<{ [key: string]: AnswerKey }>(() => getAllAnswerKeys());
  const [answerKeyId, setAnswerKeyId] = useState<string>(Object.keys(allAnswerKeys)[0] || '');

  const [evaluationName, setEvaluationName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OMRResult | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  const handleNewKeyAdded = (newKeyName: string) => {
    const updatedKeys = getAllAnswerKeys();
    setAllAnswerKeys(updatedKeys);
    setAnswerKeyId(newKeyName);
    addNotification({ type: 'success', message: `New answer key '${newKeyName}' added.` });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
      setEvaluationName('');
    }
  };

  const handleEvaluate = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an OMR sheet image first.');
      return;
    }
    if (!answerKeyId || !allAnswerKeys[answerKeyId]) {
      setError('Please select a valid answer key.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const detectedAnswers = await evaluateOMRWithGemini(imageFile);
      const currentAnswerKey = allAnswerKeys[answerKeyId];
      const evaluationResult = calculateScores(detectedAnswers, currentAnswerKey, imageFile.name, answerKeyId, evaluationName);
      saveResultToLocalStorage(evaluationResult);
      addNotification({ type: 'success', message: `Evaluation for '${imageFile.name}' is complete.` });
      setResult(evaluationResult);
    } catch (err) {
      console.error(err);
      setError('Failed to evaluate OMR sheet. The AI model might be unavailable or the image format is not supported. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, answerKeyId, evaluationName, allAnswerKeys]);
  
  const renderAnswerGrid = (answers: DetectedAnswers, answerKey: AnswerKey) => {
    return (
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 text-sm">
        {Object.entries(answers).sort(([a], [b]) => Number(a) - Number(b)).map(([qNum, detected]) => {
          const correct = answerKey[Number(qNum)];
          const isCorrect = detected === correct;
          return (
            <div key={qNum} className={`flex items-center justify-center p-2 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <span className="font-bold mr-2">{qNum}:</span>
              <span className={`font-mono`}>{detected || '-'}</span>
              { !isCorrect && <span className="font-mono text-slate-500 ml-1">({correct})</span>}
            </div>
          )
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">OMR Sheet Verifier</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="space-y-6">
            <div>
              <label htmlFor="file-upload" className="block text-lg font-medium text-slate-700 mb-2">Upload OMR Sheet</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="flex text-sm text-slate-600">
                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {imagePreview && (
              <div>
                <h3 className="text-md font-medium text-slate-700">Image Preview</h3>
                <div className="mt-2 rounded-md overflow-hidden border border-slate-200">
                  <img src={imagePreview} alt="OMR Preview" className="w-full h-auto" />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="answer-key" className="block text-lg font-medium text-slate-700 mb-2">Select Answer Key Version</label>
              <div className="flex items-stretch gap-2">
                <div className="relative flex-grow">
                   <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Key className="h-5 w-5 text-slate-400" />
                  </div>
                  <select 
                    id="answer-key"
                    className="block w-full pl-10 pr-3 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={answerKeyId}
                    onChange={(e) => setAnswerKeyId(e.target.value)}
                  >
                    {Object.keys(allAnswerKeys).map(key => <option key={key} value={key}>{key}</option>)}
                  </select>
                </div>
                <button onClick={() => setIsKeyModalOpen(true)} className="flex-shrink-0 flex items-center justify-center py-2 px-3 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors" title="Add New Answer Key">
                    <PlusCircle className="h-5 w-5"/>
                    <span className="ml-2 hidden sm:inline">New Key</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="evaluation-name" className="block text-lg font-medium text-slate-700 mb-2">Evaluation Name (Optional)</label>
              <div className="relative">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FileSignature className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="evaluation-name"
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  placeholder="e.g., Midterm Exam - John Doe"
                  value={evaluationName}
                  onChange={(e) => setEvaluationName(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleEvaluate}
              disabled={isLoading || !imageFile}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (<><Loader className="animate-spin h-5 w-5 mr-3" />Evaluating...</>) : ('Evaluate Sheet')}
            </button>

            {error && (<div className="flex items-center text-red-700 bg-red-100 p-3 rounded-md"><XCircle className="h-5 w-5 mr-2" /><span>{error}</span></div>)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
           <h2 className="text-2xl font-semibold text-slate-800 mb-4">Evaluation Results</h2>
            {result ? (
                <div className="space-y-6">
                    <div className="bg-indigo-50 p-6 rounded-lg text-center">
                        <p className="text-lg font-medium text-indigo-800">Total Score</p>
                        <p className="text-6xl font-bold text-indigo-600 mt-2">{result.totalScore}<span className="text-3xl text-slate-500">/100</span></p>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-slate-700 mb-2">Scores by Subject</h3>
                        <div className="space-y-2">
                          {Object.keys(result.subjectScores).map((subject) => {
                            const scores = result.subjectScores[subject];
                            return (
                              <div key={subject} className="flex justify-between items-center bg-slate-100 p-3 rounded-md">
                                  <span className="font-medium text-slate-600">{subject}</span>
                                  <span className="font-semibold text-slate-800">{scores.score} / {scores.total}</span>
                              </div>
                            );
                          })}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-medium text-slate-700 mb-2">Detected Answers</h3>
                        {renderAnswerGrid(result.detectedAnswers, allAnswerKeys[result.answerKeyId])}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                    <FileText className="h-16 w-16 mb-4"/>
                    <p className="text-lg">Upload an OMR sheet and click "Evaluate" to see the results here.</p>
                </div>
            )}
        </div>
      </div>
      {isKeyModalOpen && <AnswerKeyModal onClose={() => setIsKeyModalOpen(false)} onKeyAdded={handleNewKeyAdded} />}
    </div>
  );
};

export default VerifierPage;