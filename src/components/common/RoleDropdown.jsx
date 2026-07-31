import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaUserShield, FaUserTie, FaUser } from "react-icons/fa";

const ROLES = {
  super_admin: {
    label: "Super Admin",
    icon: FaUserShield,
    color: "text-gold-500",
    bg: "bg-gold-500/10",
    border: "border-gold-500/20",
    dot: "bg-gold-500",
  },
  manager: {
    label: "Manager",
    icon: FaUserTie,
    color: "text-white",
    bg: "bg-white/10",
    border: "border-white/15",
    dot: "bg-white/60",
  },
  customer: {
    label: "Customer",
    icon: FaUser,
    color: "text-white/50",
    bg: "bg-white/5",
    border: "border-white/10",
    dot: "bg-white/30",
  },
};

const RoleDropdown = ({ value, onChange, disabled, allowedRoles, size = "default" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roles = allowedRoles || ["customer", "manager", "super_admin"];
  const current = ROLES[value] || ROLES.customer;
  const CurrentIcon = current.icon;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (role) => {
    onChange(role);
    setIsOpen(false);
  };

  const isSmall = size === "small";

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 rounded-lg border transition-all duration-200
          ${isSmall ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"}
          ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:border-gold-500/30"}
          ${current.bg} ${current.border} ${current.color}
        `}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
        <CurrentIcon className={isSmall ? "text-[10px]" : "text-xs"} />
        <span className="font-medium">{current.label}</span>
        <FaChevronDown
          className={`text-[10px] transition-transform duration-200 ml-auto ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[160px] bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {roles.map((role) => {
            const r = ROLES[role];
            if (!r) return null;
            const Icon = r.icon;
            const isSelected = value === role;

            return (
              <button
                key={role}
                type="button"
                onClick={() => handleSelect(role)}
                className={`
                  w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all duration-150
                  ${isSmall ? "text-xs" : "text-sm"}
                  ${isSelected ? "bg-gold-500/10 text-gold-500" : "text-white/60 hover:bg-white/5 hover:text-white"}
                `}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`} />
                <Icon className="text-xs" />
                <span className="font-medium flex-1">{r.label}</span>
                {isSelected && (
                  <span className="text-gold-500 text-[10px]">●</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoleDropdown;
