import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function PriceChart({ priceData }) {
    if (!priceData || priceData.length === 0) {
        return <div>No price data available</div>;
    }

    const options = {
        chart: {
            type: "line",
            height: 300,
            zoomType: "x",
        },
        legend: {
            enabled: false,
        },
        title: {
            text: "Closing Price",
        },
        xAxis: {
            categories: priceData.map((d) =>
                new Date(d.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })
            ),

            labels: {
                rotation: 45,
                step: Math.ceil(priceData.length / 10),
                y: 50,
            },
        },
        yAxis: {
            title: { text: "Price (USD)" },
        },
        tooltip: {
            xDateFormat: "%d/%m/%Y",
            pointFormat: `<b>Close:</b> $<b>{point.y:.2f}</b>`,
        },
        series: [
            {
                name: "Close",
                data: priceData.map((d) => d.close),
                color: "#1E90FF",
            },
        ],
    };

    return (
        <div className="bg-white shadow-sm border border-gray-200 rounded-md p-6">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}

export default PriceChart;
