import React from 'react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: string;
  isLoading: boolean;
}

// A simple markdown to HTML converter for demonstration
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const htmlContent = content
      .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>') // Bold
      .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>') // Italic
      .replace(/`{1,3}(.*?)`{1,3}/g, '<code>$1</code>') // Inline code
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-2 mt-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-5">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mb-4 mt-6">$1</h1>')
      .replace(/^\* (.*$)/gim, '<li class="ml-6 mb-1">$1</li>') // List items
      .replace(/(<li.*>[\s\S]*?<\/li>)/g, '<ul>$1</ul>') // Wrap LIs in UL
      .replace(/<\/ul>\s*<ul>/g, '') // Combine adjacent ULs
      .replace(/\n/g, '<br />'); // Newlines

  return <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};


const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, analysisResult, isLoading }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            Analisis AI
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Menganalisis data... Mohon tunggu.</p>
            </div>
          ) : (
            <div id="analysis-content" className="text-gray-700 dark:text-gray-300 space-y-4">
              <MarkdownRenderer content={analysisResult} />
            </div>
          )}
        </div>
         <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center">
             <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Tutup
            </button>
         </div>
      </div>
    </div>
  );
};

export default AnalysisModal;