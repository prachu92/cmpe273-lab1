import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import CompanyProfile from './Company/CompanyProfile';
import UpdateCompanyProfile from './Company/UpdateCompanyProfile';
import Delete from './Delete/Delete';
import CompanyEvents from './Events/CompanyEvents';
import CreateEvents from './Events/CreateEvents';
import Events from './Events/Events';
import StudentEvents from './Events/StudentEvents';
import Home from './Home/Home';
import CompanyJobs from './Jobs/CompanyJobs';
import CreateJob from './Jobs/CreateJob';
import StudentJobs from './Jobs/StudentJobs';
import Navbar from './LandingPage/Navbar';
import Login from './Login/Login';
import StudentProfile from './Student/StudentProfile';
import UpdateCareerObjective from './Student/UpdateCareerObjective';
import UpdateEducation from './Student/UpdateEducation';
import UpdateStudentProfile from './Student/UpdateStudentProfile';
import UpdateExperience from './Student/UpdateExperience';
import Jobs from './Jobs/Jobs';



//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/" component={Navbar}/>
                <Route path="/login" component={Login}/>
                <Route path="/home" component={Home}/>
                <Route path="/delete" component={Delete}/>
                
                {/* <Route path="/signup" component={SignUp}/> */}
                <Route path="/studentProfile" component={StudentProfile}/>
                <Route path="/updateProfile" component={UpdateStudentProfile}/>
                <Route path="/updateCareerObj" component={UpdateCareerObjective}/>
                <Route path="/updateEducation" component={UpdateEducation}/>
                <Route path="/updateExperience" component={UpdateExperience}/>
                <Route path="/studentJobs" component={StudentJobs}/>
                <Route path="/jobs" component={Jobs}/>

                <Route path="/companyProfile" component={CompanyProfile}/>
                <Route path="/updateCompanyProfile" component={UpdateCompanyProfile}/>
                <Route path="/companyJobs" component={CompanyJobs}/>
                <Route path="/createJobs" component={CreateJob}/>

                <Route path="/events" component={Events}/>
                <Route path="/studentEvents" component={StudentEvents}/>
                <Route path="/companyEvents" component={CompanyEvents}/>
                <Route path="/createEvent" component={CreateEvents}/>

            </div>
        )
    }
}
//Export The Main Component
export default Main;