import React from "react";
import { TaskRowProps } from "@/types/taskTypes";
import { FiCalendar, FiEdit2, FiTrash2, FiCheckSquare, FiSquare } from "react-icons/fi";

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete(task.id, !task.completed);
  };

  const formatDate = (timestamp: string | number) => {
    if (!timestamp) return "No due date";
    const date = new Date(parseInt(String(timestamp)));
    if (isNaN(date.getTime())) {
      // Try parsing as ISO date string
      const isoDate = new Date(String(timestamp));
      if (!isNaN(isoDate.getTime())) {
        return isoDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
      return "No due date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`group flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all ${
        task.completed
          ? "bg-emerald-50/40 border-emerald-200/60 hover:border-emerald-300"
          : "bg-white border-orange/15 hover:border-orange/40 hover:bg-orange/[0.02]"
      }`}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {/* Toggle Complete button */}
        <button
          type="button"
          onClick={handleToggleComplete}
          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
            task.completed
              ? "bg-emerald-500 text-white"
              : "border-2 border-orange/30 hover:border-orange text-transparent"
          }`}
          title={task.completed ? "Mark as incomplete" : "Mark as completed"}
        >
          {task.completed ? <FiCheckSquare size={16} /> : <FiSquare size={16} />}
        </button>

        {/* Task Details */}
        <div className="min-w-0 flex-1">
          <p
            className={`font-title text-sm sm:text-base font-bold transition-all truncate ${
              task.completed ? "line-through text-gray-400" : "text-gray-900"
            }`}
          >
            {task.title}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500 font-body">
            <span className="inline-flex items-center gap-1">
              <FiCalendar className="text-orange shrink-0" size={12} />
              <span>{formatDate(task.due_date)}</span>
            </span>
            {task.notes && (
              <span className="line-clamp-1 text-gray-400 italic max-w-xs">
                {task.notes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 shrink-0 ml-3">
        <button
          onClick={onEdit}
          className="w-8 h-8 rounded-xl bg-orange/10 hover:bg-orange text-orange hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          title="Edit task"
        >
          <FiEdit2 size={13} />
        </button>
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          title="Delete task"
        >
          <FiTrash2 size={13} />
        </button>
      </div>
    </div>
  );
};

export default TaskRow;
