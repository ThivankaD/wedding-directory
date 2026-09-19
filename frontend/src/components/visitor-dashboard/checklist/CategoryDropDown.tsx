import React, { useState } from "react";
import { TaskType } from "@/types/taskTypes";
import TaskRow from "@/components/visitor-dashboard/checklist/TaskRow";
import { FiChevronDown, FiPlus, FiFolder } from "react-icons/fi";

type CategoryDropdownProps = {
  category: string;
  tasks: TaskType[];
  onAddTask: () => void;
  onEditTask: (task: TaskType) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
};

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  category,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="bg-white dark:bg-darkSurface rounded-2xl border-2 border-orange/20 dark:border-zinc-800 hover:border-orange/40 transition-all overflow-hidden shadow-2xs">
      {/* Category Header */}
      <div
        className="flex items-center justify-between p-4 sm:p-5 bg-white dark:bg-darkSurface hover:bg-orange/[0.02] dark:hover:bg-zinc-800/40 cursor-pointer select-none transition-colors"
        onClick={toggleDropdown}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange/10 flex items-center justify-center text-orange shrink-0">
            <FiFolder size={18} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold font-title text-gray-900 dark:text-zinc-100">
              {category}
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange/10 text-orange border border-orange/20">
              {tasks.length} task{tasks.length === 1 ? '' : 's'}
            </span>
            {tasks.length > 0 && completedCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                {completedCount}/{tasks.length} completed
              </span>
            )}
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-orange/10 text-orange flex items-center justify-center shrink-0">
          <FiChevronDown
            className={`transform transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
            size={18}
          />
        </div>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t-2 border-orange/15 dark:border-zinc-800 bg-orange/[0.01] dark:bg-darkElevated/20 space-y-3">
          {tasks.length > 0 ? (
            <div className="space-y-2.5">
              {tasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={() => onEditTask(task)}
                  onDelete={() => onDeleteTask(task.id)}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-400 italic py-2">
              No tasks found in this category.
            </p>
          )}

          <div className="pt-2">
            <button
              onClick={onAddTask}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange/10 hover:bg-orange text-orange hover:text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              <FiPlus size={14} />
              <span>Add Task to {category}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
