import { useState } from 'react'
import { useLocation } from 'react-router-dom';


function ContactDetails() {
    const location = useLocation();
    const detailsData = location.state;
    console.log("detailsData---->",detailsData)
  return (
    <>
      <div>
      <h2>Form Information</h2>
      <table>
        <tbody>
          {detailsData ? Object.entries(detailsData).map(([key, value]) => (
            <tr key={key}>
              <td>{key.replace('_', ' ').toUpperCase()}</td>
              <td>{value}</td>
            </tr>
          )) : 'Please fill the form'}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default ContactDetails
