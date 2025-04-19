
import React, { useState, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  const validateFileType = (file: File): boolean => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type) && 
        !file.name.endsWith('.csv') && 
        !file.name.endsWith('.xlsx') && 
        !file.name.endsWith('.xls')) {
      toast.error('Please upload only CSV or Excel files');
      return false;
    }
    return true;
  };

  const processFile = useCallback((file: File) => {
    if (!validateFileType(file)) return;

    setIsLoading(true);
    setFileName(file.name);
    console.log('Processing file:', file.name, 'type:', file.type);
    
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log('CSV parsing complete:', results);
          setIsLoading(false);
          
          if (results.data && results.data.length > 0) {
            const validData = results.data.filter(row => 
              Object.keys(row).length > 1 && 
              !Object.values(row).every(val => val === '')
            );
            
            if (validData.length > 0) {
              onDataLoaded(validData);
              toast.success(`Successfully loaded ${validData.length} rows of data`);
            } else {
              toast.error('No valid data found in the CSV file');
            }
          } else {
            toast.error('Error: The CSV file appears to be empty');
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          setIsLoading(false);
          toast.error(`Error parsing CSV: ${error.message}`);
        }
      });
    } else if (file.name.match(/\.(xlsx|xls)$/i)) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          if (!data) {
            throw new Error('No data found in the Excel file');
          }
          
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          console.log('Excel parsing complete:', jsonData);
          
          if (jsonData && jsonData.length > 0) {
            onDataLoaded(jsonData);
            toast.success(`Successfully loaded ${jsonData.length} rows of data`);
          } else {
            toast.error('No valid data found in the Excel file');
          }
        } catch (error) {
          console.error('Excel parsing error:', error);
          toast.error(`Error parsing Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        setIsLoading(false);
        toast.error('Error reading the Excel file');
      };
      
      reader.readAsBinaryString(file);
    }
  }, [onDataLoaded]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  return (
    <div 
      className={`w-full p-6 rounded-xl border-2 border-dashed transition-colors ${
        isDragging ? 'bg-blue-50 border-blue-400' : 'border-gray-300'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <Upload className="h-10 w-10 text-blue-400" />
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Upload Stock Data</h3>
          {isLoading ? (
            <p className="text-sm text-amber-600 font-medium">Processing file...</p>
          ) : fileName ? (
            <p className="text-sm text-blue-600 font-medium">{fileName}</p>
          ) : (
            <p className="text-sm text-gray-500">Drag & drop your CSV or Excel file here</p>
          )}
        </div>
        
        <div className="mt-2">
          <label htmlFor="file-upload">
            <Button 
              variant="outline" 
              className={`cursor-pointer bg-blue-600 text-white hover:bg-blue-700 flex gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              <FileUp className="h-4 w-4" />
              {isLoading ? 'Processing...' : 'Browse Files'}
            </Button>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
