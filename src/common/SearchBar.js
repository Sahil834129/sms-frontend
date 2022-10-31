import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import logoHeader from "../assets/img/brand-logo-header.png";
import Container from "react-bootstrap/Container";
import LoggedInUserDropDown from "./LoggedInUserDropDown";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import RESTClient from "../utils/RestClient";
import RestEndPoint from "../redux/constants/RestEndpoints";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedLocation, getSelectedLocation} from "../redux/actions/locationAction";

const SearchBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchItems, setSearchItems] = useState([]);
    const [cities, setCities] = useState([]);
    const selectedLocation = useSelector((state) => state.locationData.selectedLocation);
    
    useEffect(()=>{getSchoolData()},[]);
    useEffect(()=>{getCities()},[]);
    useEffect(()=>{dispatch(getSelectedLocation())}, [dispatch]);

    const getSchoolData = async() => {
        try {
            const response = await RESTClient.post(RestEndPoint.FIND_SCHOOLS, {filters:[]});
            setSearchItems(response.data.map(school => ({name:school.name})));
        } catch(e){};
    }

    const getCities = async() => {
        try {
            const response = await RESTClient.get(RestEndPoint.GET_CITIES);
            setCities(response.data.listOfCity);
        } catch (e) {}
    }

    const handleOnSelect = (item) => {
        navigate("/schools?name="+item.name);
    }

    const handleOnSearch = (item) => {
        if (item === '')
            navigate("/schools");
    }

    const LocationDropDownToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
            &#x25bc;
        </a>
    ));
    
    const LocationDropDownMenu = React.forwardRef(
        ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
            const [value, setValue] = useState('');
            return (
                <div
                    ref={ref}
                    style={style}
                    className={className}
                    aria-labelledby={labeledBy}
                >
                    <Form.Control
                        autoFocus
                        className="mx-3 my-2 w-auto"
                        placeholder="Type to filter..."
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                    />
                    <ul className="list-unstyled">
                        {React.Children.toArray(children).filter(
                            (child) =>
                                !value || child.props.children.toLowerCase().startsWith(value),
                        )}
                    </ul>
                </div>
            );
        },
    );

    function handleSelectCity(location) {
        dispatch(setSelectedLocation(location));
    }

    return (
        <>
        <Col className="navbar-header">
            <Container className="header-container">
                <div className="header-item brand-logo"><img src={logoHeader} alt="brand logo" /></div>
                <div className="header-item search-region-pane">
                    <div className="region-dropdown-wrap">
                        <i className="loc-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" /></svg>
                        </i>
                        <Dropdown>
                            <Dropdown.Toggle as={LocationDropDownToggle} id="dropdown-custom-components">
                                {selectedLocation ? selectedLocation : "Select"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu as={LocationDropDownMenu}>
                                {
                                    cities.map((city, index) => {
                                        return <Dropdown.Item key={"city_"+index} eventKey={"city_e_" + index} onClick={ e => handleSelectCity(city)}>{city}</Dropdown.Item>
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="search-wrapper">
                        <div style={{ width: 500, margin: 20 }}>
                            <ReactSearchAutocomplete
                                items={searchItems}
                                onSelect={handleOnSelect}
                                onSearch={handleOnSearch}
                                styling={{ zIndex: 4 }}
                            />
                        </div>
                    </div>
                    
                </div>
                <LoggedInUserDropDown/>
            </Container>
        </Col>
        
        </>
    );
};
export default SearchBar;