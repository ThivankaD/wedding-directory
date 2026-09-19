'use client';

import React, { useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { X, UploadCloud, Users, CheckSquare, Square, FileText, Loader2, ArrowLeft } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { CREATE_GUESTLIST } from '@/graphql/mutations';
import { parseVCard, ParsedVCardContact } from '@/utils/vcardParser';
import toast from 'react-hot-toast';

interface VCardImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitorId?: string;
  onImportSuccess: () => void;
}

const VCardImportModal: React.FC<VCardImportModalProps> = ({
  isOpen,
  onClose,
  visitorId,
  onImportSuccess,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contacts, setContacts] = useState<ParsedVCardContact[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Global default controls
  const [globalPartyOf, setGlobalPartyOf] = useState('1');
  const [globalStatus, setGlobalStatus] = useState('Invited');

  const [createGuestList] = useMutation(CREATE_GUESTLIST);

  const resetState = () => {
    setContacts([]);
    setFileName('');
    setIsImporting(false);
    setImportProgress(0);
    setGlobalPartyOf('1');
    setGlobalStatus('Invited');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (isImporting) return;
    resetState();
    onClose();
  };

  const handleFile = (file: File) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.vcf')) {
      toast.error('Please upload a valid vCard file (.vcf)');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseVCard(content, globalPartyOf, globalStatus);
      if (parsed.length === 0) {
        toast.error('No contacts could be found in this .vcf file.');
        setFileName('');
      } else {
        setContacts(parsed);
        toast.success(`Found ${parsed.length} contact${parsed.length > 1 ? 's' : ''} in vCard!`);
      }
    };
    reader.onerror = () => {
      toast.error('Failed to read the file.');
      setFileName('');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Selection handlers
  const toggleContactSelection = (id: string) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, selected: !contact.selected } : contact
      )
    );
  };

  const toggleSelectAll = () => {
    const allSelected = contacts.every((c) => c.selected);
    setContacts((prev) => prev.map((c) => ({ ...c, selected: !allSelected })));
  };

  // Update contact fields individually
  const updateContactField = (
    id: string,
    field: 'number' | 'status',
    value: string
  ) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Apply global defaults to all selected contacts
  const applyGlobalDefaults = (party: string, status: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.selected ? { ...c, number: party, status: status } : c))
    );
  };

  const selectedCount = contacts.filter((c) => c.selected).length;

  // Batch import execution
  const handleImport = async () => {
    if (!visitorId) {
      toast.error('Visitor ID is required to import guests');
      return;
    }

    const selectedContacts = contacts.filter((c) => c.selected);
    if (selectedContacts.length === 0) {
      toast.error('Please select at least one contact to import');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < selectedContacts.length; i++) {
      const contact = selectedContacts[i];
      try {
        await createGuestList({
          variables: {
            input: {
              name: contact.name,
              number: contact.number || '1',
              address: contact.address || '',
              contact: contact.contact || '',
              email: contact.email || '',
              status: contact.status || 'Invited',
              visitor_id: visitorId,
            },
          },
        });
        successCount++;
      } catch (err) {
        console.error('Failed to import contact:', contact.name, err);
        failedCount++;
      }
      setImportProgress(Math.round(((i + 1) / selectedContacts.length) * 100));
    }

    setIsImporting(false);

    if (successCount > 0) {
      toast.success(`Successfully imported ${successCount} guest${successCount > 1 ? 's' : ''}!`);
      onImportSuccess();
      handleClose();
    } else {
      toast.error('Failed to import contacts. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full rounded-3xl bg-white dark:bg-darkSurface border-2 border-orange/20 dark:border-orange/30 shadow-2xl p-6 sm:p-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-orange/15 dark:border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <Dialog.Title className="text-xl sm:text-2xl font-bold font-title text-gray-900 dark:text-zinc-100">
                  Import Guests from vCard (.vcf)
                </Dialog.Title>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 font-body">
                  Import wedding guests from your iPhone, Android, Google, or Outlook contacts.
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isImporting}
              className="w-9 h-9 rounded-full bg-gray-100 dark:bg-darkElevated hover:bg-orange/10 dark:hover:bg-orange/20 hover:text-orange flex items-center justify-center text-gray-500 dark:text-zinc-400 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body content */}
          <div className="flex-1 overflow-y-auto py-5 space-y-5">
            {contacts.length === 0 ? (
              /* Dropzone / Upload state */
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 ${
                  isDragOver
                    ? 'border-orange bg-orange/[0.06] dark:bg-orange/[0.12] scale-[0.99]'
                    : 'border-orange/30 dark:border-zinc-700 hover:border-orange bg-orange/[0.02] dark:bg-darkElevated/40 hover:bg-orange/[0.04]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".vcf,text/vcard"
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center text-orange shadow-xs">
                  <UploadCloud size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold font-title text-gray-800 dark:text-zinc-100">
                    Click to upload or drag and drop a .vcf file
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 font-body max-w-md">
                    Export your contacts as a vCard (.vcf) file from your mobile phone or email account and drop it here.
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-orange hover:bg-orange/90 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Browse File (.vcf)
                </button>
              </div>
            ) : (
              /* Preview & Table Configuration state */
              <div className="space-y-4">
                {/* Global Configuration Bar */}
                <div className="bg-orange/[0.04] dark:bg-darkElevated/60 border-2 border-orange/15 dark:border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setContacts([])}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:text-orange dark:hover:text-orange transition-colors cursor-pointer"
                    >
                      <ArrowLeft size={14} />
                      <span>Upload different file</span>
                    </button>
                    <span className="text-xs text-gray-300 dark:text-zinc-600">|</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 font-body">
                      {fileName} ({contacts.length} found, {selectedCount} selected)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-600 dark:text-zinc-400 font-medium">Default Party:</span>
                      <select
                        value={globalPartyOf}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGlobalPartyOf(val);
                          applyGlobalDefaults(val, globalStatus);
                        }}
                        className="bg-white dark:bg-darkElevated border-2 border-orange/20 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs font-bold text-gray-800 dark:text-zinc-100 focus:outline-none focus:border-orange"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={String(num)}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-600 dark:text-zinc-400 font-medium">Default Status:</span>
                      <select
                        value={globalStatus}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGlobalStatus(val);
                          applyGlobalDefaults(globalPartyOf, val);
                        }}
                        className="bg-white dark:bg-darkElevated border-2 border-orange/20 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs font-bold text-gray-800 dark:text-zinc-100 focus:outline-none focus:border-orange"
                      >
                        <option value="Invited">Invited</option>
                        <option value="Not Invited">Not Invited</option>
                        <option value="Attending">Attending</option>
                        <option value="Declined">Declined</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contacts Preview Table */}
                <div className="border-2 border-orange/15 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="max-h-72 overflow-y-auto">
                    <table className="w-full text-left text-xs sm:text-sm font-body">
                      <thead className="bg-orange/[0.08] dark:bg-darkElevated text-gray-900 dark:text-zinc-100 font-bold sticky top-0 border-b border-orange/15 dark:border-zinc-800">
                        <tr>
                          <th className="p-3 w-10 text-center">
                            <button
                              type="button"
                              onClick={toggleSelectAll}
                              className="text-orange hover:text-orange/80 transition-colors cursor-pointer"
                            >
                              {contacts.every((c) => c.selected) ? (
                                <CheckSquare size={18} />
                              ) : (
                                <Square size={18} />
                              )}
                            </button>
                          </th>
                          <th className="p-3 font-title">Guest Name</th>
                          <th className="p-3 font-title">Contact / Phone</th>
                          <th className="p-3 font-title">Email</th>
                          <th className="p-3 font-title">Party of</th>
                          <th className="p-3 font-title">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange/10 dark:divide-zinc-800 bg-white dark:bg-darkSurface">
                        {contacts.map((contact) => (
                          <tr
                            key={contact.id}
                            className={`transition-colors hover:bg-orange/[0.03] dark:hover:bg-zinc-800/40 ${
                              contact.selected ? 'bg-orange/[0.01] dark:bg-orange/[0.04]' : 'opacity-50'
                            }`}
                          >
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => toggleContactSelection(contact.id)}
                                className="text-orange hover:text-orange/80 transition-colors cursor-pointer"
                              >
                                {contact.selected ? (
                                  <CheckSquare size={18} />
                                ) : (
                                  <Square size={18} />
                                )}
                              </button>
                            </td>
                            <td className="p-3 font-bold text-gray-900 dark:text-zinc-100 font-title">
                              {contact.name}
                              {contact.address && (
                                <p className="text-[11px] font-normal text-gray-400 dark:text-zinc-500 truncate max-w-xs">
                                  {contact.address}
                                </p>
                              )}
                            </td>
                            <td className="p-3 text-gray-600 dark:text-zinc-300">{contact.contact || '—'}</td>
                            <td className="p-3 text-gray-600 dark:text-zinc-300">{contact.email || '—'}</td>
                            <td className="p-3">
                              <select
                                value={contact.number}
                                onChange={(e) =>
                                  updateContactField(contact.id, 'number', e.target.value)
                                }
                                className="bg-white dark:bg-darkElevated border border-orange/20 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-orange font-bold text-gray-800 dark:text-zinc-100"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                  <option key={num} value={String(num)}>
                                    {num}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="p-3">
                              <select
                                value={contact.status}
                                onChange={(e) =>
                                  updateContactField(contact.id, 'status', e.target.value)
                                }
                                className="bg-white dark:bg-darkElevated border border-orange/20 dark:border-zinc-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-orange font-medium text-gray-800 dark:text-zinc-100"
                              >
                                <option value="Invited">Invited</option>
                                <option value="Not Invited">Not Invited</option>
                                <option value="Attending">Attending</option>
                                <option value="Declined">Declined</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Progress bar when importing */}
                {isImporting && (
                  <div className="space-y-2 p-4 bg-orange/[0.05] dark:bg-darkElevated border border-orange/20 dark:border-zinc-700 rounded-2xl animate-pulse">
                    <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-zinc-300">
                      <span>Importing guests...</span>
                      <span className="text-orange">{importProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange rounded-full transition-all duration-300"
                        style={{ width: `${importProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="pt-4 border-t border-orange/15 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-xs text-gray-500 dark:text-zinc-400 font-body">
              {contacts.length > 0 && (
                <span>
                  Ready to add <strong>{selectedCount}</strong> guest{selectedCount === 1 ? '' : 's'} to your list.
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isImporting}
                className="px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              {contacts.length > 0 && (
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={isImporting || selectedCount === 0}
                  className="bg-orange hover:bg-orange/90 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isImporting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Importing ({importProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Users size={16} />
                      <span>Import {selectedCount} Guests</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default VCardImportModal;
