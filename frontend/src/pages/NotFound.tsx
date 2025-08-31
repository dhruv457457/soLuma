import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Home, ArrowLeft, Sparkles, Bot } from "lucide-react"; // you can replace Sparkles with any icon

export default function NotFound(): JSX.Element {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 overflow-hidden">
      <div className="text-center relative w-full max-w-4xl">
        {/* Animated 404 SVG */}
        <div className="mb-8 relative">
          <svg 
            className="w-80 h-32 sm:w-96 sm:h-36 md:w-[500px] md:h-40 lg:w-[600px] lg:h-48 mx-auto relative"
            viewBox="0 0 700 250" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* 404 Text Paths */}
            <g>
              <path 
                id="path4" 
                d="M195.7 232.67h-37.1V149.7H27.76c-2.64 0-5.1-.5-7.36-1.49-2.27-.99-4.23-2.31-5.88-3.96-1.65-1.65-2.95-3.61-3.89-5.88s-1.42-4.67-1.42-7.22V29.62h36.82v82.98H158.6V29.62h37.1v203.05z"
                stroke="#00d4ff"
                strokeWidth="2"
                fill="transparent"
                filter="url(#glow)"
                className="animate-draw-4"
              />
              <path 
                id="path0" 
                d="M470.69 147.71c0 8.31-1.06 16.17-3.19 23.58-2.12 7.41-5.12 14.28-8.99 20.6-3.87 6.33-8.45 11.99-13.74 16.99-5.29 5-11.07 9.28-17.35 12.81a85.146 85.146 0 0 1-20.04 8.14 83.637 83.637 0 0 1-21.67 2.83H319.3c-7.46 0-14.73-.94-21.81-2.83-7.08-1.89-13.76-4.6-20.04-8.14a88.292 88.292 0 0 1-17.35-12.81c-5.29-5-9.84-10.67-13.66-16.99-3.82-6.32-6.8-13.19-8.92-20.6-2.12-7.41-3.19-15.27-3.19-23.58v-33.13c0-12.46 2.34-23.88 7.01-34.27 4.67-10.38 10.92-19.33 18.76-26.83 7.83-7.5 16.87-13.36 27.12-17.56 10.24-4.2 20.93-6.3 32.07-6.3h66.41c7.36 0 14.58.94 21.67 2.83 7.08 1.89 13.76 4.6 20.04 8.14a88.292 88.292 0 0 1 17.35 12.81c5.29 5 9.86 10.67 13.74 16.99 3.87 6.33 6.87 13.19 8.99 20.6 2.13 7.41 3.19 15.27 3.19 23.58v33.14z"
                stroke="#00d4ff"
                strokeWidth="2"
                fill="transparent"
                filter="url(#glow)"
                className="animate-draw-0"
              />
              <path 
                id="path4-2" 
                d="M688.33 232.67h-37.1V149.7H520.39c-2.64 0-5.1-.5-7.36-1.49-2.27-.99-4.23-2.31-5.88-3.96-1.65-1.65-2.95-3.61-3.89-5.88s-1.42-4.67-1.42-7.22V29.62h36.82v82.98h112.57V29.62h37.1v203.05z"
                stroke="#00d4ff"
                strokeWidth="2"
                fill="transparent"
                filter="url(#glow)"
                className="animate-draw-4-2"
              />
            </g>
          </svg>

          {/* Icon inside the "0" */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Bot className="w-12 h-12 text-cyan-400" />
          </div>
        </div>

        {/* Glowing Text */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-cyan-400">
          Page Not Found
        </h1>
      </div>
    </div>
  );
}
