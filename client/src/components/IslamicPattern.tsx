export function IslamicPattern({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`absolute inset-0 opacity-5 ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2316a34a' fill-opacity='0.03'%3E%3Cpolygon points='10 0 20 10 10 20 0 10'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    />
  );
}

export function IslamicGeometricIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z" />
    </svg>
  );
}
