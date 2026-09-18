import React, { useState, useEffect } from "react";
import { TaskType, AddEditTaskModalProps } from "@/types/taskTypes";
import { X, CheckSquare } from "lucide-react";

const AddEditTaskModal: React.FC<AddEditTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Omit<TaskType, "id">>({
    title: "",
    due_date: "",
    category: "",
    notes: "",
    completed: false,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Parse due_date to YYYY-MM-DD format if provided
        let formattedDueDate = "";
        if (initialData.due_date) {
          const parsed = new Date(Number(initialData.due_date));
          if (!isNaN(parsed.getTime())) {
            formattedDueDate = parsed.toISOString().split("T")[0];
          } else {
            const isoParsed = new Date(String(initialData.due_date));
            if (!isNaN(isoParsed.getTime())) {
              formattedDueDate = isoParsed.toISOString().split("T")[0];
            }
          }
        }

        setFormData({
          title: initialData.title || "",
          due_date: formattedDueDate,
          category: initialData.category || "",
          notes: initialData.notes || "",
          completed: initialData.completed || false,
        });
      } else {
        setFormData({
          title: "",
          due_date: "",
          category: "",
          notes: "",
          completed: false,
        });
      }
    }
  }, [isOpen, initialData]);

  const isFormValid = Boolean(formData.title.trim() && formData.category.trim());

  const handleSave = () => {
    if (!isFormValid) return;

    // Convert date string to timestamp if provided
    let dueDateTimestamp: any = formData.due_date;
    if (formData.due_date) {
      const dateObj = new Date(formData.due_date);
      if (!isNaN(dateObj.getTime())) {
        dueDateTimestamp = dateObj.getTime().toString();
      }
    }

    const payload = initialData
      ? { ...formData, due_date: dueDateTimestamp, id: initialData.id }
      : { ...formData, due_date: dueDateTimestamp };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl border-2 border-orange/20 shadow-2xl p-6 sm:p-8 max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-orange/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
              <CheckSquare size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-title text-gray-900">
                {initialData ? "Edit Task" : "Add Task"}
              </h2>
              <p className="text-xs text-gray-500 font-body">
                {initialData ? "Update your checklist task details." : "Create a new wedding preparation task."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-orange/10 hover:text-orange flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
              Task Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Book Photographer"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-11 px-3.5 border-2 border-orange/20 focus:border-orange rounded-xl bg-orange/[0.02] text-sm text-gray-900 focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full h-11 px-3 border-2 border-orange/20 focus:border-orange rounded-xl bg-white text-sm text-gray-900 font-medium focus:outline-none transition-colors"
              required
            >
              <option value="" disabled>
                Select a Category
              </option>
              {[
                "Venue",
                "Photos & Videos",
                "Food & Drink",
                "Attire",
                "Music",
                "Flower & Decor",
                "Registry",
                "Invitation & Paper",
                "Beauty",
                "Ceremony",
                "Guests",
                "Travel",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full h-11 px-3.5 border-2 border-orange/20 focus:border-orange rounded-xl bg-white text-sm text-gray-900 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider font-body mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              placeholder="Add details, contact info, or reminders..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-3 border-2 border-orange/20 focus:border-orange rounded-xl bg-orange/[0.02] text-sm text-gray-900 focus:outline-none transition-colors min-h-[80px] resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-orange/15 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-100 font-semibold text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isFormValid}
              className="bg-orange hover:bg-orange/90 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initialData ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTaskModal;
