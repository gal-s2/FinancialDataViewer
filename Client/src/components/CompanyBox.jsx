import { useState } from "react";

const fields = [
    ["Symbol", "symbol"],
    ["Company Name", "companyName"],
    ["Price", "price"],
    ["Market Cap", "marketCap"],
    ["Currency", "currency"],
    ["Exchange", "exchange"],
    ["Industry", "industry"],
    ["CEO", "ceo"],
    ["Sector", "sector"],
    ["Country", "country"],
    ["Full Time Employees", "fullTimeEmployees"],
    ["ETF", "isEtf"],
    ["Website", "website"],
    ["Description", "description"],
];

function CompanyBox({ company }) {
    if (!company) return null;

    const [showDescription, setShowDescription] = useState(false);

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-md p-6">
            <h2 className="text-3xl font-bold mb-1">{company.companyName}</h2>

            {fields.map(([label, key]) => {
                let value = company[key];
                if (!value) return null;

                if (typeof value === "number") value = value.toLocaleString();
                else if (typeof value === "boolean") value = value ? "✔" : "✘";

                if (key === "website") {
                    // website is a link
                    value = (
                        <a href={value} className="text-blue-600 underline">
                            {value}
                        </a>
                    );
                } else if (key === "description") {
                    // description is clickable
                    value = (
                        <span className="mt-4">
                            <button className="text-blue-600 cursor-pointer underline focus:outline-none" onClick={() => setShowDescription((prev) => !prev)} type="button">
                                {showDescription ? "Hide" : "Show"}
                            </button>
                            {showDescription && <span className="block mt-2">{company.description}</span>}
                        </span>
                    );
                }
                if (key === "country") {
                    value = (
                        <span className="inline-flex items-center gap-2">
                            {value}
                            <img src={`https://flagcdn.com/24x18/${company.country.toLowerCase()}.png`} alt={`${value}-flag`} className="inline-block" />
                        </span>
                    );
                }

                return (
                    <p key={key}>
                        <strong>{label}:</strong> {value}
                    </p>
                );
            })}
        </div>
    );
}

export default CompanyBox;
