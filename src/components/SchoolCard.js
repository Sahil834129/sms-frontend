import React, { useState } from "react";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import { useNavigate } from "react-router-dom";
import AlertDialog from "../common/AlertDialog";
import ApplyToSchoolDialog from "../dialogs/applyToSchoolDialog";
import LoginDialog from "../dialogs/loginDialog";
import PageContent from "../resources/pageContent";
import { isEmpty, isLoggedIn } from "../utils/helper";
import InfoDropDown from "./InfoDropDown";
import SchoolCardHeader from "./SchoolCardHeader";
import { ReactComponent as ApplicationPartner } from "../assets/admin/img/application-partner.svg";


const SchoolCard = (props) => {
    const navigate = useNavigate()
    const school = props.school;
    const [selectedSchoolToApply, setSelectedSchoolToApply] = useState('');
    const [showApplyToSchoolDialog, setShowApplyToSchoolDialog] = useState(false);
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [alertMessage, setAlertMessage] = useState('')
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [eventLoginCBTarget, setEventLoginCBTarget] = useState('');
        
    const handleAddToCart = (schoolId, isAdmissionOpen) => {
        if (!isLoggedIn()) {
            setShowLoginDialog(true)
            setEventLoginCBTarget("AddToCart")
            return;
        } else if (!isAdmissionOpen) {
            setAlertMessage(PageContent.ADMISSION_CLOSED_ERROR_MSG)
            setShowAlertDialog(true);
            return;
        }
        setSelectedSchoolToApply(schoolId);
        setShowApplyToSchoolDialog(true);
    }

    const handleAddToCartDialogClose = () => {
        setShowApplyToSchoolDialog(false);
    }

    const handleViewDetails = (schoolId, schoolName) => {
        // if (!isLoggedIn()){
        //     setShowLoginDialog(true)
        //     setEventLoginCBTarget("ViewDetails")
        //     return
        // }
        viewSchoolDetails(schoolId, schoolName)
    }

    function viewSchoolDetails(schoolId, schoolName) {
        navigate("/schools/"+schoolName+"?id="+btoa(`#${schoolId}`));
    }

    const handleAlertDialogClose = () => {
        setShowAlertDialog(false);
    }

    const handleCloseLoginDialog = () => {
        setShowLoginDialog(false)
    }

    return (
        <>
      <Card
        className={`school-card ${
          school?.partner ? "admission-partner-tag" : ""
        }`}
        style={{ cursor: "pointer" }}
        onClick={(e) => handleViewDetails(school.schoolId, school.schoolName)}
      >
                <SchoolCardHeader school={school} distanceFilter={props.distanceFilter}/>
                <ListGroup className="info-list-group">
                    <ListGroup.Item>
                        <div className='left'>Avg. Monthly Tuition Fees</div>
                        {
                            (school.monthlyFeeMin && school.monthlyFeeMax) ? 
                                <div className='right fee-wrap'><span className='fee-to'>₹{school.monthlyFeeMin}</span> to <span className='fee-from'>₹{school.monthlyFeeMax}</span></div>
                             :<span className="right seats">NA</span> 
                        }
                       </ListGroup.Item>
                    <ListGroup.Item>
                        <div className='left'>Classes</div>
                        <div className='right'>{school.classesFromUpto}</div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <div className='left'>Admission Status</div>
                        <div className='right'> {!isEmpty(school.admissionInfo)?"Admission Open":"Admission Closed"} </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <div className='left'>Sessions</div>
                        <div className='right session-wrap'>
                        {
                              !isEmpty(school.admissionInfo)  ? (school.admissionInfo.map( ( admissionRow ,index)=>
                              { return (
                                     <div className="session-info-outer" key={`adminssionInfo${index}`}>
                                        <span className='session-title'>{admissionRow.admissionSession}  </span>
                                     </div>
                              )
                              } ) )  : <span className="right seats">NA</span>
                        }                           
                        </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <div className='left'>Seats Available</div>
                         <div className='right seats session-wrap'>
                        {
                              !isEmpty(school.admissionInfo)  ? (school.admissionInfo.map( ( admissionRow ,index)=>
                              { return (
                                  <div className="session-info-outer" key={`schoolAdmissionInfo${index}`}>
                                        <span className='session-title'>{admissionRow.admissionSession}: {admissionRow.seatsAvailable} Approx</span>
                                        <InfoDropDown header={admissionRow.admissionStatus + " for " +admissionRow.admissionSession} options={admissionRow.admissionOpenForClasses.split(",")}/>
                                     </div>
                              )
                              } ) )  : 'NA'
                        }                           
                        </div>
                    </ListGroup.Item>
                </ListGroup>
                <Card.Body className='button-wrap'>
                    <Card.Link onClick={(e)=>{handleViewDetails(school.schoolId, school.schoolName);e.stopPropagation()}} className='view'>View Details</Card.Link>
                {school?.partner &&
                    <Card.Link className="add" onClick={(e)=> {handleAddToCart(school.schoolId, school.admissionInfo ? true :false);e.stopPropagation()}}>Add to Apply</Card.Link>
                }
                </Card.Body>
                <Col className='salient-features'>
                  <Row className='partner-wrap'>
                         {/* { school?.partner && <div className="partner-inner"><div className='partner-item icon'><ApplicationPartner/></div>
                        <div className='partner-item lbl'><label>Application Partner</label></div></div> }*/}
                    </Row> 
                    <ListGroup className="feature-list-group allfeatures-wrap">
                    {
                        school.facilities.map((item, index) => {
                            let fIcon = PageContent.FACILITY_ICON_MAP.hasOwnProperty(item.facilityName) ? PageContent.FACILITY_ICON_MAP[item.facilityName] : null;
                            if (index < 4) {
                                return (
                                    <ListGroup.Item key={item.facilityMasterId}><i title={item.facilityName} className={'icons ' + (fIcon !== null ? fIcon : 'boarding-icon')}></i></ListGroup.Item>
                                )
                            }
                        })
                    }
                        <ListGroup className="info-list-group additional-features">
                            <ListGroup.Item>
                                {
                                    school.facilities.length > 4 ?
                                    <>
                                    <span className='session-title'></span>
                                    <InfoDropDown icon={school.facilities.length - 4}
                                        options={school.facilities.filter((it,index) => {return index>3}).map((it) => (it.facilityName))} />
                                    </>
                                    : ''
                                }
                                
                            </ListGroup.Item>
                        </ListGroup>
                    </ListGroup>
                </Col>
            </Card>
            <ApplyToSchoolDialog show={showApplyToSchoolDialog} schoolId={selectedSchoolToApply} handleClose={handleAddToCartDialogClose}/>
            <AlertDialog show={showAlertDialog} message={alertMessage} handleClose={handleAlertDialogClose}/>
            <LoginDialog show={showLoginDialog}
                handleClose={handleCloseLoginDialog}
                loginCallbackFunction={() => {
                        (eventLoginCBTarget === 'AddToCart'
                            ? handleAddToCart(school.schoolId, school.admissionInfo ? true : false)
                            : viewSchoolDetails(school.schoolId, school.schoolName))
                    }
                }
            />
        </>
    );
};

export default SchoolCard;