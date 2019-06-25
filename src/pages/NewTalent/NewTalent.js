import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import TalentDescription from "../../components/TalentDescription";
import TalentInformations from "../../components/TalentInformations";

import "./NewTalent.css";

/* Page to create a talent */

export default class NewTalent extends React.Component {
  state = {
    informations: {
      photo: null,
      firstName: "",
      lastName: "",
      linkedIn: "",
      email: "",
      phoneNumber: "",
      salary: "",
      actualCompany: "",
      wantedSector: [],
      wantedSize: "",
      actualTitle: "",
      wantedTitle: [],
      status: ""
    },
    description: {
      idealCompany: "",
      idealRole: "",
      workingEnvironment: "",
      development: ""
    },
    skills: null,
    redirect: false,
    lastUpdate: null,
    error: {
      firstName: false,
      lastName: false,
      email: false
    }
  };

  /* ** INTERRUPTERS ** */

  setInformations = e => {
    const key = e.target.id;
    const informations = this.state.informations;
    informations[key] = e.target.value;
    this.setState({ informations });
  };

  setPhoto = photo => {
    const informations = this.state.informations;
    informations.photo = photo;
    this.setState({ informations });
  };

  setTitle = title => {
    const informations = this.state.informations;
    informations.title = title;
    this.setState({ informations });
  };

  deleteTitle = i => {
    const informations = this.state.informations;
    informations.wantedTitle.splice(i, 1);
    this.setState({ informations });
  };

  setSize = wantedSize => {
    const informations = this.state.informations;
    informations.wantedSize = wantedSize;
    this.setState({ informations });
  };

  setStatus = status => {
    const informations = this.state.informations;
    informations.status = status;
    this.setState({ informations });
  };

  setSector = sector => {
    const informations = this.state.informations;
    informations.sector = sector;
    this.setState({ informations });
  };

  deleteSector = i => {
    const informations = this.state.informations;
    informations.wantedSector.splice(i, 1);
    this.setState({ informations });
  };

  setDescription = e => {
    const key = e.target.id;
    const description = this.state.description;
    description[key] = e.target.value;
    this.setState({ description });
  };

  setSkills = skills => {
    this.setState({ skills });
  };

  deleteSkills = i => {
    const skills = this.state.skills;
    skills.splice(i, 1);
    this.setState({ skills });
  };

  validateString = str => {
    if (!str || str.match(/^ *$/) !== null) {
      return false;
    }
    return true;
  };

  validateEmail = email => {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  post = async () => {
    let error = this.state.error;
    if (this.validateString(this.state.informations.firstName) === false) {
      error.firstName = true;
    } else {
      error.firstName = false;
    }

    if (this.validateString(this.state.informations.lastName) === false) {
      error.lastName = true;
    } else {
      error.lastName = false;
    }

    if (this.validateEmail(this.state.informations.email) === false) {
      error.email = true;
    } else {
      error.email = false;
    }

    if (
      error.firstName === true ||
      error.lastName === true ||
      error.email === true
    ) {
      this.setState({ error });
      return;
    } else {
      this.setState({ error });
      await axios.post(
        "https://erneste-server-improved.herokuapp.com/talent/create",
        {
          informations: this.state.informations,
          description: this.state.description,
          skills: this.state.skills
        },
        { headers: { authorization: `Bearer ${this.props.token}` } }
      );
      this.setState({ redirect: true });
      return;
    }
  };

  render() {
    /* Permission test */
    if (this.props.permission !== "Admin") {
      return <Redirect to={"/"} />;
    }
    return (
      <div>
        <div className="content">
          {this.state.redirect && <Redirect to="/admin/talent-list" />}
          <div className="body-container">
            <TalentInformations
              button={false}
              error={this.state.error}
              lastUpdate={this.state.lastUpdate}
              informations={this.state.informations}
              setInformations={this.setInformations}
              setPhoto={this.setPhoto}
              setTitle={this.setTitle}
              deleteTitle={this.deleteTitle}
              setSize={this.setSize}
              setStatus={this.setStatus}
              setSector={this.setSector}
              deleteSector={this.deleteSector}
              token={this.props.token}
            />

            <TalentDescription
              isUpdating={true}
              post={this.post}
              description={this.state.description}
              skills={this.state.skills}
              setDescription={this.setDescription}
              setSkills={this.setSkills}
              deleteSkills={this.deleteSkills}
              token={this.props.token}
            />
          </div>
        </div>
      </div>
    );
  }

  async componentDidMount() {
    this.props.setPageActive("admin/talent");
    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/sector/",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    console.log("response", response.data);
    const response2 = await axios.get(
      "https://erneste-server-improved.herokuapp.com/title",
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    console.log("response2", response2.data);
    this.setState({
      arrayOfSectors: response.data,
      arrayOfTitles: response2.data,
      loadingTitle: false,
      loadingSector: false
    });
  }
}
