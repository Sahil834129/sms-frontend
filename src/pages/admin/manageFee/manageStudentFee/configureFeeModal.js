import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import GenericDialog from "../../../../dialogs/GenericDialog";
import { humanize } from "../../../../utils/helper";
import { addFeeInStudenFee, getClassesFeeDetails, removeFeeFromStudenFee } from "../../../../utils/services";
import FeeModalHeader from "./feeModalHeader";

export default function ConfigureFeeModal({ configureFeeModal, handleClose, student, fetchStudentFees, feesDetail, session }) {
  const [calculatedFee, setCalculatedFees] = useState(0);
  const [classFees, setClassFees] = useState([]);
  const fetchStudentFeesData = (feesDetail) => {
    getClassesFeeDetails(student.classId, session)
      .then(response => {
        if (response.status === 200) {
          const result = response?.data.map(val => {
            const data = feesDetail.filter(fee => fee.studentFee.feeTypeId === val.classFee.feeTypeId);
            return {
              ...val,
              disabled: val?.classFee?.mandatory,
              isChecked: data.length > 0
            };
          });
          setClassFees(result);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getCalulagedFee = (fees) => {
    let temp = 0;
    if (fees.length > 0) {
      fees.map(val => {
        if (val?.classFee && val?.isChecked) {
          temp = temp + val?.classFee?.feeAmount;
        }
      });
    }
    return temp;
  }

  const handleInput = (isChecked, index, fees, feesDetailIds) => {
    const updatedFees = fees.map((val, i) => {
      if (i === index) {
        val.classFee.mandatory = isChecked;
        val.isChecked = isChecked
        if (val.isChecked){
        const payload = {
          "studentId": student.studentId,
          "classId": val.classId,
          "classFeeId": val.classFeeId,
        }
        addFeeInStudenFee(payload)
        .then(res => fetchStudentFees())
        .catch(err=> console.log(err))
      } else{
        if (feesDetailIds[i].studentId && feesDetailIds[i].studentFeeId){
          const studentId = feesDetailIds[i].studentId
          const studentFeeId = feesDetailIds[i].studentFeeId
          removeFeeFromStudenFee(studentId, studentFeeId)
        } else {
          if (feesDetailIds[i].studentId ) {
            toast.error("Student Fee Id is missing")
          } else {
            toast.error("Student Id is missing")
          }
        }
      }
      }
      return val;
    });
    setClassFees(updatedFees);
  };

  useEffect(() => {
    if (classFees.length > 0) {
      setCalculatedFees(getCalulagedFee(classFees));
    }
  }, [classFees]);

  useEffect(() => {
    fetchStudentFeesData(feesDetail);
  }, [feesDetail]);

  return (
<GenericDialog
      show={configureFeeModal}
      handleClose={handleClose}
      modalHeader='Configure fee'
      className="Student-fee-model "
    >
      <FeeModalHeader student={student} session={session}/>
      <div className="table-wrapper">
        <table className="table" style={{ width: '100%' }}>
          <thead>
            <tr valign="middle">
              <th>Fee Type</th>
              <th>Frequency</th>
              <th style={{ textAlign: "center" }}>Fee Amount</th>
              <th style={{ textAlign: "center" }}>Mandatory</th>
            </tr>
          </thead>
          <tbody>
            {classFees && classFees.length > 0 &&
              classFees.map((val, index) => (
                <tr valign="middle" key={`configureFee${index}`} >
                  <td>{val?.classFee?.feeTypeName}</td>
                  <td>{humanize(val?.classFee?.feeTypeFrequency)}</td>
                  <td style={{ textAlign: "center" }}>{val?.classFee?.feeAmount}</td>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      disabled={val?.disabled}
                      checked={val?.isChecked || false}
                      onChange={e => {
                        handleInput(e.target.checked, index, classFees, feesDetail);
                      }}
                    />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      <div  className="total-amount-wrapp">
        <span className="amount-lbl">Total Amount Due <span> ₹{calculatedFee}/-</span></span>
      </div>
    </GenericDialog>
  );
}