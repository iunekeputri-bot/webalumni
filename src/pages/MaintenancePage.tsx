import { motion } from "framer-motion";
import { Settings, Clock, Mail } from "lucide-react";
import { useMaintenance } from "@/context/MaintenanceContext";

const MaintenancePage = () => {
  const { maintenanceInfo } = useMaintenance();

  // Format date and time for display
  const getFormattedEndTime = () => {
    if (!maintenanceInfo?.end_date || !maintenanceInfo?.end_time) {
      return "1-2 Jam";
    }

    const date = new Date(maintenanceInfo.end_date + "T" + maintenanceInfo.end_time);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        <motion.div
          animate={{
            rotate: [0, 360],
            transition: { duration: 2, repeat: Infinity, ease: "linear" },
          }}
          className="inline-block mb-6"
        >
          <Settings className="h-20 w-20 text-blue-500" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Sistem Sedang Maintenance</h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">{maintenanceInfo?.message || "Kami sedang melakukan pemeliharaan sistem untuk meningkatkan kualitas layanan. Mohon maaf atas ketidaknyamanannya."}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Clock className="h-6 w-6 text-blue-500" />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Estimasi Selesai</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{getFormattedEndTime()}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Mail className="h-6 w-6 text-purple-500" />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Hubungi Kami</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">support@alumni.com</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">Sistem akan kembali normal secepatnya. Terima kasih atas kesabaran Anda.</p>
        </div>

        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">Memuat ulang otomatis...</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
