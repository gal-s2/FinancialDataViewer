function SearchForm({ onSearch, value, onChange, disabled }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(value);
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-4 p-1">
            <input type="text" value={value} onChange={onChange} placeholder="Enter ticker..." className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button disabled={disabled} className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 cursor-pointer hover:bg-blue-700"}`}>
                Search
            </button>
        </form>
    );
}

export default SearchForm;
