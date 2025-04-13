// import { useState, useEffect } from "react";
// import '../Citizen/ViewAllCitizen.css';

// const ViewAllCitizen = () => {
//   const [citizens, setCitizens] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("https://medical-website-production-1dc4.up.railway.app/citizens", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("API Response:", data);

//         if (data.citizens && Array.isArray(data.citizens)) {
//           setCitizens(data.citizens);
//         } else {
//           setCitizens([]);
//         }

//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className="container mt-2">
//       <h2 className="text-center text-primary mb-4 fw-bold">All Citizens Data</h2>

//       {loading ? (
//         <p className="text-center">Loading...</p>
//       ) : citizens.length === 0 ? (
//         <p className="text-center">No data available</p>
//       ) : (
//         citizens.map((citizen, index) => (
//           <div key={index} className="card mb-4 shadow-sm">
//             <div className="card-header  text-white">
//               <h5 className="mb-0">Citizen {index + 1}</h5>
//             </div>
//             <div className="card-body">
//               <div className="row justify-content-center">
//                 <div className="col-md-8">
//                   <table className="table table-striped table-bordered table-hover text-center">
//                     <thead className="table-primary">
//                       <tr>
//                         <th>Name</th>
//                         <th>National ID</th>
//                         <th>Blood Type</th>
//                         <th>Address</th>
//                         <th>Birth Date</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td>{citizen.full_name || ""}</td>
//                         <td>{citizen.national_ID || ""}</td>
//                         <td>{citizen.blood_type || ""}</td>
//                         <td>{Array.isArray(citizen.address) ? citizen.address[0] : ""}</td>
//                         <td>{citizen.birth_date ? citizen.birth_date.split("T")[0] : ""}</td>
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

// export default ViewAllCitizen;
