import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import Layout from '../layout';
import { useEffect } from 'react';
import { useState } from 'react';
import { getAtPiForClass, getClassAdmissionSummary, getClassApplication, getSchoolClassesData } from '../../../utils/services';
import ShowApplications from "./showApplications";
import OpenModal from "./openModal";
import FilterApp from "./filterApp";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import ReviewAdmissionDialog from "../../../dialogs/reviewAdmissionDialog";
import { getLocalData } from "../../../utils/helper";


export const ManageApplication = () => {
  const [rowsData, setRowsData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const schoolId = getLocalData('schoolId');
  const [apiError, setApiError] = useState('');
  const [isBulkOperation, setIsbulkOperation] = useState(false);
  const [atPiData, setAtPiData] = useState(null);
  const [showApplication, setShowApplication] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const [isLoading, setIsloading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [admissionData, setAdmissionData] = useState(null);
  const [applicationStaus, setApplicationStatus] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [schoolClassesData, setSchoolClassesData] = useState([]);
  const [classId, setClassId] = useState('');

  const fetchSchoolClassesData = (schoolId) => {
    getSchoolClassesData(schoolId)
      .then(response => {
        if (response.status === 200) {
          setSchoolClassesData(response?.data);
          setClassId(response?.data[0]?.classId);
        }
      })
      .catch(error => {
        console.log(error);
        setIsloading(false);
      });
  };

  const fetchClassAdmissionSummary = (classId) => {
    getClassAdmissionSummary(classId)
      .then(response => {
        if (response.status === 200) {
          setAdmissionData(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchClassApplication = (classId) => {
    setIsloading(true);
    getClassApplication(classId).
      then(response => {
        let res = response.data;
        res = res.map((val, index) => {
          return {
            ...val,
            rowIndex: index + 1
          };
        });
        setIsloading(false);
        setSelectedRows({});
        setRowsData(res);
      }).
      catch(() => {
        setSelectedRows({});
        setIsloading(false);
      });
  };

  const handleBulkStatusUpdate = (status, rowIndexes, allData) => {
    const appIds = Object.keys(rowIndexes).map(val => {
      return allData[val]?.applicationId;
    });
    setApplicationStatus(status);
    setApplicationId(appIds);
    setOpenModal(true);
    setIsbulkOperation(true);
  };

  const fetchAtPiForClass = (classId) => {
    getAtPiForClass(classId)
      .then(res => {
        if (Object.keys(res.data).length > 0) {
          setAtPiData(res.data);
        } else {
          setAtPiData(null);
        }
      });
  };
  useEffect(() => {
    if (schoolId)
      fetchSchoolClassesData(schoolId);
  }, [schoolId]);

  useEffect(() => {
    if (classId) {
      fetchClassAdmissionSummary(classId);
      fetchClassApplication(classId);
      fetchAtPiForClass(classId);
    }
  }, [classId]);

  useEffect(() => {
    if (apiError !== '') {
      toast.error(apiError);
    }
  }, [apiError]);

  return (
    <Layout admissionSummary={admissionData?.upperSchoolAdmissionSummary}>
      <div className='content-area-inner inner-page-outer'>
        <div className='internal-page-wrapper two-columns'>
          <FilterApp
            schoolClassesData={schoolClassesData}
            classId={classId}
            setClassId={setClassId}
            setRowsData={setRowsData}
          />
          {!isLoading && <ShowApplications
            setApplicationStatus={setApplicationStatus}
            setApplicationId={setApplicationId}
            setOpenModal={setOpenModal}
            setIsbulkOperation={setIsbulkOperation}
            selectedRows={selectedRows}
            isAtPiData={atPiData !== null}
            rowsData={rowsData}
            handleBulkStatusUpdate={handleBulkStatusUpdate}
            setSelectedRows={setSelectedRows}
            setShowApplication={setShowApplication}
            setSelectedApplicationId={setSelectedApplicationId}
          />}
          {isLoading && <div style={{ margin: '50px auto' }}><Spinner animation="border" /></div>}
          <OpenModal
            show={openModal}
            setShow={setOpenModal}
            isBulkOperation={isBulkOperation}
            applicationStaus={applicationStaus}
            setApplicationStatus={setApplicationStatus}
            applicationId={applicationId}
            fetchClassApplication={fetchClassApplication}
            classId={classId}
            setApplicationId={setApplicationId}
            setApiError={setApiError}
            isAtPiData={atPiData !== null}
            atPiData={atPiData}
          />
        </div>
      </div>
      <ReviewAdmissionDialog
        show={showApplication}
        handleClose={() => {
          setShowApplication(false);
          setSelectedApplicationId('');
        }}
        applicationId={selectedApplicationId} />
    </Layout>
  );
};
export default ManageApplication;
