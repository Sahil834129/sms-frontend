import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import MultiRangeSlider from "multi-range-slider-react";
import { useState, useEffect } from 'react';
import { getSchoolAdmissionGradeList, applicationfilterData } from '../../../utils/services';
import { OPERATORS } from '../../../constants/app';

export const FilterApp = ({ schoolClassesData, classId, setClassId, setRowsData }) => {
  const intialValue ={
    grade:'',
    gradeOption: null,
    checkValue: 1,
    minAge:0,
    maxAge:30,
    minIncome:0,
    maxIncome:2000000,
    minMarks:0,
    maxMarks:100,
    minGpa: 0,
    maxGpa: 10,
    transport:'',
    boarding:''
  }
  const [grade, setGrade] = useState(intialValue.grade);
  const [gradeOption, setGradeOption] = useState(intialValue.gradeOption)
  const [checkValue, setCheckValue] = useState(intialValue.checkValue);
  const [minAge, setMinAge] = useState(intialValue.minAge);
  const [maxAge, setMaxAge] = useState(intialValue.maxAge);
  const [minIncome, setMinIncome] = useState(intialValue.minIncome);
  const [maxIncome, setMaxIncome] = useState(intialValue.maxIncome);
  const [minMarks, setMinMarks] = useState(intialValue.minMarks);
  const [maxMarks, setMaxMarks] = useState(intialValue.maxMarks);
  const [maxGpa, setMaxGpa] = useState(intialValue.maxGpa);
  const [minGpa, setMinGpa] = useState(intialValue.minGpa);
  const [transport, setTransport] = useState(intialValue.transport);
  const [boarding, setBoarding] = useState(intialValue.boarding);

  const ClearForm = () => {
    setClassId(1);
    setMinAge(intialValue.minAge);
    setMaxAge(intialValue.maxAge);
    setMinIncome(intialValue.minIncome);
    setMaxIncome(intialValue.maxIncome);
    setMinMarks(intialValue.minMarks);
    setMaxMarks(intialValue.maxMarks);
    setMinGpa(intialValue.minGpa);
    setMaxGpa(intialValue.maxGpa);
    setGrade(intialValue.grade);
    setCheckValue(intialValue.checkValue);
    setTransport(intialValue.transport);
    setBoarding(intialValue.boarding);
  };

  const HandleApply = (checkValue) => {
    const filterPyaload = {};
    const filter = [];
    if (classId !== null && classId !== '') {
      filter.push({
        field: 'classId',
        operator: OPERATORS.IN,
        values: [classId]
      });
    }
    if (minAge !== null && minAge !== '' && maxAge !== null && maxAge !== '') {
      filter.push({
        field: 'Age',
        operator: OPERATORS.BETWEEN,
        values: [minAge, maxAge]
      });
    }
    if (minIncome !== null && minIncome !== '' && maxIncome !== null && maxIncome !== '') {
      filter.push({
        field: 'annualFamilyIncome',
        operator: OPERATORS.BETWEEN,
        values: [minIncome, maxIncome]
      });
    }
    if (minMarks !== null && minMarks !== '' && maxMarks !== null && maxMarks !== '') {
      filter.push({
        field: 'PERCENTAGE',
        operator: OPERATORS.BETWEEN,
        values: [minMarks, maxMarks]
      });
    }
    if (minGpa !== null && minGpa !== '' && maxGpa !== null && maxGpa !== '') {
      filter.push({
        field: 'SGPA',
        operator: OPERATORS.BETWEEN,
        values: [minGpa, maxGpa]
      });
    }
    if (grade !== null && grade !== '') {
      filter.push({
        field: 'GRADE',
        operator: OPERATORS.IN,
        values: [grade]
      });
    }
    if (transport !== null && transport !== '') {
      filter.push({
        field: 'transportFacility',
        operator: OPERATORS.EQUALS,
        value: transport
      });
    }
    if (boarding !== null && boarding !== '') {
      filter.push({
        field: 'boardingFacility',
        operator: OPERATORS.EQUALS,
        value: boarding
      });
    }

    filterPyaload['filters'] = filter;
    applicationfilterData(filterPyaload)
      .then(response => {
        setRowsData(response?.data);
      })
      .error(error => console.log(error));
  };

  const fetchSchoolAdmissionGradeList =() =>{
    getSchoolAdmissionGradeList()
    .then(response => {
      if (response.status === 200) {
        setGradeOption(response.data)
      }
    })
    .catch(error => console.log(error));
  }
  
  useEffect(()=>{
    fetchSchoolAdmissionGradeList()
  },[])

  return (
    <div className='filterpanel'>
      <div className='filter-head'>
        <span className='filter-title'>
          <i className='icons filter-icon'></i>
          <label>Filters</label>
        </span>
        <Link href='' onClick={ClearForm}>Clear All</Link>
      </div>
      <div className='filter-form-area'>
        <Form.Group className='form-element-group' controlId=''>
          <Form.Label className='form-label'>Select Class</Form.Label>
          <Form.Select
            value={classId}
            onChange={(e) => {
              setClassId(e.target.value);
            }}>
            {schoolClassesData.map((val, index) => (
              <option value={val.classId} key={`class${index}`} >
                {val.className}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className='form-element-group' controlId=''>
          <Form.Label className='form-label'>Age</Form.Label>
          <div className='range-slider-wrapper'>
            <MultiRangeSlider className='age-slider'
              min={0}
              max={30}
              step={1}
              minValue={minAge}
              maxValue={maxAge}
              ruler='false'
              label='false'
              onInput={(e) => {
                setMinAge(e.minValue);
                setMaxAge(e.maxValue);
              }}
            />
          </div>
          <label className="age-range-value">({minAge + '-' + maxAge}) Years</label>
        </Form.Group>
        <Form.Group className='form-element-group' controlId=''>
          <Form.Label className='form-label'>Family Income</Form.Label>
          <div className='inner-container'>
            <div className='range-slider-wrapper'>
              <MultiRangeSlider className='income-slider'
                min={0}
                max={2000000}
                step={500}
                minValue={minIncome}
                maxValue={maxIncome}
                ruler='false'
                label='false'
                onInput={(e) => {
                  setMinIncome(e.minValue);
                  setMaxIncome(e.maxValue);
                }}
              />
            </div>
            <div className='input-val-wrapper'>
              <div className='value-cell'>
                <Form.Label className=''>Min</Form.Label>
                <Form.Control type='text' placeholder='0' value={minIncome} readOnly />
              </div>
              <div className='value-cell'>
                <Form.Label className=''>Max</Form.Label>
                <Form.Control type='text' placeholder='20L' value={maxIncome} readOnly />
              </div>
            </div>
          </div>
        </Form.Group>
        <Form.Group className='form-element-group' controlId=''>
          <Form.Label className='form-label'>Marks/Grades/GPA</Form.Label>
          <div className='inner-container'>
            <div className='options-wrap'>
              <Form.Check
                type='checkbox'
                label='Marks'
                onChange={() => setCheckValue(1)}
                checked={checkValue === 1}
              />
              <Form.Check
                type='checkbox'
                onChange={() => setCheckValue(2)}
                label='GPA'
                checked={checkValue === 2}
              />
              <Form.Check
                type='checkbox'
                onChange={() => setCheckValue(3)}
                label='Grade'
                checked={checkValue === 3}
              />
            </div>
            {(checkValue === 1) && <div>
              <div className='slider-block'>
                <Form.Label className='form-label'>Add Marks</Form.Label>
              </div>
              <div className='inner-container'>
                <div className='range-slider-wrapper'>
                  <MultiRangeSlider className='marks-slider'
                    min={0}
                    max={100}
                    step={1}
                    minValue={minMarks}
                    maxValue={maxMarks}
                    ruler='false'
                    label='false'
                    onInput={(e) => {
                      setMinMarks(e.minValue);
                      setMaxMarks(e.maxValue);
                    }}
                  />
                </div>
                <div className='input-val-wrapper'>
                  <div className='value-cell'>
                    <Form.Label className=''>Min</Form.Label>
                    <Form.Control type='text' value={minMarks} readOnly />
                  </div>
                  <div className='value-cell'>
                    <Form.Label className=''>Max</Form.Label>
                    <Form.Control type='text' value={maxMarks} readOnly />
                  </div>
                </div>
              </div>
            </div>}
            {(checkValue === 2) && <div>
              <div className='slider-block'>
                <Form.Label className='form-label'>GPA</Form.Label>
              </div>
              <div className='inner-container'>
                <div className='range-slider-wrapper'>
                  <MultiRangeSlider className='marks-gpa-slider'
                    min={0}
                    max={10}
                    step={1}
                    minValue={minGpa}
                    maxValue={maxGpa}
                    ruler='false'
                    label='false'
                    onInput={(e) => {
                      setMinGpa(e.minValue);
                      setMaxGpa(e.maxValue);
                    }}
                  />
                </div>
                <div className='input-val-wrapper'>
                  <div className='value-cell'>
                    <Form.Label className=''>Min GPA</Form.Label>
                    <Form.Control type='text' value={minGpa} readOnly />
                  </div>
                  <div className='value-cell'>
                    <Form.Label className=''>Max GPA</Form.Label>
                    <Form.Control type='text' value={maxGpa} readOnly />
                  </div>
                </div>
              </div>
            </div>}
            {(checkValue === 3) && <div>
              <div className='slider-block'>
                <Form.Label className='form-label'>GRADES</Form.Label>
              </div>
              <div>
                <Form.Select
                  value={grade}
                  onChange={(e) => {
                    setGrade(e.target.value);
                  }}
                >
                  <option value=""> Select</option>
                  {gradeOption.map((val) => (
                    <option value={val} >
                      {val}
                    </option>
                  ))}
                </Form.Select>
              </div>
            </div>}
          </div>
        </Form.Group>
        <Form.Group className='form-element-group' controlId=''>
          <div className='inner-container option-filter'>
            <Form.Label className='form-label'>Transport</Form.Label>
            <div className='radio-choice' >
              <input type='radio' name='transport' value={transport} checked={transport === 'true'} onChange={() => setTransport('true')} /> YES
              <input type='radio' name='transport' value={transport} checked={transport === 'false'} onChange={() => setTransport('false')} /> NO
              {/* <Form.Check type='radio' label='Yes' />
                    <Form.Check type='radio' label='No' /> */}
            </div>
          </div>
        </Form.Group>
        <Form.Group className='form-element-group' controlId=''>
          <div className='inner-container option-filter'>
            <Form.Label className='form-label'>Boarding</Form.Label>
            <div className='radio-choice'>
              <input type='radio' name='boarding' value={boarding} checked={boarding === 'true'} onChange={() => setBoarding('true')} /> YES
              <input type='radio' name='boarding' value={boarding} checked={boarding === 'false'} onChange={() => setBoarding('false')} /> NO
              {/* <Form.Check type='radio' label='Yes' />
                    <Form.Check type='radio' label='No' /> */}
            </div>
          </div>
        </Form.Group>
        <Form.Group>
          <div >
            <button onClick={HandleApply} style={{
              backgroundColor: '#41285F',
              color: 'white',
              width: '100%',
              borderRadius: '4px',
              padding: '12px',
              fontWeight: '700',
              fontSize: '14px'
            }}>
              Apply Filter
            </button>
          </div>
        </Form.Group>
      </div>
    </div>
  );
};

export default FilterApp;