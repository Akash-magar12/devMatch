const InputWrapper = ({ children, Icon, label }) => {
  return (
    <div className="relative w-full">
      <div className="bg-white border border-gray-300 rounded-xl p-3 transition-all duration-300 hover:border-gray-400 focus-within:border-black focus-within:bg-gray-50">
        <div className="flex items-start space-x-3">
          {Icon && (
            <Icon className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
          )}
          <div className="flex-1">
            {label && (
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputWrapper;
