'use client';

import { useState } from 'react';
import { uploader } from '@/lib/supabase/uploader';

export default function ZipUploader() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await handleUpload(files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith('.zip')) {
      alert('Please upload a .zip file');
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const projectName = file.name.replace('.zip', '');
      const uploadResult = await uploader.uploadZip(file, projectName);
      setResult(uploadResult);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-morphism rounded-2xl p-6 border-eko-purple/30">
      <h2 className="text-xl font-bold text-eko-purple mb-4">📦 Context Upload</h2>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive
            ? 'border-eko-purple bg-eko-purple/10'
            : 'border-eko-purple/30 hover:border-eko-purple/60'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="py-8">
            <div className="animate-spin text-4xl mb-4">⚡</div>
            <p className="text-eko-purple font-semibold">Uploading & Extracting...</p>
          </div>
        ) : result ? (
          <div className="py-4">
            <div className="text-4xl mb-4">✅</div>
            <p className="text-green-400 font-semibold mb-2">Upload Complete!</p>
            <p className="text-sm text-gray-400">{result.files.length} files extracted</p>
            <p className="text-xs text-gray-500 mt-2 break-all">{result.url}</p>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-4 bioluminescent-glow">📁</div>
            <p className="text-gray-300 mb-2">Drag & drop your .zip file here</p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <label className="bg-eko-purple hover:bg-eko-purple/80 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer inline-block transition-all">
              Choose File
              <input
                type="file"
                accept=".zip"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {result && (
        <button
          onClick={() => setResult(null)}
          className="mt-4 w-full bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition-all"
        >
          Upload Another
        </button>
      )}
    </div>
  );
}
