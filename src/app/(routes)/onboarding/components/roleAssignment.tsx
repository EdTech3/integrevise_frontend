"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface RoleAssignmentProps {
  onFinish: () => void; // Callback for finishing the step
}

const RoleAssignment: React.FC<RoleAssignmentProps> = ({ onFinish }) => {
  const [lmsRoles, setLmsRoles] = useState<string[]>([]);
  const [integreviseRoles, setIntegreviseRoles] = useState<string[]>([]);
  const [roleMapping, setRoleMapping] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {

    const fetchRoles = async () => {
      setLoading(true);
      try {
 
        const mockLmsRoles = ["Admin", "Team Member", "Manager", "Student", "Non-Editing Teacher", "Teacher"];
        const mockIntegreviseRoles = ["Admin", "Team Member", "Normal", "Viewer"];

        setLmsRoles(mockLmsRoles);
        setIntegreviseRoles(mockIntegreviseRoles);
      } catch (error) {
        console.error("Failed to fetch roles", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleMappingChange = (lmsRole: string, integreviseRole: string) => {
    setRoleMapping((prevMapping) => ({
      ...prevMapping,
      [lmsRole]: integreviseRole,
    }));
  };

  const allRolesMapped = lmsRoles.every((role) => roleMapping[role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-600">Loading roles...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center px-4">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
        <h2 className="text-center text-xl font-semibold mb-4">
          Role Assignment
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Match the LMS roles to the closest APP role.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {/* LMS Roles */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">LMS Roles</h3>
            <div className="space-y-2">
              {lmsRoles.map((role, index) => (
                <div
                  key={index}
                  className="py-2 px-4 border border-gray-300 rounded-md bg-gray-100 text-sm"
                >
                  {role}
                </div>
              ))}
            </div>
          </div>

          {/* Integrevise Roles */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Integrevise Role (App Roles)
            </h3>
            <div className="space-y-2">
              {lmsRoles.map((role, index) => (
                <div key={index}>
                  <Select
                    value={roleMapping[role] || ""}
                    onValueChange={(value) => handleMappingChange(role, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {integreviseRoles.map((integreviseRole, idx) => (
                        <SelectItem key={idx} value={integreviseRole}>
                          {integreviseRole}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Finish Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onFinish}
            className={`w-full py-2 px-4 rounded-md text-white ${
              allRolesMapped
                ? "bg-foreground hover:bg-blue-900"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!allRolesMapped}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleAssignment;
