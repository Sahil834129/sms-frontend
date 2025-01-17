import { Form, Formik } from "formik";
import MultiRangeSlider from "multi-range-slider-react";
import React, { useEffect, useState } from "react";
import Accordion from 'react-bootstrap/Accordion';
import Row from "react-bootstrap/Row";
import { MultiSelect } from "react-multi-select-component";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../components/form/Button";
import InputField from "../components/form/InputField";
import { getSchoolClasses } from "../redux/actions/masterData";
import { setSchoolFilter } from "../redux/actions/userAction";
import RestEndPoint from "../redux/constants/RestEndpoints";
import { checkIfCityExists, checkSelectedCityWithUserCity, getLocalData, isLoggedIn } from "../utils/helper";
import RESTClient from "../utils/RestClient";

const SidebarFilter = ({ filterFormData, applyFilters }) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("");
  const cities = getLocalData("cities");
  const classOptions = useSelector(
    (state) => state?.masterData?.schoolClasses || []
  );
  const distanceOptions = [
    { text: "--Select Distance--" },
    { value: 2, text: "2km" },
    { value: 5, text: "5km" },
    { value: 10, text: "10km" },
    { value: 15, text: "15km" },
    { value: 20, text: "20km" },
    { value: 25, text: "25km" },
  ];

  const [boardOptions, setBoardOptions] = useState([
    { value: "", text: "Select Board" },
  ]);
  const [genderOptions, setGenderOptions] = useState([
    { value: "", text: "Select Gender" },
  ]);
  const [mediumOfInstructionsOtions, setMediumOfInstructionsOtions] = useState([
    { value: "", text: "Select Medium" },
  ]);
  const [facilitiesOptions, setFacilitiesOptions] = useState([]);
  const [extracurricularOptions, setExtracurricularOptions] = useState([]);
  const [admissionStatusOptions, setAdmissionStatusOptions] = useState([
    { value: "", text: "All" },
    { value: "open", text: "Open" },
    { value: "closed", text: "Closed" },
  ]);
  const [minMonthlyTutionFee, setMinMonthlyTutionFee] = React.useState(0);
  const [maxMonthlyTutionFee, setMaxMonthlyTutionFee] = React.useState(20000);
  const [facilities, setFacilities] = useState([]);
  const [extracurriculars, setExtracurriculars] = useState([]);
  const [initialFilterValues, setInitialFilterValues] = useState({
    distance: "",
    class: "",
    board: "",
    gender: "",
    medium: "",
    status: "",
  });

  useEffect(() => {
    populateSchoolBoardsList();
  }, []);
  useEffect(() => {
    populateMediumOfInstructionsList();
  }, []);
  useEffect(() => {
    populateGenderOptions();
  }, []);
  useEffect(() => {
    populateFacilities();
  }, []);
  useEffect(() => {
    popularExtraCurricularActivities();
  }, []);

  useEffect(() => {
    if (classOptions.length === 0) {
      dispatch(getSchoolClasses());
    }
  }, []);

  useEffect(() => {
    if (Object.keys(filterFormData).length > 0) {
      if (filterFormData.facilities)
        setFacilities([...filterFormData.facilities]);
      if (filterFormData.extracurriculars)
        setExtracurriculars([...filterFormData.extracurriculars]);
      if (filterFormData.minMonthlyTutionFee)
        setMinMonthlyTutionFee(filterFormData?.minMonthlyTutionFee);
      if (filterFormData.maxMonthlyTutionFee)
        setMaxMonthlyTutionFee(filterFormData?.maxMonthlyTutionFee);
    }
  }, []);

  const applyFilter = (values) => {
    const filterValues = getFilterValues(values);
    if(isNaN(filterValues.distance)) {
      filterValues.distance="";
    }
    dispatch(setSchoolFilter(filterValues));
    applyFilters(filterValues);
  };

  function getFilterValues(formValues) {
    return {
      ...formValues,
      facilities: facilities,
      extracurriculars: extracurriculars,
      minMonthlyTutionFee: minMonthlyTutionFee,
      maxMonthlyTutionFee: maxMonthlyTutionFee,
    };
  }

  const populateMediumOfInstructionsList = async () => {
    try {
      const response = await RESTClient.get(
        RestEndPoint.GET_MEDIUM_OF_INSTRUCTIONS
      );
      setMediumOfInstructionsOtions(
        [{ value: "", text: "Select Medium" }].concat(
          response.data.schoolMediumOfInstructions.map((it) => ({
            value: it,
            text: it,
          }))
        )
      );
    } catch (e) {
      console.log("Error while getting medium of instructions list" + e);
    }
  };

  const populateSchoolBoardsList = async () => {
    try {
      const response = await RESTClient.get(RestEndPoint.GET_SCHOOL_BOARDS);
      setBoardOptions(
        [{ value: "", text: "Select Board" }].concat(
          response.data.schoolBoards.map((it) => ({ value: it, text: it }))
        )
      );
    } catch (e) {
      console.log("Error while getting board list" + e);
    }
  };

  const populateGenderOptions = async () => {
    try {
      const response = await RESTClient.get(RestEndPoint.GET_SCHOOL_GENDER);
      setGenderOptions(
        [{ value: "", text: "Select Gender" }].concat(
          response.data.schoolGenders.map((it) => ({ value: it, text: it }))
        )
      );
    } catch (e) {
      console.log("Error while getting gender list" + e);
    }
  };

  const populateFacilities = async () => {
    try {
      const response = await RESTClient.get(RestEndPoint.GET_SCHOOL_FACILITIES);
      setFacilitiesOptions(
        response.data.schoolFacilities.map((it) => ({
          value: it.facilityName,
          label: it.facilityName,
        }))
      );
    } catch (e) {
      console.log("Error while getting school facilities" + e);
    }
  };

  const popularExtraCurricularActivities = async () => {
    try {
      const response = await RESTClient.get(
        RestEndPoint.GET_SCHOOL_EXTRA_CURRICULAR_ACTIVITIES
      );
      setExtracurricularOptions(
        response.data.extracurriculars.map((it) => ({
          value: it.activity,
          label: it.activity,
        }))
      );
    } catch (e) {
      console.log("Error while getting extracurriculars list" + e);
    }
  };

  function handleResetForm(resetForm) {
    resetForm();
    setMinMonthlyTutionFee(0);
    setMaxMonthlyTutionFee(20000);
    setFacilities([]);
    setExtracurriculars([]);
    dispatch(setSchoolFilter({}));
    applyFilters({});
  }

  return (
    <Row className="filter-panel">
      <Accordion className="filter-collapsible-panel" defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <i className="icons filter-icon"></i> <label className="txt-lbl">Filters</label>
          </Accordion.Header>
          <Accordion.Body className="filter-collapse-body">
            <Formik
            initialValues={
              Object.keys(filterFormData).length > 0
                ? filterFormData
                : initialFilterValues
            }
            enableReinitialize
            onSubmit={(values) => {
              applyFilter(values);
            }}
          >
            {({ errors, resetForm, touched, values }) => (
              <Form className="filter-components">
                <div className="filter-head">
                  {/* <h2>
                    <i className="icons filter-icon"></i> Filters
                  </h2> */}
                  <Link onClick={() => handleResetForm(resetForm)}>Reset</Link>
                </div>
                <div className="filter-row">
                  <div className="filter-item">
                    <InputField
                      fieldName="status"
                      fieldType="select"
                      placeholder=""
                      value={values.status}
                      label="Admission Status"
                      selectOptions={admissionStatusOptions}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="filter-item">
                    { isLoggedIn()  && checkIfCityExists(cities) && checkSelectedCityWithUserCity() && <InputField
                      fieldName="distance"
                      fieldType="select"
                      placeholder=""
                      value={values.distance}
                      label="Distance from Home"
                      selectOptions={distanceOptions}
                      errors={errors}
                      touched={touched}
                    />}
                  </div>
                  <div className="filter-item">
                    <InputField
                      fieldName="class"
                      fieldType="select"
                      placeholder=""
                      value={values.class}
                      label="Class"
                      selectOptions={classOptions}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="filter-item">
                    <label>Monthly Tuition Fees</label>
                    <div className="range-slider-wrapper">
                      <MultiRangeSlider
                        min={0}
                        max={20000}
                        step={500}
                        minValue={minMonthlyTutionFee}
                        maxValue={maxMonthlyTutionFee}
                        ruler="false"
                        label="false"
                        onInput={(e) => {
                          setMinMonthlyTutionFee(e.minValue);
                          setMaxMonthlyTutionFee(e.maxValue);
                        }}
                      />
                    </div>
                  </div>
                  <div className="filter-item">
                    <InputField
                      fieldName="board"
                      fieldType="select"
                      placeholder=""
                      value={values.board}
                      label="School Board"
                      selectOptions={boardOptions}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="filter-item">
                    <InputField
                      fieldName="gender"
                      fieldType="select"
                      value={values.gender}
                      placeholder=""
                      label="Gender"
                      selectOptions={genderOptions}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="filter-item">
                    <InputField
                      fieldName="medium"
                      fieldType="select"
                      value={values.medium}
                      placeholder=""
                      label="Medium of Instruction"
                      selectOptions={mediumOfInstructionsOtions}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="filter-item multiselect-fld">
                    <label>Facilities</label>
                    <MultiSelect
                      options={facilitiesOptions}
                      value={facilities}
                      onChange={setFacilities}
                      labelledBy="Facilities"
                    ></MultiSelect>
                  </div>
                  <div className="filter-item multiselect-fld">
                    <label>Extracurriculars</label>
                    <MultiSelect
                      options={extracurricularOptions}
                      value={extracurriculars}
                      onChange={setExtracurriculars}
                      labelledBy="Extracurriculars"
                    ></MultiSelect>
                  </div>
                </div>
                <div className="filter-item btn-wrap">
                  <Button buttonLabel="Apply" class="applyFilter" />
                </div>
              </Form>
            )}
          </Formik>
          
        </Accordion.Body>
      </Accordion.Item>
      
    </Accordion>
      {/* <div class="wrap-collabsible">
        <input id="collapsible" class="toggle" type="checkbox" />
        <label for="collapsible" class="lbl-toggle">
          <i className="icons filter-icon"></i> Filters  
        </label>
        <div class="collapsible-content">
          <div class="content-inner">
          
          </div>
        </div>
      </div> */}
      
    </Row>
  );
};

export default SidebarFilter;
