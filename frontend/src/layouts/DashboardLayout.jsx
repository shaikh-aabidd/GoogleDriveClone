import { Outlet, useNavigate } from "react-router-dom";
import { use, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../store/api/authApi";
import { logout } from "../store/slices/authSlice";
import {
  useDeleteFileMutation,
  useDownloadFileMutation,
  useRenameFileMutation,
  useSearchFilesQuery,
} from "../store/api/fileApi";
import {
  Folder,
  Upload,
  Search,
  Menu,
  X,
  LogOut,
  User,
  HardDrive,
  MoreVertical,
  Download,
  Edit,
  Trash2,
  User2,
  User2Icon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Progress } from "../components/ui/progress";
import { useGetStorageInfoQuery } from "../store/api/fileApi";
import { selectCurrentUser } from "../store/slices/authSlice";
import { toast } from "sonner";

const DashboardLayout = () => {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [logoutMutation] = useLogoutMutation();
  const { data: storageInfoData } = useGetStorageInfoQuery();
  const storageInfo = storageInfoData?.data;

  const { data: searchResults, isFetching } = useSearchFilesQuery(searchQuery, {
    skip: !searchQuery,
  });

  const [deleteFile, { isLoading: isDeleting }] = useDeleteFileMutation();
  const [renameFile, { isLoading: isRenaming }] = useRenameFileMutation();
  const [downloadFile, { isLoading: isDownloading }] =
    useDownloadFileMutation();

  const [showOptionsMenuId, setShowOptionsMenuId] = useState(null);
  const optionsMenuRef = useRef(null);

  // Reuse these handlers or define if not present
  const toggleOptionsMenu = (fileId) => {
    setShowOptionsMenuId((prev) => (prev === fileId ? null : fileId));
  };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  // Check if we should show search results or default content
  const shouldShowSearchResults =
    searchQuery.trim() !== "" && searchResults?.data?.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Drive Clone</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col h-full justify-between">
          {/* Navigation */}
          <nav className=" px-4 py-6 space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={()=>navigate("/dashboard")}>
              <Folder className="mr-3 h-5 w-5" />
              My Drive
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={()=>navigate("/dashboard/share-with-me")}>
              <User2Icon className="mr-3 h-5 w-5" />
              Shared With Me
            </Button>
            {/* <Button variant="ghost" className="w-full justify-start">
              <Search className="mr-3 h-5 w-5" />
              Search
            </Button> */}
          </nav>

          <div className="flex flex- flex-2 flex-col pb-16">
            {/* Storage Info */}
            <div className="p-4 border-t">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Storage</span>
                  <span className="font-medium">
                    {storageInfo
                      ? `${formatBytes(storageInfo.used)} / ${formatBytes(
                          storageInfo.limit
                        )}`
                      : "Loading..."}
                  </span>
                </div>
                <Progress
                  value={storageInfo?.percentage || 0}
                  className="h-2"
                />
                <div className="text-xs text-gray-500">
                  {storageInfo?.percentage || 0}% used
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  
                    <AvatarFallback>
                      {user?.full_name?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.full_name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Search bar */}
            <div className="relative flex-1 max-w-md mx-4 lg:mx-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 w-full"
              />
            </div>

            {/* Mobile user info */}
            <div className="flex items-center space-x-2 lg:hidden">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.full_name?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "U"}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {shouldShowSearchResults ? (
            <ul className="space-y-2">
              {searchResults.data.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between p-2 border rounded bg-white shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      {file.size} bytes
                    </span>
                  </div>

                  {/* Options menu */}
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
                        {!file.is_folder && (
                          <button
                            onClick={() =>
                              handleDownloadFile(file.id, file.name)
                            }
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          >
                            <Download className="h-4 w-4 mr-2 text-gray-500" />
                            Download
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteFile(file.id, file.name)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
