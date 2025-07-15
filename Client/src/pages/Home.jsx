import { useState } from "react";
import axios from "axios";
import SearchForm from "../components/SearchForm";
import CompanyBox from "../components/CompanyBox";
import GradeListBox from "../components/GradeListBox";
import PriceChart from "../components/PriceChart";

const baseUrl = import.meta.env.VITE_API_URL;
const URL = (ticker) => `${baseUrl}/companies/${ticker}`;

function Home() {
    const [ticker, setTicker] = useState("");
    const [company, setCompany] = useState(null);
    const [grades, setGrades] = useState([]);
    const [historicalPrices, setHistoricalPrices] = useState([]);
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        // Search for ticker
        try {
            setLoading(true);
            setErrors("");
            setCompany(null);
            setGrades([]);
            setHistoricalPrices([]);

            const response = await axios.get(URL(ticker));
            setCompany(response.data.company);
            setGrades(response.data.grades);
            setHistoricalPrices(response.data.historicalPrices);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.status === 404) {
                setErrors(err.response.data.error || "Company not found");
            } else {
                setErrors("Something went wrong");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            <SearchForm onSearch={handleSearch} value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())} disabled={!ticker.trim()} />
            {errors && <p className="text-red-600 mt-4">{errors}</p>}

            {loading ? (
                <p className="text-blue-600 mt-4">Loading...</p>
            ) : (
                <div className="flex flex-row gap-4 mt-2 w-full">
                    <div className="flex-1">{company && <CompanyBox company={company} />}</div>
                    <div className="flex-1 flex flex-col gap-4">
                        {grades.length > 0 && <GradeListBox grades={grades} />}
                        {historicalPrices.length > 0 && <PriceChart priceData={historicalPrices} />}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
