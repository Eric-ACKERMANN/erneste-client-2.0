import React from "react";
import TalentInformations from "../../components/TalentInformations/index";
import TalentInfoDisplay from "../../components/TalentInfoDisplay/index";
import TalentDescription from "../../components/TalentDescription/index";
import axios from "axios";

/* *** Page for Admin. Everything can be modified *** */

export default class TalentforAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      validated: null,
      lastUpdate: null,
      isUpdating: false
    };
  }
  /* ** INTERRUPTERS ** */

  setUpdate = () => {
    this.setState({ isUpdating: !this.state.isUpdating });
  };

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

  update = async () => {
    await axios.post(
      "https://erneste-server-improved.herokuapp.com/talent/update",
      {
        id: this.props.match.params.id,
        informations: this.state.informations,
        description: this.state.description,
        skills: this.state.skills
      },
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({ isUpdating: false });
    return;
  };

  render() {
    return (
      <div className="content">
        <div className="body-container">
          {this.state.isUpdating ? (
            <TalentInformations
              button={false}
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
          ) : (
            <TalentInfoDisplay
              setUpdate={this.setUpdate}
              informations={this.state.informations}
              lastUpdate={this.state.lastUpdate}
              isUpdating={this.state.isUpdating}
            />
          )}

          <TalentDescription
            action="update"
            isUpdating={this.state.isUpdating}
            update={this.update}
            description={this.state.description}
            skills={this.state.skills}
            setDescription={this.setDescription}
            setSkills={this.setSkills}
            deleteSkills={this.deleteSkills}
            token={this.props.token}
          />
        </div>
      </div>
    );
  }
  async componentDidMount() {
    this.props.setPageActive("admin/talent");

    const response = await axios.get(
      "https://erneste-server-improved.herokuapp.com/talent/" +
        this.props.match.params.id,
      { headers: { authorization: `Bearer ${this.props.token}` } }
    );
    this.setState({
      informations: response.data.informations,
      description: response.data.description,
      skills: response.data.skills,
      validated: response.data.validated,
      lastUpdate: response.data.lastUpdate
    });
  }
}
