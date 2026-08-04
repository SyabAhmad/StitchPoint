import React, { useState } from "react";
import { FaStore, FaCog } from "react-icons/fa";
import StoreConfig from "./storeconfig.jsx";
import SystemSettings from "./systemsettings.jsx";

const Settings = () => {
  const [tab, setTab] = useState("store");

  const tabClass = (active) =>
    `flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
      active
        ? "border-gold-500 text-gold-500"
        : "border-transparent text-white/50 hover:text-white hover:border-white/20"
    }`;

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="px-6 pt-6 pb-0 border-b border-white/10">
        <h1 className="text-2xl font-bold flex items-center mb-4">
          <FaCog className="mr-3 text-gold-500" />
          Settings
        </h1>
        <div className="flex gap-6">
          <button onClick={() => setTab("store")} className={tabClass(tab === "store")}>
            <FaStore />
            Store Settings
          </button>
          <button onClick={() => setTab("system")} className={tabClass(tab === "system")}>
            <FaCog />
            System Settings
          </button>
        </div>
      </div>

      {tab === "store" ? <StoreConfig /> : <SystemSettings />}
    </div>
  );
};

export default Settings;
