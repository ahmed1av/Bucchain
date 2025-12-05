export default function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl ${className}`}>
      {children}
    </div>
  );
}
