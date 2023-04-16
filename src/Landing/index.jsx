import React from "react";
import './styles.css';
import "react-bootstrap"

function Landing() {
  return(
    <div>
    <h1>Home</h1>
    <div style={{"padding":"50px"}}>

    </div>
    <div className="card container" style={{"alignContent":"center", "textAlign":"center"}}>
      <h1>Smart Campus</h1>
      <p style={{"color":"black","textAlign":"center"}}>Maintenance of campus can be a tedious and, in some ways, an inefficient task with the requirement of a lot of resources. Management and organization of campus with priority to accountability, stability, and user-friendliness with a centralized approach will help the effective/efficient functioning of the campus.
      </p>
      <h2 style={{"color":"black","textAlign":"center"}}>Why Smart Campus?</h2>
      <p style={{"color":"black","textAlign":"center"}}>Smart campuses have the potential to transform the educational system by increasing campus operational efficiency while providing high-quality services to the campus community. It provides students and faculty with an interactive and creative environment. In comparison to traditional and digital campuses, smart campuses have the following advantages.</p>
      <p style={{"color":"black","textAlign":"center"}}><b>1. Saves cost and time. </b><br/>
The installation of IoT-based services on a smart campus aims to enhance data collection to obtain better results. </p>

<p style={{"color":"black","textAlign":"center"}}><b>2. Achieve parking efficiency. </b><br/>
Every working day, many students and employees waste a significant amount of time looking for a parking spot.
This is not only inconvenient and costly, but it may also result in traffic congestion and pollution. Students and staff would benefit from the use of sensing technologies in parking lots and driveways to help them locate the nearest available car parking lot.</p>

<p style={{"color":"black","textAlign":"center"}}><b>3. A smarter way to access common areas. </b><br/>
Smart cards would provide easy access to classrooms and other common rooms and an easier way to track culprits in case public properties are damaged.</p>
      
<p style={{"color":"black","textAlign":"center"}}><b>4. Secure Blockchain transactions. </b><br/>
Smart and secure transactions keeping track of the different entities and transactions.</p>
      

     </div>
  </div>
  );
}
export default Landing;