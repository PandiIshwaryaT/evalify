import React from 'react';
import { HelpCircle, Upload, BarChart3, AlertTriangle } from 'lucide-react';

const FAQItem = ({ question, children }: { question: string, children: React.ReactNode }) => (
  <details className="group border-b border-slate-200 py-4">
    <summary className="flex items-center justify-between font-medium text-slate-800 cursor-pointer list-none">
      <span>{question}</span>
      <span className="transition-transform duration-300 group-open:rotate-180">
        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
      </span>
    </summary>
    <div className="text-slate-600 mt-3 prose prose-sm max-w-none">
      {children}
    </div>
  </details>
);

const HelpPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Help & FAQ</h1>
          <p className="text-slate-500">Find answers to common questions about using Evalify.</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
            {/* Getting Started */}
            <h2 className="text-xl font-semibold text-slate-700 flex items-center"><HelpCircle className="mr-2 text-indigo-600"/>Getting Started</h2>
            <FAQItem question="How do I log into the application?">
              <p>
                To get started, use the default credentials provided on the login page:
              </p>
              <ul>
                <li><strong>Email:</strong> <code>evaluator@innomatics.com</code></li>
                <li><strong>Password:</strong> <code>password123</code></li>
              </ul>
              <p>You can also update your name on the Dashboard page to personalize your experience.</p>
            </FAQItem>

            {/* Uploading & Evaluating */}
            <h2 className="text-xl font-semibold text-slate-700 flex items-center pt-4"><Upload className="mr-2 text-indigo-600"/>Uploading & Evaluating</h2>
            <FAQItem question="How do I evaluate an OMR sheet?">
              <p>Follow these simple steps on the <strong>OMR Verifier</strong> page:</p>
              <ol>
                <li>Click the "Upload a file" button or drag and drop an image of your OMR sheet into the designated area.</li>
                <li>Ensure the correct answer key version is selected from the dropdown menu (e.g., 'Version A').</li>
                <li>Click the "Evaluate Sheet" button.</li>
                <li>The results, including total score, subject scores, and a detailed answer grid, will appear on the right side of the screen.</li>
              </ol>
            </FAQItem>
            <FAQItem question="What are the best practices for OMR sheet images?">
              <p>For the most accurate results, please ensure your image is:</p>
              <ul>
                <li><strong>Clear and in focus:</strong> Avoid blurry images.</li>
                <li><strong>Well-lit:</strong> Make sure there are no strong shadows or glare covering the bubbles.</li>
                <li><strong>Properly aligned:</strong> The sheet should be flat and not photographed at a sharp angle.</li>
                <li><strong>High-resolution:</strong> A higher quality image allows the AI to better detect the marked bubbles.</li>
              </ul>
            </FAQItem>

            {/* Understanding Results */}
             <h2 className="text-xl font-semibold text-slate-700 flex items-center pt-4"><BarChart3 className="mr-2 text-indigo-600"/>Understanding Results</h2>
            <FAQItem question="How do I interpret the detected answers grid?">
               <p>The grid on the <strong>OMR Verifier</strong> page gives you a question-by-question breakdown:</p>
              <ul>
                <li><span className="font-semibold text-green-600">Green background:</span> Indicates a correct answer.</li>
                <li><span className="font-semibold text-red-600">Red background:</span> Indicates an incorrect answer. The correct answer is shown in parentheses, e.g., <code className="text-slate-500">(A)</code>.</li>
                 <li>A hyphen <code className="font-mono">-</code> indicates the question was left blank.</li>
              </ul>
            </FAQItem>
             <FAQItem question="Where can I see all past evaluations?">
              <p>
                All completed evaluations are stored and can be viewed on the <strong>Results</strong> page. The table provides a summary of each evaluation, including the date, filename, answer key used, and total score.
              </p>
            </FAQItem>

            {/* Troubleshooting */}
            <h2 className="text-xl font-semibold text-slate-700 flex items-center pt-4"><AlertTriangle className="mr-2 text-indigo-600"/>Troubleshooting</h2>
            <FAQItem question="Why did the evaluation fail or give an error?">
                <p>An evaluation can fail for a few reasons:</p>
                <ul>
                    <li><strong>Poor Image Quality:</strong> This is the most common cause. If the image is blurry, skewed, or poorly lit, the AI may not be able to process it. Please try taking another picture.</li>
                    <li><strong>Unsupported Format:</strong> Ensure you are uploading a standard image file (like PNG, JPG, or GIF).</li>
                    <li><strong>AI Model Issue:</strong> On rare occasions, the AI service may be temporarily unavailable. Please wait a moment and try again.</li>
                </ul>
            </FAQItem>
             <FAQItem question="Why is the Dashboard or Analytics page empty?">
                <p>
                    The <strong>Dashboard</strong> and <strong>Analytics</strong> pages generate charts and statistics based on your evaluation history. If you haven't evaluated any OMR sheets yet, these pages will be empty. Once you evaluate your first sheet, the data will appear automatically.
                </p>
            </FAQItem>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;