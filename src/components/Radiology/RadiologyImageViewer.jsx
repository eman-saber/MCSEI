// // src/pages/RadiologyImageViewer.jsx
// import React, { useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import * as cornerstone from "cornerstone-core";
// import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
// import * as dicomParser from "dicom-parser";

// // تهيئة Cornerstone
// cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
// cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
// cornerstone.registerImageLoader("wadouri", cornerstoneWADOImageLoader.wadouri.loadImage);

// cornerstoneWADOImageLoader.webWorkerManager.initialize({
//   webWorkerPath: "https://unpkg.com/cornerstone-wado-image-loader@4.0.1/dist/cornerstoneWADOImageLoaderWebWorker.js",
//   taskConfiguration: {
//     decodeTask: {
//       codecsPath: "https://unpkg.com/cornerstone-wado-image-loader@4.0.1/dist/cornerstoneWADOImageLoaderCodecs.js",
//     },
//   },
// });

// const RadiologyImageViewer = () => {
//   const dicomRef = useRef(null);
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const imageUrl = queryParams.get("image");

//   useEffect(() => {
//     if (!imageUrl) return;

//     const isDicom = imageUrl.toLowerCase().endsWith(".dcm");

//     if (isDicom && dicomRef.current) {
//       cornerstone.enable(dicomRef.current);
//       cornerstone
//         .loadImage(`wadouri:${imageUrl}`)
//         .then((image) => {
//           cornerstone.displayImage(dicomRef.current, image);
//         })
//         .catch((error) => {
//           console.error("Error loading DICOM image:", error);
//         });
//     }
//   }, [imageUrl]);

//   const isDicom = imageUrl && imageUrl.toLowerCase().endsWith(".dcm");

//   return (
//     <div className="container mt-4 text-center">
//       <h2 className="mb-3">Radiology Image Viewer</h2>
//       {imageUrl ? (
//         isDicom ? (
//           <div
//             ref={dicomRef}
//             style={{
//               width: "100%",
//               height: "512px",
//               backgroundColor: "black",
//               margin: "auto",
//               borderRadius: "10px",
//             }}
//           ></div>
//         ) : (
//           <img
//             src={imageUrl}
//             alt="Radiology"
//             style={{ maxWidth: "100%", height: "auto", borderRadius: "10px" }}
//           />
//         )
//       ) : (
//         <p>No image provided.</p>
//       )}

//       <div className="mt-3">
//         <p>
//           🔗 <strong>Image Link:</strong> <br />
//           <a href={imageUrl} target="_blank" rel="noopener noreferrer">
//             {imageUrl}
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RadiologyImageViewer;
