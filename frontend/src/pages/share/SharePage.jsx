import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetSharedFileQuery } from "@/store/api/shareFileApi";

export default function SharePage() {
  const { shareId } = useParams();
  const { data, error, isLoading } = useGetSharedFileQuery(shareId);

  useEffect(() => {
    if (data?.file?.download_url) {
      // Redirect directly to the signed URL
      window.location.href = data.file.download_url;
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">This link is invalid or expired.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-semibold">Preparing your download...</h1>
    </div>
  );
}
