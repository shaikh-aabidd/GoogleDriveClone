import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetFilesQuery,
  useUploadFileMutation,
  useCreateFolderMutation,
  useDeleteFileMutation,
  useRenameFileMutation,
  useDownloadFileMutation,
} from "../../store/api/fileApi";
import {
  useGenerateSharableLinkMutation,
  useShareFileWithEmailMutation,
} from "@/store/api/shareFileApi";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Folder,
  File,
  Upload,
  Plus,
  MoreVertical,
  Download,
  Trash2,
  Edit,
  ArrowLeft,
  Share,
  Copy,
  Mail,
  Link,
  X,
} from "lucide-react";
import { formatBytes, formatDate } from "../../utils/format";

const Dashboard = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFile, setEditingFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const fileInputRef = useRef(null);
  const [showOptionsMenuId, setShowOptionsMenuId] = useState(null);
  const optionsMenuRef = useRef(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  // Share modal states
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareFile, setShareFile] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState("read");
  const [generatedLink, setGeneratedLink] = useState("");
  const [shareTab, setShareTab] = useState("email"); // 'email' or 'link'

  const { data: filesData = [], isLoading, error } = useGetFilesQuery(folderId);
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [createFolder, { isLoading: isCreatingFolder }] =
    useCreateFolderMutation();
  const [deleteFile, { isLoading: isDeleting }] = useDeleteFileMutation();
  const [renameFile, { isLoading: isRenaming }] = useRenameFileMutation();
  const [downloadFile, { isLoading: isDownloading }] =
    useDownloadFileMutation();

  const [shareFileWithEmail, { isLoading: isSharingWithEmail }] =
    useShareFileWithEmailMutation();
  const [generateSharableLink, { isLoading: isGeneratingLink }] =
    useGenerateSharableLinkMutation();

  const files = filesData.data;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target)
      ) {
        setShowOptionsMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileUpload = async (event) => {
    const filesToUpload = event.target.files;
    if (!filesToUpload.length) return;

    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.append("file", file);
      if (folderId) {
        formData.append("parentFolderId", folderId);
      }

      try {
        await uploadFile(formData).unwrap();
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder({
        name: newFolderName,
        parentFolderId: folderId || null,
      }).unwrap();
      toast.success("Folder created successfully");
      setNewFolderName("");
      setShowCreateFolder(false);
    } catch (error) {
      toast.error("Failed to create folder");
    }
  };

  const handleDeleteFile = (fileId, fileName) => {
    setConfirmMessage(`Are you sure you want to delete "${fileName}"?`);
    setConfirmAction(() => async () => {
      try {
        await deleteFile(fileId).unwrap();
        toast.success("File deleted successfully");
      } catch (error) {
        toast.error("Failed to delete file");
      } finally {
        setShowConfirmModal(false);
        setConfirmAction(null);
      }
    });
    setShowConfirmModal(true);
    setShowOptionsMenuId(null);
  };

  const handleRenameFile = async (fileId, newName) => {
    if (!newName.trim()) {
      toast.error("File name cannot be empty");
      setEditingFile(null);
      setNewFileName("");
      return;
    }

    if (newName === files.find((f) => f.id === fileId)?.name) {
      setEditingFile(null);
      setNewFileName("");
      return;
    }

    try {
      await renameFile({ fileId, newName }).unwrap();
      toast.success("File renamed successfully");
      setEditingFile(null);
      setNewFileName("");
    } catch (error) {
      toast.error("Failed to rename file");
    }
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const blob = await downloadFile(fileId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("File downloaded successfully");
    } catch (error) {
      toast.error("Failed to download file");
    } finally {
      setShowOptionsMenuId(null);
    }
  };

  // File sharing functions
  const handleShareFile = (file) => {
    setShareFile(file);
    setShowShareModal(true);
    setShowOptionsMenuId(null);
    setShareEmail("");
    setSharePermission("read");
    setGeneratedLink("");
    setShareTab("email");
  };

  const handleShareEmail = async () => {
    if (!shareEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      const res = await shareFileWithEmail({
        fileId: shareFile.id,
        email: shareEmail.trim(),
        permission: sharePermission,
      }).unwrap();
      toast.success(`File shared with ${shareEmail}`);
      console.log("File shared:", res);
      setShareEmail("");
    } catch (err) {
      console.error("Error sharing file", err);
      toast.error("Failed to share file");
    }
  };

  const handleGenerateLink = async () => {
    try {
      const res = await generateSharableLink({
        fileId: shareFile.id,
        permission: sharePermission,
      }).unwrap();
      setGeneratedLink(res.link);
      toast.success("Shareable link generated");
      console.log("Sharable link:", res.link);
    } catch (err) {
      console.error("Error generating link", err);
      toast.error("Failed to generate shareable link");
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Link copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setShareFile(null);
    setShareEmail("");
    setSharePermission("read");
    setGeneratedLink("");
    setShareTab("email");
  };

  const startRename = (file) => {
    setEditingFile(file.id);
    setNewFileName(file.name);
    setShowOptionsMenuId(null);
  };

  const toggleOptionsMenu = (fileId) => {
    setShowOptionsMenuId(showOptionsMenuId === fileId ? null : fileId);
  };

  const navigateToFolder = (id) => {
    navigate(`/dashboard/folder/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading files...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading files</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - now at the very top with full width */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {folderId && (
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">
              {folderId ? "Folder" : "My Drive"}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowCreateFolder(true)}
              disabled={isCreatingFolder}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        {/* Create Folder Modal */}
        {showCreateFolder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateFolder()}
                className="mb-4 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateFolder}
                  disabled={isCreatingFolder || !newFolderName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isCreatingFolder ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && shareFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-96 shadow-lg max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">
                  Share "{shareFile.name}"
                </h3>
                <Button variant="ghost" size="sm" onClick={closeShareModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setShareTab("email")}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    shareTab === "email"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Mail className="h-4 w-4 mr-2 inline" />
                  Share via Email
                </button>
                <button
                  onClick={() => setShareTab("link")}
                  className={`flex-1 px-4 py-3 text-sm font-medium ${
                    shareTab === "link"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Link className="h-4 w-4 mr-2 inline" />
                  Get Link
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Permission Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permission
                  </label>
                  <select
                    value={sharePermission}
                    onChange={(e) => setSharePermission(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="read">Can view</option>
                    <option value="write">Can edit</option>
                  </select>
                </div>

                {shareTab === "email" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        className="flex-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleShareEmail()
                        }
                      />
                      <Button
                        onClick={handleShareEmail}
                        disabled={isSharingWithEmail || !shareEmail.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isSharingWithEmail ? "Sharing..." : "Share"}
                      </Button>
                    </div>
                  </div>
                )}

                {shareTab === "link" && (
                  <div>
                    {!generatedLink ? (
                      <Button
                        onClick={handleGenerateLink}
                        disabled={isGeneratingLink}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isGeneratingLink
                          ? "Generating..."
                          : "Generate Shareable Link"}
                      </Button>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shareable Link
                        </label>
                        <div className="flex space-x-2">
                          <Input
                            value={generatedLink}
                            readOnly
                            className="flex-1 bg-gray-50 border-gray-300"
                          />
                          <Button
                            onClick={() => copyToClipboard(generatedLink)}
                            className="bg-gray-600 hover:bg-gray-700 text-white"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Anyone with this link can{" "}
                          {sharePermission === "read" ? "view" : "edit"} this
                          file
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end p-6 border-t border-gray-200">
                <Button variant="outline" onClick={closeShareModal}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
              <p className="text-gray-700 mb-6">{confirmMessage}</p>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setConfirmAction(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAction}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Files Grid */}
        {files.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No files yet
            </h3>
            <p className="text-gray-500 mb-4">
              Upload files or create folders to get started
            </p>
            <div className="space-x-2">
              <Button
                onClick={() => setShowCreateFolder(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Folder
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {file.is_folder ? (
                      <Folder className="h-8 w-8 text-blue-500 flex-shrink-0" />
                    ) : (
                      <File className="h-8 w-8 text-gray-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      {editingFile === file.id ? (
                        <Input
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            handleRenameFile(file.id, newFileName)
                          }
                          onBlur={() => handleRenameFile(file.id, newFileName)}
                          autoFocus
                          className="text-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      ) : (
                        <p
                          className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-blue-600"
                          onClick={() =>
                            file.is_folder && navigateToFolder(file.id)
                          }
                        >
                          {file.name}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {file.is_folder ? "Folder" : formatBytes(file.size)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(file.updated_at)}
                      </p>
                    </div>
                  </div>

                  <div
                    className="relative"
                    ref={showOptionsMenuId === file.id ? optionsMenuRef : null}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOptionsMenu(file.id)}
                    >
                      <MoreVertical className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    </Button>
                    {showOptionsMenuId === file.id && (
                      <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-32">
                        {/* Download option only for files */}
                        {!file.is_folder && (
                          <button
                            onClick={() =>
                              handleDownloadFile(file.id, file.name)
                            }
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            disabled={isDownloading}
                          >
                            <Download className="h-4 w-4 mr-2 text-gray-500" />
                            Download
                          </button>
                        )}

                        {/* Rename option (for both files and folders) */}
                        <button
                          onClick={() => startRename(file)}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          disabled={isRenaming}
                        >
                          <Edit className="h-4 w-4 mr-2 text-gray-500" />
                          Rename
                        </button>

                        {/* Share option only for files */}
                        {!file.is_folder && (
                          <button
                            onClick={() => handleShareFile(file)}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <Share className="h-4 w-4 mr-2 text-gray-500" />
                            Share
                          </button>
                        )}

                        {/* Delete option (for both files and folders) */}
                        <button
                          onClick={() => handleDeleteFile(file.id, file.name)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center text-red-600"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
