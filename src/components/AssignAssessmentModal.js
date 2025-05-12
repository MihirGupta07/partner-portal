import React, { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { useModal } from "../context/ModalContext";
import { partnerPortalService } from "../utils/apiService";

const AssignAssessmentModal = () => {
  const {  currentPartner } = useAuth();
  const { isAssignModalOpen, closeAssignModal, triggerAssessmentCallbacks } =
    useModal();
  const [formData, setFormData] = useState({
    phone: "",
    name: "",
    email: "",
    assessmentId: "",
  });
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const [userStatus, setUserStatus] = useState(null); // null, 'exists', 'new'
  const [userDetails, setUserDetails] = useState(null);

  // Fetch available assessments when modal opens
  React.useEffect(() => {
    if (isAssignModalOpen && currentPartner?._id) {
      setLoading(true);
      partnerPortalService
        .getAvailableProducts(currentPartner._id)
        .then(({data}) => {
          setAssessments(data || []);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load assessments");
          setLoading(false);
        });
    }
  }, [isAssignModalOpen, currentPartner]);

  const handlePhoneChange = async (e) => {
    const phoneNumber = e.target.value;
    setFormData((prev) => ({ ...prev, phone: phoneNumber }));
    setUserStatus(null);
    setUserDetails(null);

    // When phone number length is exactly 10, search for user
    if (phoneNumber.length === 10) {
      setSearchingUser(true);
      const startTime = Date.now();

      try {
        const { data: dataArray } = await partnerPortalService.searchUser(
          `91${phoneNumber}`
        );
        const data = dataArray?.[0];

        if (data && data.name) {
          // Store user details for display
          setUserDetails({
            userId: data.id,
            name: data.name,
            phone: phoneNumber,
            email: data.email || "Not provided",
          });

          // Also update in form data
          setFormData((prev) => ({
            ...prev,
            name: data.name,
            email: data.email || "",
          }));

          setUserStatus("exists");
        } else {
          setUserStatus("new");
          setFormData((prev) => ({ ...prev, name: "", email: "" }));
        }
      } catch (err) {
        // Silent fail - just don't auto-fill name if user not found
        console.log("User not found or error searching");
        setUserStatus("new");
      } finally {
        // Ensure loading state shows for at least 2 seconds
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 1000 - elapsedTime);

        setTimeout(() => {
          setSearchingUser(false);
        }, remainingTime);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create assessment assignment payload
      const assignmentData = {
        partnerId: currentPartner._id,
        productId: formData.assessmentId,
      };

      // If the user is new, create them first
      if (userStatus === "new") {
        const userData = {
          name: formData.name,
          phone: `91${formData.phone}`,
          email: formData.email || undefined,
          partnerId: currentPartner._id
        };
        
        const { data: newUser } = await partnerPortalService.createUser(userData);
        console.log('newUser', newUser);
        assignmentData.userId = newUser._id;
      } else {
        // User already exists
        assignmentData.userId = userDetails.userId;
      }

      // Call the API endpoint to assign the product
      await partnerPortalService.assignProductToUser(assignmentData);

      // Reset form
      setFormData({ phone: "", name: "", email: "", assessmentId: "" });
      setUserDetails(null);
      setUserStatus(null);
      closeAssignModal();
      // Trigger all registered callbacks
      triggerAssessmentCallbacks();
    } catch (err) {
      setError(err.message || "Failed to assign assessment");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data and state when canceling
    setFormData({ phone: "", name: "", email: "", assessmentId: "" });
    setUserDetails(null);
    setUserStatus(null);
    closeAssignModal();
  };

  // Check if form is valid
  const isFormValid = () => {
    if (!formData.phone || formData.phone.length !== 10) return false;
    if (!formData.assessmentId) return false;
    if (userStatus === "new" && !formData.name) return false;
    return true;
  };

  if (!isAssignModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Assign Assessment
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        disabled={searchingUser}
                      />
                      {searchingUser && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <svg
                            className="animate-spin h-5 w-5 text-indigo-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>

                    {userStatus === "new"&& !searchingUser && (
                      <p className="mt-1 text-sm text-blue-600">
                        New user. Please complete the details.
                      </p>
                    )}
                  </div>

                  {userStatus === "exists" && userDetails && !searchingUser && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="font-medium text-gray-700 text-sm mb-2">
                        User Details:
                      </h4>
                      <dl className="grid grid-cols-3 gap-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Name:
                        </dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {userDetails.name}
                        </dd>

                        <dt className="text-sm font-medium text-gray-500">
                          Phone:
                        </dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {userDetails.phone}
                        </dd>

                        <dt className="text-sm font-medium text-gray-500">
                          Email:
                        </dt>
                        <dd className="text-sm text-gray-900 col-span-2">
                          {userDetails.email}
                        </dd>
                      </dl>
                    </div>
                  )}

                  {userStatus === "new" && !searchingUser && (
                    <>
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email (optional)
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label
                      htmlFor="assessment"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Assessment
                    </label>
                    <select
                      id="assessment"
                      name="assessment"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formData.assessmentId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          assessmentId: e.target.value,
                        }))
                      }
                    >
                      <option value="">Select an assessment</option>
                      {assessments.map((assessment) => (
                        <option key={assessment.id} value={assessment._id}>
                          {assessment.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm mt-2">{error}</div>
                  )}
                </form>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                isFormValid()
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-indigo-300 cursor-not-allowed"
              } text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={handleSubmit}
              disabled={loading || !isFormValid()}
            >
              {loading ? "Assigning..." : "Assign"}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignAssessmentModal;
