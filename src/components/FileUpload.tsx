
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileUp } from "lucide-react";
import { toast } from '@/components/ui/sonner';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

interface FileUploadProps {
  onDataLoaded: (data: any[]) => void;
}

const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType === 'csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            onDataLoaded(results.data);
            toast.success('CSV data loaded successfully');
          } else {
            toast.error('Error parsing CSV: No data found');
          }
        },
        error: (error) => {
          toast.error(`Error parsing CSV: ${error.message}`);
        }
      });
    } else if (fileType === 'xlsx' || fileType === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData && jsonData.length > 0) {
            onDataLoaded(jsonData);
            toast.success('Excel data loaded successfully');
          } else {
            toast.error('Error parsing Excel: No data found');
          }
        } catch (error) {
          toast.error(`Error parsing Excel: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      toast.error('Unsupported file format. Please upload a CSV or Excel file.');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  return (
    <div 
      className={`w-full p-6 rounded-xl border-2 border-dashed transition-colors ${
        isDragging ? 'bg-blue-50 border-blue-400' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <Upload className="h-10 w-10 text-blue-400" />
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Upload Stock Data</h3>
          {fileName ? (
            <p className="text-sm text-blue-600 font-medium">{fileName}</p>
          ) : (
            <p className="text-sm text-gray-500">Drag & drop your CSV or Excel file here</p>
          )}
        </div>
        
        <div className="mt-2 flex gap-2">
          <label htmlFor="file-upload">
            <Button variant="outline" className="cursor-pointer bg-blue-gradient text-white hover:bg-blue-700 flex gap-2">
              <FileUp className="h-4 w-4" />
              Browse Files
            </Button>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
