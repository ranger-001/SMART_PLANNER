
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-urgray">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="w-20 h-20 bg-red-100 flex items-center justify-center rounded-full mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mt-6">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            {user
              ? `Your account (${user.role}) doesn't have permission to access this page.`
              : "You don't have permission to access this page."}
          </p>
          <div className="mt-6 flex justify-center space-x-3">
            <Button
              onClick={() => navigate("/")}
              variant="default"
              className="bg-urblue hover:bg-urblue-dark"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-urblue text-urblue hover:bg-urblue/10"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
