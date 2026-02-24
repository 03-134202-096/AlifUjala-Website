import React from "react";

type Scene = {
  text: string;
  img?: string;
  ending?: boolean;
  redEnding?: boolean;
};

interface VisualStoryProps {
  onClose: () => void;
  title: string;
  scenes: Scene[];
}

const VisualStory: React.FC<VisualStoryProps> = ({ onClose, title, scenes }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative border border-purple-200 dark:border-purple-700 overflow-y-auto"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky close button */}
        <button
          className="sticky top-0 float-right z-10 w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold hover:bg-indigo-700 hover:scale-110 transition-all shadow-lg"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="font-extrabold text-2xl text-indigo-700 dark:text-purple-300 mb-4 text-center">{title}</h2>
        <div className="space-y-10">
          {scenes.map((scene, idx) => (
            scene.ending ? (
              <div key={idx} className="flex items-center justify-center">
                <div className="w-full text-center text-lg text-indigo-900 dark:text-indigo-200 font-bold bg-indigo-100/60 dark:bg-indigo-900/40 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-indigo-300 dark:border-indigo-600">
                  {scene.text}
                </div>
              </div>
            ) : scene.redEnding ? (
              <div key={idx} className="flex items-center justify-center mt-4">
                <div className="w-full text-center text-lg text-red-900 font-bold bg-red-100/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-red-300">
                  {scene.text}
                </div>
              </div>
            ) : (
              <div key={idx} className={`flex flex-col md:flex-row items-center justify-between gap-6 ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}> 
                <div className="md:w-1/2 w-full text-gray-800 leading-relaxed text-lg text-right bg-white/60 rounded-xl p-4 shadow">
                  {scene.text}
                </div>
                {scene.img && (
                  <img src={scene.img} alt={`Scene ${idx + 1}`} className="md:w-1/2 w-full rounded-xl shadow-lg object-contain" />
                )}
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualStory;
