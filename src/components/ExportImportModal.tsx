import React, { useRef, useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (jsonString: string) => boolean;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImport(content);
        if (success) {
          setSuccessMsg('Habit data imported successfully!');
          setErrorMsg(null);
          setTimeout(() => {
            onClose();
            setSuccessMsg(null);
          }, 1200);
        } else {
          setErrorMsg('Failed to import file. Invalid JSON format or missing habits array.');
          setSuccessMsg(null);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Import Backup</h3>
          <button className="close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <p className="modal-subtitle">
          Select a previously exported <code>.json</code> backup file to restore your habit tracker data.
        </p>

        {errorMsg && (
          <div className="alert-box error">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert-box success">
            <CheckCircle size={15} />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="dropzone" onClick={() => fileInputRef.current?.click()}>
          <Upload size={28} className="text-secondary" />
          <p className="dropzone-text">Click to choose a JSON backup file</p>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json,application/json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <div className="modal-footer">
          <button className="btn-secondary-sm" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        .modal-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          max-width: 400px;
          width: 100%;
          box-shadow: var(--shadow-lg);
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        .modal-title {
          font-size: 1.05rem;
          font-weight: 700;
        }
        .close-btn {
          color: var(--text-tertiary);
          padding: 0.2rem;
          border-radius: var(--radius-sm);
        }
        .close-btn:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
        }
        .modal-subtitle {
          font-size: 0.82rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }
        .dropzone {
          border: 2px dashed var(--border-light);
          border-radius: var(--radius-md);
          padding: 1.75rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          background: var(--bg-app);
          transition: border-color 0.15s ease;
        }
        .dropzone:hover {
          border-color: var(--border-focus);
        }
        .dropzone-text {
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .alert-box {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          margin-bottom: 0.75rem;
        }
        .alert-box.error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .alert-box.success {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 1rem;
        }
        .btn-secondary-sm {
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-md);
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};
