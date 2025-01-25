"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoChevronDownOutline } from "react-icons/io5";
import { MdAdminPanelSettings, MdPerson } from "react-icons/md";

interface RoleSelectProps {
  currentRole: string;
  onRoleChange: (role: string) => Promise<void>;
  disabled?: boolean;
}

export default function RoleSelect({
  currentRole,
  onRoleChange,
  disabled,
}: RoleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
  }, [isOpen]);

  const roles = [
    {
      id: "USER",
      label: "Utilisateur",
      icon: MdPerson,
      color: "text-green-800",
      bgColor: "bg-green-100",
      hoverBg: "hover:bg-green-200",
    },
    {
      id: "ADMIN",
      label: "Administrateur",
      icon: MdAdminPanelSettings,
      color: "text-purple-800",
      bgColor: "bg-purple-100",
      hoverBg: "hover:bg-purple-200",
    },
  ];

  const selectedRoleData = roles.find((r) => r.id === selectedRole);

  const handleSelect = async (role: string) => {
    if (role !== selectedRole) {
      setSelectedRole(role);
      await onRoleChange(role);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border-[1px]
          transition-all duration-200 min-w-[180px]
          ${disabled ? "bg-gray-100 cursor-not-allowed border-gray-200" : "border-gray-200 hover:border-gray-300"}
          ${selectedRoleData?.bgColor}
        `}
        disabled={disabled}
      >
        {selectedRoleData?.icon({
          className: `w-5 h-5 ${selectedRoleData.color}`,
        })}
        <span className={`font-medium ${selectedRoleData?.color}`}>
          {selectedRoleData?.label}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-auto"
        >
          <IoChevronDownOutline
            className={`w-4 h-4 ${selectedRoleData?.color}`}
          />
        </motion.div>
      </button>

      {isOpen &&
        buttonRect &&
        createPortal(
          <AnimatePresence>
            <>
              <div
                className="fixed inset-0 z-[100]"
                onClick={() => setIsOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "fixed",
                  top: buttonRect.bottom + 8,
                  left: buttonRect.left,
                  width: buttonRect.width,
                  zIndex: 101,
                }}
                className="bg-white border-[1px] border-gray-200 rounded-lg shadow-lg"
              >
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    onClick={() => handleSelect(role.id)}
                    className={`
                    flex items-center gap-2 w-full px-4 py-3 text-left text-sm
                    transition-all duration-200
                    ${role.hoverBg}
                    ${selectedRole === role.id ? role.bgColor : ""}
                  `}
                  >
                    {role.icon({
                      className: `w-5 h-5 ${role.color}`,
                    })}
                    <span className={`font-medium ${role.color}`}>
                      {role.label}
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            </>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
