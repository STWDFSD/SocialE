const InappropriatePost = ({
  showInappropriateContentModal,
  closeInappropriateContentModal,
  contentType,
}) => {
  const modalClass = showInappropriateContentModal
    ? "fixed z-10 inset-0 overflow-y-auto"
    : "hidden";

  const handleClose = () => {
    if (showInappropriateContentModal) {
      closeInappropriateContentModal();
    }
  };

  return (
    <div className={modalClass}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
            <h2 className="text-lg font-bold mb-4">Inappropriate Content</h2>
            <p className="text-gray-700 mb-6">
              Your {contentType} contains content that goes against our
              community guidelines. Please review and adhere to our guidelines
              to maintain a positive and respectful environment for all users.
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InappropriatePost;
