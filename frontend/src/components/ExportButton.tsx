import React from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  data: any[];
  filename: string;
  label?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename, label = 'Export CSV' }) => {
  const downloadCSV = () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          return JSON.stringify(value);
        }).join(',')
      )
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadCSV}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
    >
      <Download className="w-4 h-4" />
      {label}
    </button>
  );
};

export default ExportButton;