import { useState, type KeyboardEvent } from 'react';
import { X, Plus, Tag, Trash2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateChallengeModal({ onClose, onCreated }: Props) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [schemaContext, setSchemaContext] = useState('');
  const [question, setQuestion] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [pointValue, setPointValue] = useState(10);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addKeyword = () => {
    const kw = keywordInput.trim().toLowerCase();
    if (kw && !keywords.includes(kw)) {
      setKeywords(prev => [...prev, kw]);
    }
    setKeywordInput('');
  };

  const handleKeywordKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword();
    }
  };

  const removeKeyword = (kw: string) => setKeywords(prev => prev.filter(k => k !== kw));

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!question.trim()) { setError('Question is required.'); return; }
    if (keywords.length === 0) { setError('Add at least one required keyword.'); return; }
    if (pointValue < 1) { setError('Point value must be at least 1.'); return; }

    setSaving(true);
    setError('');
    try {
      await addDoc(collection(db, 'sqlRaceChallenges'), {
        title: title.trim(),
        description: description.trim(),
        schemaContext: schemaContext.trim(),
        question: question.trim(),
        requiredKeywords: keywords,
        pointValue,
        status: 'active',
        createdByUid: user!.uid,
        createdAt: serverTimestamp(),
      });
      onCreated();
      onClose();
    } catch (err) {
      setError('Failed to create challenge. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ padding: '0' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ background: 'white', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
        >
          <div>
            <h2 className="font-bold text-gray-800">New SQL Challenge</h2>
            <p className="text-xs text-gray-500 mt-0.5">Create a challenge for all sections to compete on</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl p-1.5 transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="section-label block mb-1.5">Challenge Title *</label>
            <input
              type="text"
              className="input-field w-full"
              placeholder="e.g. Find Top Spending Customers"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="section-label block mb-1.5">Short Description</label>
            <input
              type="text"
              className="input-field w-full"
              placeholder="Brief context for students (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Schema context */}
          <div>
            <label className="section-label block mb-1.5">Database Schema &amp; Sample Data</label>
            <p className="text-xs text-gray-400 mb-2">
              Paste your CREATE TABLE statements and INSERT sample rows here. Students will see this as reference.
            </p>
            <textarea
              className="input-field w-full"
              placeholder={"CREATE TABLE customers (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  email VARCHAR(100)\n);\n\n-- Sample data:\nINSERT INTO customers VALUES (1, 'Alice', 'alice@example.com');"}
              rows={8}
              style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: '12px', resize: 'vertical' }}
              value={schemaContext}
              onChange={e => setSchemaContext(e.target.value)}
            />
          </div>

          {/* Question */}
          <div>
            <label className="section-label block mb-1.5">Challenge Question *</label>
            <textarea
              className="input-field w-full"
              placeholder="Write a SQL query to find all customers who placed more than 3 orders in the last 30 days, sorted by order count descending."
              rows={3}
              style={{ resize: 'vertical' }}
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
          </div>

          {/* Required keywords */}
          <div>
            <label className="section-label block mb-1.5">Required Keywords (for auto-validation) *</label>
            <p className="text-xs text-gray-400 mb-2">
              Student's query must contain ALL of these keywords to be auto-marked correct. Type a keyword and press Enter or comma.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                className="input-field flex-1"
                placeholder="e.g. join, where, group by"
                value={keywordInput}
                onChange={e => setKeywordInput(e.target.value)}
                onKeyDown={handleKeywordKeyDown}
              />
              <button onClick={addKeyword} className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-sm">
                <Plus size={14} />
                Add
              </button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map(kw => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold"
                    style={{ background: 'rgba(124,58,237,0.10)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.20)' }}
                  >
                    <Tag size={10} />
                    {kw}
                    <button onClick={() => removeKeyword(kw)} className="ml-0.5 text-brand-400 hover:text-brand-700">
                      <Trash2 size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Point value */}
          <div>
            <label className="section-label block mb-1.5">Point Value *</label>
            <input
              type="number"
              min={1}
              max={100}
              className="input-field w-32"
              value={pointValue}
              onChange={e => setPointValue(Number(e.target.value))}
            />
            <p className="text-xs text-gray-400 mt-1">Points awarded to the section per correct student submission.</p>
          </div>

          {error && (
            <p className="text-sm text-rose-600 bg-rose-50 rounded-xl px-3 py-2">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex justify-end gap-3 px-6 py-4 sticky bottom-0"
          style={{ background: 'white', borderTop: '1px solid rgba(0,0,0,0.06)' }}
        >
          <button onClick={onClose} className="btn-secondary px-5 py-2 text-sm">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary px-5 py-2 text-sm disabled:opacity-50">
            {saving ? 'Creating…' : 'Create Challenge'}
          </button>
        </div>
      </div>
    </div>
  );
}
