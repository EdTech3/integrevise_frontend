interface SidebarProps {
    bgColorClass: string; // Tailwind background colour class
    patternColorClass: string; // Tailwind text colour class for the patterns
  }
  
  const Sidebar: React.FC<SidebarProps> = ({ bgColorClass, patternColorClass }) => {
    return (
      <div
        className={`relative w-full h-full flex items-center justify-center overflow-hidden ${bgColorClass}`}
      >
        {/* Outer Curved Lines */}
        <div className="absolute w-full h-full">
          <svg
            className={`w-full h-full ${patternColorClass}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 400"
            preserveAspectRatio="none"
          >
            <g stroke="currentColor" fill="none" strokeWidth="0.3">
              {/* Curved Lines */}
              {[...Array(40)].map((_, i) => (
                <path
                  key={i}
                  d={`M${i * 5},0 Q100,200 ${i * 5},400`}
                  strokeOpacity={0.3}
                />
              ))}
            </g>
          </svg>
        </div>
  
        {/* Inner Rotational Pattern */}
        <div className="absolute w-1/2 h-1/2">
          <svg
            className={`w-full h-full ${patternColorClass}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <g stroke="currentColor" fill="none" strokeWidth="0.2">
              {[...Array(30)].map((_, i) => (
                <path
                  key={i}
                  d={`M50,50 m-${i},0 a${i},${i} 0 1,0 ${2 * i},0 a${i},${i} 0 1,0 -${2 * i},0`}
                  strokeOpacity={0.2}
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    );
  };
  
  export default Sidebar;
  