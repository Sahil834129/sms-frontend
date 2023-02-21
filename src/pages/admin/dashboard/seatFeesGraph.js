import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { DoughnutChart } from "../../../common/Chart";
import { getSchoolAdmissinFeeSummary } from "../../../utils/services";

export default function SeatsFeesGraph({ schoolSeatsSummary, applicationStatus ,admissionSummary }) {
    //dashboard/schoolAdmissionFeeSummary
    const [feesCollected, setFeesCollected] = useState(0);
    const [feesCollectedPercent, setFeesCollectedPercent] = useState(0);
    const [totalSeats, setTotalSeats] = useState(0);
    const [accepetedPercentsage, setAcceptedPercentage] = useState(0);
    const [totalFeesCollected, setTotalFeesCollected] = useState(0);
    // const accepetedPercentsage =;
    const fetchSchoolAdmissinFeesSummary = () => {
        getSchoolAdmissinFeeSummary().then(res => {
            const val = res?.data;
            if (val?.schoolAdmissionFeeSummary?.projectedFee === 0) {
                setTotalFeesCollected(0);
                setFeesCollected(0);
            } else {
                setTotalFeesCollected(val?.schoolAdmissionFeeSummary?.projectedFee);
                setFeesCollected(val?.schoolAdmissionFeeSummary?.collectedFee);
                setFeesCollectedPercent(parseFloat((parseFloat(val?.schoolAdmissionFeeSummary?.collectedFee || 0) * 100) / parseFloat(val?.schoolAdmissionFeeSummary?.projectedFee)).toFixed(2));
            }
        }).catch((e) => {
            console.log(e);
        });
    };

    useEffect(() => {
        fetchSchoolAdmissinFeesSummary();
    }, []);

    useEffect(() => {
        setTotalSeats(schoolSeatsSummary?.filled + schoolSeatsSummary?.vacant);
    }, [schoolSeatsSummary]);

    useEffect(() => {
        setTotalSeats(schoolSeatsSummary?.filled + schoolSeatsSummary?.vacant);
    }, [schoolSeatsSummary]);

    useEffect(() => {
        const percentageVal = (((parseInt(admissionSummary?.accepted || 0)) * 100) / totalSeats);
        setAcceptedPercentage(isNaN(percentageVal) ? 0 : parseFloat(percentageVal).toFixed(2));
    }, [admissionSummary, totalSeats]);

    return (
        <div className='chart-block ch2'>
            <div className='title-area' style={{ paddingBottom: 0, marginBottom: 0 }}>
                <div className='right-col'>
                    <ListGroup className='clist-group'>
                        <ListGroup.Item>
                            <span className='value'>{(totalSeats) || 0}</span>
                            <label>Total Seats</label>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <span className='value'>{admissionSummary?.totalApplication || 0}</span>
                            <label>Application Received</label>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <span className='value'>{feesCollected.toLocaleString('en-IN', 
                                        {   maximumFractionDigits: 2,
                                            style: 'currency',
                                            currency: 'INR'
                                        })}
                            </span>
                           <label>Fees Collected</label>
                        </ListGroup.Item>
                    </ListGroup>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', paddingTop: '30px' }}>Application Status</div>
                </div>
            </div>
            <table className='chart-area' style={{ padding: 0 }}>
                <tbody>
                    <tr>
                        <td>
                            <DoughnutChart
                                data={{
                                    datasets: [
                                        {
                                            data: [accepetedPercentsage, 100 - accepetedPercentsage],
                                            backgroundColor: ["#41285F", "#EEF0F5"],
                                            borderRadius: 30,
                                            cutout: 90,
                                            radius: 80,
                                        }],
                                } || {}}
                                midNumberText={accepetedPercentsage+'%'}
                                midTextFirst={'Offer'}
                                midTextSecond={'Accepted'}
                                totalRemainngData={`${totalSeats}`}
                                totalRemainng="Remaining Seats"
                            />
                        </td>
                        <td>
                            <DoughnutChart
                                data={{
                                    datasets: [
                                        {
                                            data: [feesCollectedPercent, 100 - feesCollectedPercent],
                                            backgroundColor: ["#59D04D", "#EEF0F5"],
                                            borderRadius: 30,
                                            cutout: 90,
                                            radius: 80
                                        }],
                                } || {}}
                                midNumberText={feesCollectedPercent+'%'}
                                midTextFirst={'Fees'}
                                midTextSecond={'Collected'}
                                totalRemainngData={`₹ ${totalFeesCollected.toLocaleString('en-IN')}`}
                                totalRemainng="Projected Fees"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
} 