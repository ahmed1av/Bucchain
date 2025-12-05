export default function StatusIndicator({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in stock': return 'bg-green-500';
      case 'low stock': return 'bg-yellow-500';
      case 'in transit': return 'bg-blue-500';
      case 'out of stock': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
      <span>{status}</span>
    </div>
  );
}
