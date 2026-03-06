import { Verified } from "lucide-react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VerifyPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/verify-email/${token}`);
        const data = await res.json();

        if (res.ok) {
          setTimeout(() => {
            navigate("/login", { state : { verified: 
          true} });
            },2000);
        } else {
          alert(data.message || "Verification failed");
        }
      } catch (error) {
        console.error(error);
        alert("Server error");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold">Verifying your email...</h2>
    </div>
  );
}