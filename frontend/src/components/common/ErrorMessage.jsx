function ErrorMessage({ message }) {
  if (!message) return null;
  
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
      <p className="font-medium">Error</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default ErrorMessage;