import { useTasks } from "@/context/tasks.context";
import { useTheme } from "@/context/theme.context";
import TaskCard from "./task";
import { useRoute } from "@/context/route.context";
import { deleteTasks } from "@/services/api.service";

const RecentTasks = () => {
  const { isDarkMode } = useTheme();
  const { tasks, setTasks } = useTasks();
  const { setCurrentRoute } = useRoute();

  return (
    <div
      className={`${
        isDarkMode ? "bg-slate-800/50" : "bg-white/80"
      } backdrop-blur-xl rounded-2xl p-6 border ${
        isDarkMode ? "border-slate-700" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Tarefas Recentes</h3>
        <button className="text-purple-500 hover:text-purple-400 transition-colors font-medium" onClick={() => setCurrentRoute("tasks")}>
          Ver todas
        </button>
      </div>
      <div className="space-y-3">
        {tasks.slice(0, 3).map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onToggle={(id) => {
              setTasks(
                tasks.map((t) =>
                  t._id === id ? { ...t, completed: !t.completed } : t
                )
              );
            }}
            onDelete={(id) => {
              setTasks(tasks.filter((t) => t._id !== id));
              deleteTasks(id);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RecentTasks;
