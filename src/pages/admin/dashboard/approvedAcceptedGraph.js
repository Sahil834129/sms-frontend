import { Barchart } from "../../../common/Chart";
import { ReactComponent as Expand } from "../../../assets/img/icons/expand.svg";

export default function ApprovedAcceptedGraph({ applicationApproved, acceptedOffer, labels, hideLabel }) {
    const chartOptionsValue = {
        plugins: {
            legend: {
                position: "top",

            },
            title: {
                display: false,
                text: "Class",

            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                title: {
                    display: false,
                    text: "x axis",
                    color: "000000",
                },
                ticks: {
                    autoSkip: false,
                    display: hideLabel,
                }
            },
            y: {
                grid: {
                    display: false
                },
                title: {
                    display: false,
                    text: "y axis",
                    color: "000000",
                },
                ticks: {
                    callback: function (value) { if (value % 1 === 0) { return value; } },
                    autoSkip: false,
                    display: hideLabel,
                }
            }
        }
    };
    return (
        <div className='metrics-block mb3'>
            <div className='title-area'>
                <h2>Applications Approved Vs Offers Accepted {!hideLabel ? <Expand /> : ""}</h2>
            </div>
            <div className='chart-area'>
                <Barchart
                    option={chartOptionsValue}
                    labelsdata={{
                        labels: labels,
                        datasets: [
                            {
                                label: "Application Approved",
                                data: applicationApproved,
                                backgroundColor: "#F7C32E",
                                boxWidth: 14,

                            },
                            {
                                label: "Offers Accepted",
                                data: acceptedOffer,
                                backgroundColor: "#4AB900",
                                boxWidth: 14,
                            }]
                    }}
                    styling={{ height: '120px', width: '100%' }} />
            </div>
        </div>
    );
}