import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sun, Moon, Dumbbell, HeartPulse, User, Cake, Target, Zap, MapPin, Soup, Info, Weight, Ruler, ChevronsUpDown,
  Loader, AlertTriangle, Brain, Salad, Apple, Fish, Beef, CheckSquare, Sparkles, Wand2,
  Volume2, Play, StopCircle, Coffee,
  X, // For Modal
  Trash2 // For Clear Plan
} from 'lucide-react';

// --- LOCAL STORAGE HELPERS (Chapter 7) ---
const useStickyState = (defaultValue, key) => {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    try {
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (e) {
      console.error("Failed to parse local storage key", key, e);
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

// --- OPTIMIZED HELPER COMPONENTS ---

const FormInput = ({ id, label, type = 'text', value, onChange, icon: Icon, placeholder }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      />
    </div>
  </div>
);

const FormSelect = ({ id, label, value, onChange, icon: Icon, options }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <ChevronsUpDown className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  </div>
);

// --- OPTIMIZED PLAN DISPLAY COMPONENTS ---

const WorkoutPlan = ({ plan, onExerciseClick, onPlayAudio, isSpeaking, currentlyPlaying }) => (
  <div className="space-y-4">
    {plan.daily_routine.map((day) => (
      <div key={day.day} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500 rounded-lg">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-base text-slate-900 dark:text-white">{day.day}</h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">{day.focus}</p>
            </div>
          </div>
          <button
            onClick={() => onPlayAudio(day.day, `Workout for ${day.day}: ${day.focus}. ${day.exercises.map(ex => `${ex.name}: ${ex.sets} sets of ${ex.reps}`).join('. ')}`)}
            className="p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            aria-label={`Read ${day.day} workout`}
          >
            {isSpeaking && currentlyPlaying === day.day ? 
              <StopCircle className="w-5 h-5" /> : 
              <Play className="w-5 h-5" />
            }
          </button>
        </div>
        <ul className="space-y-2">
          {day.exercises.map((ex) => (
            <li 
              key={ex.name}
              className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all group"
              onClick={() => onExerciseClick(ex.name, "A clear, high-quality, realistic photo of a person performing a " + ex.name)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                  <Zap className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm text-slate-900 dark:text-slate-100 block truncate">{ex.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{ex.sets} sets × {ex.reps} • {ex.rest} rest</span>
                </div>
              </div>
              <Wand2 className="w-4 h-4 text-indigo-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

const getMealIcon = (mealType) => {
  const icons = {
    breakfast: { Icon: Coffee, color: 'text-amber-500' },
    lunch: { Icon: Salad, color: 'text-green-500' },
    dinner: { Icon: Fish, color: 'text-blue-500' },
    snacks: { Icon: Apple, color: 'text-red-500' }
  };
  return icons[mealType] || { Icon: Beef, color: 'text-slate-500' };
};

const DietPlan = ({ plan, onMealClick, onPlayAudio, isSpeaking, currentlyPlaying }) => (
  <div className="space-y-4">
    {plan.meal_plan.map((mealDay) => (
      <div key={mealDay.day} className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-500 rounded-lg">
              <Soup className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-semibold text-base text-slate-900 dark:text-white">{mealDay.day}</h4>
          </div>
          <button
            onClick={() => onPlayAudio(mealDay.day, `Diet for ${mealDay.day}: ${Object.entries(mealDay.meals).map(([type, meal]) => `${type}: ${meal.name}.`).join(' ')}`)}
            className="p-2 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
            aria-label={`Read ${mealDay.day} diet`}
          >
            {isSpeaking && currentlyPlaying === mealDay.day ? 
              <StopCircle className="w-5 h-5" /> : 
              <Play className="w-5 h-5" />
            }
          </button>
        </div>
        <div className="space-y-2">
          {Object.entries(mealDay.meals).map(([mealType, meal]) => {
            const { Icon, color } = getMealIcon(mealType);
            return (
              <div 
                key={mealType} 
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-green-300 dark:hover:border-green-600 hover:shadow-md transition-all group"
                onClick={() => onMealClick(meal.name, "A delicious, high-resolution, food-photography style photo of " + meal.name)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md group-hover:bg-opacity-80 transition-colors`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm text-slate-900 dark:text-slate-100 capitalize">{mealType}</h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate">{meal.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{meal.description} • {meal.calories} cal</p>
                  </div>
                </div>
                <Wand2 className="w-4 h-4 text-green-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

const AiTips = ({ tips }) => (
  <div className="space-y-4">
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-blue-500 rounded-lg">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <h4 className="font-semibold text-lg text-slate-900 dark:text-white">Lifestyle & Posture Tips</h4>
      </div>
      <ul className="space-y-2">
        {tips.lifestyle_tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <CheckSquare className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-5 rounded-xl border border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-amber-500 rounded-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <h4 className="font-semibold text-lg text-slate-900 dark:text-white">Your Motivation</h4>
      </div>
      <p className="text-slate-700 dark:text-slate-300 italic text-sm leading-relaxed">"{tips.motivation}"</p>
    </div>
  </div>
);

const PlanDisplay = ({ plan, onRegenerate, onClearPlan, onActionItemClick, onPlayAudio, isSpeaking, currentlyPlaying }) => {
  const [activeTab, setActiveTab] = useState('workout');

  const readFullPlan = () => {
    const workoutText = `Here is your workout plan. ${plan.workout_plan.daily_routine.map(day => `${day.day}, ${day.focus}: ${day.exercises.map(ex => ex.name).join(', ')}`).join('. ')}`;
    const dietText = `Here is your diet plan. ${plan.diet_plan.meal_plan.map(day => `${day.day}: ${Object.entries(day.meals).map(([type, meal]) => `${type}: ${meal.name}`).join(', ')}`).join('. ')}`;
    
    let textToRead = "";
    if (activeTab === 'workout') textToRead = workoutText;
    else if (activeTab === 'diet') textToRead = dietText;
    else textToRead = `Here are your AI tips. ${plan.ai_tips.lifestyle_tips.join('. ')}. And for motivation: ${plan.ai_tips.motivation}`;
    
    onPlayAudio('fullPlan', textToRead);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your AI-Generated Plan</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={readFullPlan}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-3 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2 text-sm"
          >
            {isSpeaking && currentlyPlaying === 'fullPlan' ? 
              <StopCircle className="w-4 h-4" /> : 
              <Volume2 className="w-4 h-4" />
            }
            {isSpeaking && currentlyPlaying === 'fullPlan' ? 'Stop' : 'Read Plan'}
          </button>
          <button
            onClick={onRegenerate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-3 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2 text-sm"
          >
            <Brain className="w-4 h-4" />
            Regenerate
          </button>
          <button
            onClick={onClearPlan}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
        </div>
      </div>

      <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
          {[
            { id: 'workout', label: 'Workout', icon: Dumbbell },
            { id: 'diet', label: 'Diet', icon: Soup },
            { id: 'tips', label: 'AI Tips', icon: CheckSquare }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === 'workout' && <WorkoutPlan plan={plan.workout_plan} onExerciseClick={onActionItemClick} onPlayAudio={onPlayAudio} isSpeaking={isSpeaking} currentlyPlaying={currentlyPlaying} />}
        {activeTab === 'diet' && <DietPlan plan={plan.diet_plan} onMealClick={onActionItemClick} onPlayAudio={onPlayAudio} isSpeaking={isSpeaking} currentlyPlaying={currentlyPlaying} />}
        {activeTab === 'tips' && <AiTips tips={plan.ai_tips} />}
      </div>
    </div>
  );
};

// --- IMAGE MODAL COMPONENT (Chapter 6) ---
const ImageModal = ({ isOpen, onClose, title, imageUrl, isLoading }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
    >
      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 transform scale-95 opacity-0 animate-fade-in-scale"
        style={{ animationFillMode: 'forwards' }} // Keep final state of animation
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Image Area */}
        <div className="p-4">
          <div className="aspect-square w-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
            {isLoading && (
              <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                <Loader className="w-10 h-10 animate-spin text-indigo-500" />
                <span className="mt-3 text-sm font-medium">Generating image...</span>
              </div>
            )}
            {!isLoading && imageUrl && (
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-cover" 
              />
            )}
            {!isLoading && !imageUrl && (
              <div className="flex flex-col items-center text-center p-4 text-red-500">
                <AlertTriangle className="w-10 h-10" />
                <span className="mt-3 text-sm font-medium">Failed to generate image.</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add keyframes for animation */}
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

// --- JSON SCHEMA ---
const JSON_SCHEMA = {
  type: "OBJECT",
  properties: {
    workout_plan: {
      type: "OBJECT",
      properties: {
        daily_routine: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              day: { type: "STRING" },
              focus: { type: "STRING" },
              exercises: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    sets: { type: "STRING" },
                    reps: { type: "STRING" },
                    rest: { type: "STRING" }
                  }
                }
              }
            }
          }
        }
      }
    },
    diet_plan: {
      type: "OBJECT",
      properties: {
        meal_plan: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              day: { type: "STRING" },
              meals: {
                type: "OBJECT",
                properties: {
                  breakfast: { type: "OBJECT", properties: { name: { type: "STRING" }, description: { type: "STRING" }, calories: { type: "NUMBER" } } },
                  lunch: { type: "OBJECT", properties: { name: { type: "STRING" }, description: { type: "STRING" }, calories: { type: "NUMBER" } } },
                  dinner: { type: "OBJECT", properties: { name: { type: "STRING" }, description: { type: "STRING" }, calories: { type: "NUMBER" } } },
                  snacks: { type: "OBJECT", properties: { name: { type: "STRING" }, description: { type: "STRING" }, calories: { type: "NUMBER" } } }
                }
              }
            }
          }
        }
      }
    },
    ai_tips: {
      type: "OBJECT",
      properties: {
        lifestyle_tips: { type: "ARRAY", items: { type: "STRING" } },
        motivation: { type: "STRING" }
      }
    }
  }
};

// --- TTS HELPERS ---
const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const pcmToWav = (pcmData, sampleRate) => {
  const numSamples = pcmData.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + numSamples * 2, true); // File size
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // Audio format 1 (PCM)
  view.setUint16(22, 1, true); // Number of channels 1
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, sampleRate * 2, true); // Byte rate (SampleRate * NumChannels * BitsPerSample/8)
  view.setUint16(32, 2, true); // Block align (NumChannels * BitsPerSample/8)
  view.setUint16(34, 16, true); // Bits per sample
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, numSamples * 2, true); // Data size

  // pcmData is Int16Array
  const pcm16 = new Int16Array(pcmData.buffer);
  for (let i = 0; i < numSamples; i++) {
    view.setInt16(44 + i * 2, pcm16[i], true);
  }

  return new Blob([view], { type: 'audio/wav' });
};

// --- MAIN APP ---
export default function App() {
  // --- State ---
  // Use sticky state for persistence (Chapter 7)
  const [darkMode, setDarkMode] = useStickyState(true, 'ai-fitness-dark-mode');
  const [formData, setFormData] = useStickyState({
    name: 'Jane Doe',
    age: '30',
    gender: 'Female',
    height: '165',
    weight: '70',
    fitnessGoal: 'Weight Loss',
    fitnessLevel: 'Beginner',
    workoutLocation: 'Home (Basic Equipment)',
    dietaryPreference: 'Vegetarian',
    medicalHistory: 'None',
  }, 'ai-fitness-form-data');
  const [generatedPlan, setGeneratedPlan] = useStickyState(null, 'ai-fitness-generated-plan');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRef = useRef(null);

  // Image Modal State (Chapter 6)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', imageUrl: null });

  // --- Effects ---
  useEffect(() => {
    // This effect now just toggles the class
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    // Cleanup audio element on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // --- Form Handling ---
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, [setFormData]);

  // --- API: Generate Plan (Gemini) ---
  const callGeminiApi = async (payload, retries = 3) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const result = await response.json();
        const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) return JSON.parse(jsonText);
        throw new Error("Invalid response structure");
      } catch (error) {
        console.error(`Gemini API attempt ${i + 1} failed:`, error);
        if (i === retries - 1) throw error;
        await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
      }
    }
  };

  // --- API: Generate TTS (Gemini TTS) ---
  const callGeminiTtsApi = async (textToSpeak, retries = 3) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: `Say with a friendly and encouraging tone: ${textToSpeak}` }] }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
      },
      model: "gemini-2.5-flash-preview-tts" // Explicitly setting model
    };

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`TTS API Error: ${response.status}`);

        const result = await response.json();
        const part = result?.candidates?.[0]?.content?.parts?.[0];
        const audioData = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType;

        if (audioData && mimeType?.startsWith("audio/")) {
          const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)[1], 10);
          const pcmData = base64ToArrayBuffer(audioData);
          const wavBlob = pcmToWav(new Int16Array(pcmData), sampleRate);
          return URL.createObjectURL(wavBlob);
        }
        throw new Error("Invalid TTS response");
      } catch (error) {
        console.error(`TTS API attempt ${i + 1} failed:`, error);
        if (i === retries - 1) throw error;
        await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
      }
    }
  };

  // --- API: Generate Image (Imagen) (Chapter 6) ---
  const callImagenApi = async (prompt, retries = 3) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

    const payload = {
      instances: [{ prompt: prompt }],
      parameters: { "sampleCount": 1 }
    };

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Imagen API Error: ${response.status}`);

        const result = await response.json();
        if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
          return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        }
        throw new Error("Invalid Imagen response structure");
      } catch (error) {
        console.error(`Imagen API attempt ${i + 1} failed:`, error);
        if (i === retries - 1) throw error;
        await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
      }
    }
  };

  // --- Audio Controls ---
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
      setIsSpeaking(false);
      setCurrentlyPlaying(null);
    }
  }, []);

  const handlePlayAudio = useCallback(async (itemId, textToSpeak) => {
    if (isSpeaking && currentlyPlaying === itemId) {
      stopAudio();
      return;
    }
    if (isSpeaking) stopAudio();

    setIsSpeaking(true);
    setCurrentlyPlaying(itemId);

    try {
      const audioUrl = await callGeminiTtsApi(textToSpeak);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.play();
      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };
    } catch (error) {
      console.error("TTS Error:", error);
      setErrorMessage("Couldn't play audio. Please try again.");
      setIsSpeaking(false);
      setCurrentlyPlaying(null);
    }
  }, [isSpeaking, currentlyPlaying, stopAudio]);

  // --- Main Form Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    stopAudio();
    setIsLoading(true);
    setGeneratedPlan(null); // Clear old plan before generating new one
    setErrorMessage(null);

    const systemPrompt = `You are a world-class AI fitness and nutrition coach. Generate a comprehensive 7-day fitness and diet plan in strict JSON format matching the schema. Base it on: ${JSON.stringify(formData)}. Include safety considerations for any medical history. Provide specific exercises and meals.`;

    const payload = {
      contents: [{ parts: [{ text: `Generate a 7-day workout and diet plan. User: ${JSON.stringify(formData)}` }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: JSON_SCHEMA
      }
    };
    
    try {
      const plan = await callGeminiApi(payload);
      setGeneratedPlan(plan); // This will trigger the useEffect to save it
    } catch (error) {
      setErrorMessage("Failed to generate plan. The AI might be busy or an error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Image Modal Click Handler (Chapter 6) ---
  const handleActionItemClick = useCallback(async (name, prompt) => {
    setIsModalOpen(true);
    setIsImageLoading(true);
    setModalContent({ title: name, imageUrl: null });

    try {
      const imageUrl = await callImagenApi(prompt);
      setModalContent({ title: name, imageUrl: imageUrl });
    } catch (error) {
      console.error("Error generating image:", error);
      setModalContent({ title: name, imageUrl: null }); // Keep title, but show error (imageUrl: null)
    } finally {
      setIsImageLoading(false);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // --- Clear Plan Handler (Chapter 7) ---
  const handleClearPlan = () => {
    stopAudio();
    setGeneratedPlan(null);
    setErrorMessage(null);
    // No need to clear localStorage manually, useStickyState does it
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100">
      
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Fitness Coach</h1>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {/* FIX: Corrected w-V to w-5 */}
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            
          {/* LEFT COLUMN - FORM */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 bg-white dark:bg-slate-950/70 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Details</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                  id="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  icon={User}
                  placeholder="e.g., Jane Doe"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    id="age"
                    label="Age"
                    type="number"
                    value={formData.age}
                    onChange={handleFormChange}
                    icon={Cake}
                    placeholder="30"
                  />
                  <FormSelect
                    id="gender"
                    label="Gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    icon={User}
                    options={['Male', 'Female', 'Other']}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    id="height"
                    label="Height (cm)"
                    type="number"
                    value={formData.height}
                    onChange={handleFormChange}
                    icon={Ruler}
                    placeholder="165"
                  />
                  <FormInput
                    id="weight"
                    label="Weight (kg)"
                    type="number"
                    value={formData.weight}
                    onChange={handleFormChange}
                    icon={Weight}
                    placeholder="70"
                  />
                </div>

                <FormSelect
                  id="fitnessGoal"
                  label="Fitness Goal"
                  value={formData.fitnessGoal}
                  onChange={handleFormChange}
                  icon={Target}
                  options={['Weight Loss', 'Muscle Gain', 'General Fitness', 'Improve Endurance']}
                />

                <FormSelect
                  id="fitnessLevel"
                  label="Current Fitness Level"
                  value={formData.fitnessLevel}
                  onChange={handleFormChange}
                  icon={Zap}
                  options={['Beginner', 'Intermediate', 'Advanced']}
                />

                <FormSelect
                  id="workoutLocation"
                  label="Workout Location"
                  value={formData.workoutLocation}
                  onChange={handleFormChange}
                  icon={MapPin}
                  options={['Home (No Equipment)', 'Home (Basic Equipment)', 'Gym', 'Outdoor']}
                />

                <FormSelect
                  id="dietaryPreference"
                  label="Dietary Preference"
                  value={formData.dietaryPreference}
                  onChange={handleFormChange}
                  icon={Soup}
                  options={['Non-Vegetarian', 'Vegetarian', 'Vegan', 'Keto', 'Paleo']}
                />

                <FormInput
                  id="medicalHistory"
                  label="Medical History (Optional)"
                  value={formData.medicalHistory}
                  onChange={handleFormChange}
                  icon={Info}
                  placeholder="e.g., Knee injury, allergies"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Generate My Plan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN - PLAN */}
          <div className="lg:col-span-2 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-slate-950/70 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 min-h-[600px]">
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full py-20">
                  <div className="relative">
                    <Loader className="w-16 h-16 text-indigo-500 animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 rounded-full animate-pulse"></div>
                  </div>
                  <h2 className="mt-8 text-2xl font-bold text-slate-900 dark:text-white">
                    Generating Your Personal Plan
                  </h2>
                  <p className="mt-3 text-base text-slate-600 dark:text-slate-400 text-center max-w-md">
                    The AI is analyzing your profile and creating a customized workout and diet plan...
                  </p>
                </div>
              )}

              {errorMessage && (
                <div className="flex flex-col items-center justify-center h-full py-20">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
                    <AlertTriangle className="w-16 h-16 text-red-500" />
                  </div>
                  <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
                    Something Went Wrong
                  </h2>
                  <p className="mt-3 text-base text-slate-600 dark:text-slate-400 text-center max-w-md">
                    {errorMessage}
                  </p>
                  <button
                    onClick={handleSubmit}
                    className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!isLoading && !errorMessage && !generatedPlan && (
                <div className="flex flex-col items-center justify-center h-full py-20">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
                    <HeartPulse className="w-16 h-16 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
                    Your Personal Plan Awaits
                  </h2>
                  <p className="mt-3 text-base text-slate-600 dark:text-slate-400 text-center max-w-md">
                    Fill out your details on the left, and your AI-powered workout and diet plan will appear here instantly!
                  </p>
                  <div className="mt-8 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-green-500" />
                      <span>Personalized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-green-500" />
                      <span>Science-Based</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-green-500" />
                      <span>7-Day Plan</span>
                    </div>
                  </div>
                </div>
              )}

              {generatedPlan && (
                <PlanDisplay 
                  plan={generatedPlan} 
                  onRegenerate={() => handleSubmit(new Event('submit'))}
                  onClearPlan={handleClearPlan}
                  onActionItemClick={handleActionItemClick} // <-- Wired up
                  onPlayAudio={handlePlayAudio}
                  isSpeaking={isSpeaking}
                  currentlyPlaying={currentlyPlaying}
                />
              )}
              
            </div>
          </div>

        </div>
      </main>

      {/* --- RENDER THE MODAL (Chapter 6) --- */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent.title}
        imageUrl={modalContent.imageUrl}
        isLoading={isImageLoading}
      />
    </div>
  );
}


