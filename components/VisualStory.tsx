import React from "react";
import { rabbitTurtleScenes } from "../data/rabbitTurtleScenes";

interface VisualStoryProps {
  onClose: () => void;
}

const VisualStory: React.FC<VisualStoryProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="backdrop-blur-lg bg-white/70 rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative border border-pink-200 overflow-y-auto" style={{ maxHeight: '90vh' }}>
        <button
          className="absolute left-4 top-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm"
          onClick={onClose}
        >بند کریں</button>
        <h2 className="font-extrabold text-2xl text-pink-700 mb-4 text-center">خرگوش اور کچھوا</h2>
        <div className="space-y-10">
          {rabbitTurtleScenes.map((scene, idx) => (
            scene.ending ? (
              <div key={idx} className="flex items-center justify-center">
                <div className="w-full text-center text-lg text-blue-900 font-bold bg-blue-100/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-blue-300">
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
                <img src={scene.img} alt={`Scene ${idx + 1}`} className="md:w-1/2 w-full rounded-xl shadow-lg object-contain" />
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualStory;
