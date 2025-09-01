// SharedWithMe.jsx
import React from "react";
import { useGetSharedFilesQuery } from "@/store/api/shareFileApi";
import FileOpenButton from "./fileOpenButton";

const SharedWithMe = () => {
  console.log("Shared With me");

  const { data, isLoading, isError, error } = useGetSharedFilesQuery();
  console.log(data)
  if (isLoading) return <p className="text-gray-500">Loading shared files...</p>;
  if (isError) return <p className="text-red-500">{error?.data?.error || "Failed to fetch shared files"}</p>;

  const files = data?.data || [];

  if (files.length === 0) return <p className="text-gray-500">No files shared with you.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Shared With Me</h2>
      <ul className="space-y-3">
        {files.map((file) => (
          <li
            key={file.file.id}
            className="flex justify-between items-center p-3 border rounded-lg bg-white shadow-sm"
          >
            <div>
              <p className="font-medium">{file.file.name || "Unnamed File"}</p>
              <p className="text-sm text-gray-500">
                Shared on: {new Date(file.file.created_at).toLocaleDateString()}
              </p>
            </div>
            <FileOpenButton file={file.file} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SharedWithMe;
