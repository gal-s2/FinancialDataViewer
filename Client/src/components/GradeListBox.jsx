import { useState } from "react";

const pageSize = 4;

function GradeListBox({ grades }) {
    const [page, setPage] = useState(0);

    if (!grades || grades.length === 0) {
        return <p className="text-gray-600">No grades available.</p>;
    }

    const pageCount = Math.ceil(grades.length / pageSize);
    const startIndex = page * pageSize;
    const endIndex = startIndex + pageSize;
    const currentGrades = grades.slice(startIndex, endIndex);

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-md p-6">
            <h2 className="text-2xl font-semibold">Grades History</h2>
            <ul className="space-y-3">
                {currentGrades.map((grade, index) => (
                    <li key={startIndex + index} className="text-gray-700">
                        <p className="font-medium">
                            {grade.gradingCompany}
                            <span className="text-sm text-gray-500 ml-2">({new Date(grade.date).toLocaleDateString()})</span>
                        </p>

                        <p className="ml-3">
                            Action: <span className="font-semibold">{grade.action}</span>
                            {grade.previousGrade && grade.newGrade && (
                                <>
                                    {" –"}
                                    <span className="text-gray-600"> from </span>
                                    <span className="text-red-600 font-semibold">{grade.previousGrade}</span>
                                    <span className="text-gray-600"> to </span>
                                    <span className="text-green-600 font-semibold">{grade.newGrade}</span>
                                </>
                            )}
                        </p>
                    </li>
                ))}
            </ul>

            <div className="flex justify-between items-center mt-5">
                <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0} className={`text-sm px-3 py-2 rounded ${page === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                    {"<"}
                </button>

                <span className="text-sm text-gray-600">
                    Page {page + 1} of {pageCount}
                </span>

                <button onClick={() => setPage((prev) => Math.min(prev + 1, pageCount - 1))} disabled={page >= pageCount - 1} className={`text-sm px-3 py-2 rounded ${page >= pageCount - 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                    {">"}
                </button>
            </div>
        </div>
    );
}

export default GradeListBox;
