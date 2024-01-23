import { useState, useEffect,useRef } from 'react'
import { submitFormData, getData} from '../utils/apiHelper';
import { useNavigate } from 'react-router-dom';
function ContactUsForm() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate()
  

  const stateDropdownRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const ageRef = useRef(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    state: '',
    city: '',
    gender: '',
    dob: '',
    age: ''
  });
  useEffect(()=>{
    getData("http://localhost:3000/countries").then((data)=>{
      setCountries(data)
    });
  },[])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationRules = {
      first_name: {
        message: 'Please enter a valid First Name (alphabets only)',
        validate: (value) => /^[A-Za-z]+$/.test(value),
        required: true,
      },
      last_name: {
        message: 'Please enter a valid Last Name (alphabets only)',
        validate: (value) => /^[A-Za-z]+$/.test(value),
        required: true,
      },
      email: {
        message: 'Please enter a valid Email address',
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        required: true,
      },
      country: {
        message: 'Please select a Country',
        validate: (value) => value !== 'Select Country',
        required: true,
      },
      state: {
        message: 'Please select a State',
        validate: (value) => value !== 'Select State',
        required: true,
      },
      city: {
        message: 'Please select a City',
        validate: (value) => value !== 'Select City',
        required: true,
      },
      gender: {
        message: 'Please select a Gender',
        validate: (value) => value === 'male' || value === 'female',
        required: true,
      },
      dob: {
        message: 'Please enter a valid Date of Birth min 14, max 99',
        validate: (value) => {
          const dobDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - dobDate.getFullYear();
          return age >= 14 && age <= 99;
        },
        required: true,
      },
     
    };
    
    const validationErrors = [];

    for (const fieldName in validationRules) {
      const rule = validationRules[fieldName];
      const value = formData[fieldName];
    
      if (rule.required && (!value)) {
        validationErrors.push(`Please fill ${fieldName} required fields.`);
      }
      else if (rule.required && (!rule.validate(value))) {
        validationErrors.push(`${rule.message}`);
      }
    
      if (!rule.required && !rule.validate(value)) {
        validationErrors.push(rule.message);
      }
    }
     
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    submitFormData(formData,"http://localhost:3000/save-contact-us-data")
    .then((data)=>{
      console.log("datatataatat====>",data)
      navigate('/details', { state: data });
    }).catch((error)=>{
      alert("From server:\n" + error.join('\n'))
    });
  };

  const handleCountryChange = (event) => {
    handleChange(event);
    stateDropdownRef.current.disabled = true
    cityDropdownRef.current.disabled = true
    getData(`http://localhost:3000/states/${event.target.value}`).then((data)=>{
      setStates(data?.states)
      stateDropdownRef.current.value = ''
      stateDropdownRef.current.disabled = false
    });
  };

  const handleStateChange = (event) => {
    handleChange(event);
    cityDropdownRef.current.disabled = true
    getData(`http://localhost:3000/cities/${event.target.value}`).then((data)=>{
      setCities(data?.cities)
      cityDropdownRef.current.value = ''
      cityDropdownRef.current.disabled = false
    });
  };
  const handleDOBChange = (event) => {
    handleChange(event);
    const dob = new Date(event.target.value);
    const today = new Date();
    
    let age = today.getFullYear() - dob.getFullYear();
  

    const months = today.getMonth() - dob.getMonth();
    age += months / 12;
  
    if (
      today.getDate() < dob.getDate()
    ) {
      age -= 1 / 12;
    }
    ageRef.current.value = age.toFixed(1);

    setFormData((prevFormData) => ({ ...prevFormData, ['age']: ageRef.current.value }));

  };

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
  return (
    <div className="ContactUsForm">
      <form onSubmit={handleSubmit}>

        <div>
          <label>First Name</label>
          <input name="first_name" onChange={handleChange}/>
        </div>
        <div>
          <label>Last Name</label>
          <input name="last_name" onChange={handleChange}/>
        </div>
        <div>
          <label>Email</label>
          <input name="email" onChange={handleChange}/>
        </div>
        <div>
          <label>Country</label>
          <select name="country" onChange={handleCountryChange}>
              <option>Select Country</option>
              {
                countries && countries.map((country)=> <option key={country?._id} value={country?._id}>{country?.name}</option>)
              }
          </select>
        </div>
        <div>
          <label>State</label>
          <select name="state"  onChange={handleStateChange} ref={stateDropdownRef} disabled>
            <option>Select State</option>

              {
                states && states.map((state)=> <option key={state?._id} value={state?._id}>{state?.name}</option>)
              }
          </select>
        </div>
        <div>
          <label>City</label>
          <select name="city" ref={cityDropdownRef} disabled onChange={handleChange}>
            <option>Select City</option>
              {
                cities && cities.map((city)=> <option key={city?._id} value={city?._id}>{city?.name}</option>)
              }
          </select>
        </div>
        <div className="gender-container">
          <label>Gender</label>
          <div className="gender-options">
            <label>Male</label>
            <input type="radio" name="gender" value="male" onChange={handleChange}/>
            <label>Female</label>
            <input type="radio" name="gender" value="female" onChange={handleChange}/>
          </div>
        </div>
        <div>
          <label htmlFor="dob">Date of Birth</label>
          <input type="date" id="dob" name="dob" required onChange={handleDOBChange}  max={getCurrentDate()}/>
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input type="text" id="age" name="age" disabled ref={ageRef}/>
        </div>
        <div>
          <button type="submit" >Submit</button>
        </div>
      </form>
    </div>
  )
}

export default ContactUsForm;
