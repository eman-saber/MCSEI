// import { useState, useEffect } from "react";
// import '../Citizen/ViewAllCitizen.css';

// const ViewAllRadiology = () => {
//   const [radiologyRecords, setRadiologyRecords] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("https://medical-website-production-1dc4.up.railway.app/radiology", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("API Response:", data);

//         if (data.data && Array.isArray(data.data)) {
//           setRadiologyRecords(data.data); 
//         } else {
//           setRadiologyRecords([]);
//         }

//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching radiology data:", error);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className="container mt-2">
//       <h2 className="text-center text-primary mb-4 fw-bold">All Radiology Records</h2>

//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : radiologyRecords.length === 0 ? (
//         <p className="text-center">No radiology data available</p>
//       ) : (
//         radiologyRecords.map((record, index) => (
//           <div key={index} className="card mb-4 shadow-sm">
//             <div className="card-header text-white">
//               <h5 className="mb-0">Radiology Record {index + 1}</h5>
//             </div>
//             <div className="card-body">
//               <div className="row justify-content-center">
//                 <div className="col-md-10">
//                   <table className="table table-striped table-bordered table-hover text-center">
//                     <thead className="table-primary">
//                       <tr>
//                         <th>National ID</th>
//                         <th>Radiology Type</th>
//                         <th>Radiologist Notes</th>
//                         <th>Radiology Date</th>
//                         <th>Images</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td>{record.national_ID || ""}</td>
//                         <td>{record.radiology_type || ""}</td>
//                         <td>{record.radiologistNotes || ""}</td>
//                         <td>{record.radiology_date ? new Date(record.radiology_date).toISOString().split("T")[0] : ""}</td>

//                         <td>
//                           {record.images && record.images.length > 0 ? (
//                             <a href={record.images[0].secure_url} target="_blank" rel="noopener noreferrer">
//                               View Image
//                             </a>
//                           ) : (
//                             "No Image"
//                           )}
//                         </td>
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

// export default ViewAllRadiology;
