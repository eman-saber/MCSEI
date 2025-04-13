// import { useState, useEffect } from "react";
// import '../Citizen/ViewAllCitizen.css'; 

// const ViewAllMedical = () => {
//   const [medicalRecords, setMedicalRecords] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("https://medical-website-production-1dc4.up.railway.app/medical-record", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("API Response:", data);

//         if (data.medicalRecords && Array.isArray(data.medicalRecords)) {
//           setMedicalRecords(data.medicalRecords); 
//         } else {
//           setMedicalRecords([]);
//         }

//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching medical data:", error);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className="container mt-2">
//       <h2 className="text-center text-primary mb-4 fw-bold">All Medical Records</h2>

//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : medicalRecords.length === 0 ? (
//         <p className="text-center">No medical data available</p>
//       ) : (
//         medicalRecords.map((record, index) => (
//           <div key={index} className="card mb-4 shadow-sm">
//             <div className="card-header  text-white">
//               <h5 className="mb-0">Medical Record {index + 1}</h5>
//             </div>
//             <div className="card-body">
//               <div className="row justify-content-center">
//                 <div className="col-md-10">
//                   <table className="table table-striped table-bordered table-hover text-center">
//                     <thead className="table-primary">
//                       <tr>
//                         <th>National ID</th>
//                         <th>Diagnosis</th>
//                         <th>Treatment</th>
//                         <th>Clinic Name</th>
//                         <th>Clinic Code</th>
//                         <th>Record Date</th>
                        
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td>{record.national_ID || ""}</td>
//                         <td>{record.diagnosis || ""}</td>
//                         <td>{record.treatment || ""}</td>
//                         <td>{record.clinic_name || ""}</td>
//                         <td>{record.clinic_code || ""}</td>
//                         <td>{record.recode_date ? record.recode_date.split("T")[0] : ""}</td>

                      
                       
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default ViewAllMedical;
