import React, { useEffect, useState } from "react";
import { logger, LogEntry } from "../../services/logger";
import { envConfig } from "../../config/environment";

const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const updateLogs = () => {
      setLogs(logger.getLogs());
    };

    updateLogs();

    if (autoRefresh) {
      const interval = setInterval(updateLogs, 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getLogColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "text-red-500";
      case "warn":
        return "text-yellow-500";
      case "info":
        return "text-blue-500";
      case "debug":
        return "text-gray-500";
      default:
        return "text-gray-700";
    }
  };

  const formatData = (data: unknown) => {
    if (!data) return "";
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">System Logs</h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="form-checkbox"
            />
            <span>Auto Refresh</span>
          </label>
          <button
            onClick={() => setLogs(logger.getLogs())}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              logger.clearLogs();
              setLogs([]);
            }}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow">
        <div className="mb-2 text-sm text-gray-500">
          Environment: {envConfig.environment} | Debug Mode:{" "}
          {envConfig.debugMode ? "On" : "Off"}
        </div>
        <div className="h-[600px] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              No logs available
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-2 border-b border-gray-100 pb-2">
                <div className="flex items-start justify-between">
                  <span
                    className={`font-mono text-sm ${getLogColor(log.level)}`}
                  >
                    [{log.timestamp}] {log.level.toUpperCase()}
                  </span>
                </div>
                <div className="mt-1 font-mono text-sm">{log.message}</div>
                {log.data && (
                  <pre className="mt-1 overflow-x-auto rounded bg-gray-50 p-2 text-xs">
                    {formatData(log.data)}
                  </pre>
                )}
                {log.error && (
                  <pre className="mt-1 overflow-x-auto rounded bg-red-50 p-2 text-xs text-red-500">
                    {log.error.message}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LogViewer;
