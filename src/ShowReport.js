import React, { Component } from "react";

import axios from "axios";
import { models } from "powerbi-client";
import Toastr from "toastr";

import { Report } from "powerbi-report-component";
import "toastr/build/toastr.min.css";

class ShowReport extends React.Component {
  constructor(props) {
    super(props);
    this.report = null; // to store the loaded report's object to perform operations like print, full screen etc..
  }
  state = {
    datasetId: "",
    embedUrl: "",
    authenticationToken: "",
    authorizationToken: "",
    tableName: "",
    columnName: "",
    reportId: "",
    workspaceId: "",
    userName: "",
    freeze: 1,
    employeeid: "",
    AK: "",
    subordinates: [],
    stopRendering: 0,
  };

  getUrlParameter = (name) => {
    let params = this.getUrlVarsBase64()["X"];
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    let results = regex.exec(atob(params));
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  getUrlVarsBase64() {
    var vars = {};
    var parts = window.location.href.replace(
      /[?&]+([^=&]+)=([^&]*)/gi,
      function (m, key, value) {
        vars[key] = value;
      }
    );
    return vars;
  }
  getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }

  getAuthenticationToken = (username) => {
    if (
      !process.env.REACT_APP_REACTENV ||
      process.env.REACT_APP_REACTENV === "development"
    ) {
      let formData = new FormData();
      formData.append("username", username);

      const data = axios({
        method: "post",
        url: "http://localhost:80/trustseal/web/index.php/reports/powerbi/get-authentication-token",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      });

      return data;
    } else {
      let formData = new FormData();
      formData.append("username", username);

      const data = axios({
        method: "post",
        url: "https://weberp6.intermesh.net/reports/powerbi/get-authentication-token",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      });

      return data;
    }
  };
  getSubordinates = () => {
    const empid = this.state.employeeid;

    const AK = this.state.AK;

    console.log("In getSubordinate :");
    console.log("empid: ", empid);
    console.log("AK: ", AK);

    const data = axios({
      method: "get",
      url: `https://merp.intermesh.net/index.php/Userlisting/Employeedetails?empid=${empid}&AK=${AK}`, // Lower Trail
    });
    data.then(res => console.log("In the getSubordinates function :", res.data))
    return data;
  };
  getAuthorizationToken = async () => {
    const reqBody = {
      datasets: [{ id: this.state.datasetId }],
      reports: [{ id: this.state.reportId }],
    };

    const headers = {
      "Content-type": "application/json",
      Authorization: `Bearer ${this.state.authenticationToken}`,
    };
    //console.log(this.state.authenticationToken, reqBody, headers);
    return axios.post(
      "https://api.powerbi.com/v1.0/myorg/GenerateToken",
      reqBody,
      { headers: headers }
    );
  };

  getEmbedUrl = () => {
    const reportId = this.state.reportId;
    const headers = {
      "Content-type": "application/json",
      Authorization: `Bearer ${this.state.authenticationToken}`,
    };
    return axios.get(`https://api.powerbi.com/v1.0/myorg/reports/${reportId}`, {
      headers: headers,
    });
  };

  handleDataSelected = (data) => {
    // will be called when some chart or data element in your report clicked
  };

  handleReportLoad = async (report) => {
    // will be called when report loads:
    // - scripts and data received from server, visuals are rendered on the browser
    // - flickering Power BI logo stops appearing but report is not fully ready to be consumed

    var numberArray = [];
    let stringArray = this.state.subordinates;


    for (var i = 0; i < stringArray.length; i++)
      numberArray.push(parseInt(stringArray[i]));
    
    console.log("Underlisting :", numberArray.length);
    const filter1 = {
      $schema: "http://powerbi.com/product/schema#basic",
      target: {
        table: this.state.tableName,
        column: this.state.columnName,
      },
      operator: "in",
      values: numberArray,
      filterType: models.FilterType.BasicFilter,
      requireSingleSelection: true,
    };
    report.setFilters([filter1]).catch(function (errors) {
      // console.log(errors);
    });

    this.report = report; // get the report object from callback and store it.(optional)
  };



  setFullscreen = () => {
    if (this.report) this.report.fullscreen();
  };

  handleReportRender = (report) => {
    // will be called when report renders:
    // - visuals finish rendering
    // - report is fully visible and ready for consumption

    this.report = report; // get the report object from callback and store it.(optional)
  };

  handlePageChange = (data) => {
    // will be called when pages in your report changes
  };

  handleTileClicked = async (data) => {
    // console.log("Data from tile", data);
  };

  componentWillUnmount() {
    
    this.setState({ freeze: 1 });
  }
  async componentDidMount() {
    // all async requests here for POC , after this will be shifted to Services folder.

    const employeeid = this.getUrlParameter("empid");
    const reportId = this.getUrlParameter("reportid");
    const userName = this.getUrlParameter("username");
    const tableName = this.getUrlParameter("tableName");
    const columnName = this.getUrlParameter("columnName");
    // const AK = this.getUrlParameter("AK");
    // console.log(AK);
    let AK;
    let response = await axios.get(`https://merp.intermesh.net/index.php/Login/loginotpgeneration?usertype=999&display=-1&empid=${employeeid}`);
    AK = response.data.t;

    console.log("ComponentDidMount in  Showreprot component")
    console.log("EmployeeId: ", employeeid);
    console.log("ReportId: ", reportId);

    this.setState({
      employeeid,
      reportId,
      userName,
      tableName,
      columnName,
      AK,
    });
    try {

      console.log("Try in showreport component chala")
      const { data: authenticationToken } = await this.getAuthenticationToken(
        userName
      );
      this.setState({ authenticationToken });
      const { data: apiResponse1 } = await this.getEmbedUrl();
      const { embedUrl, datasetId } = apiResponse1;
      // console.log("Api Response in showreport component is: ", apiResponse1);
      this.setState({ embedUrl, datasetId });
      const { data: apiResponse } = await this.getAuthorizationToken();
      const { token: authorizationToken } = apiResponse;
      console.log("api response :", apiResponse);
      this.setState({ authorizationToken });
      const { data: data1 } = await this.getSubordinates();
      console.log("data: ", data1);

      const { data: data } = data1;

      const lowerTrail = [];
      const dt = [...data.employeeLowerTrail];
      dt.forEach((ele) => {
        lowerTrail.push(ele.EMPLOYEEID);
      });
      // console.log(dt);
      this.setState({ subordinates: lowerTrail });

      this.setState({ freeze: 0 });
    } catch (err) {

      console.log(err);
      console.log("Catch in showreport component chala")
      if (err.response.status >= 400 && err.response.status < 500) {
        Toastr.error("Invalid URL parameters...");
      } else {
        Toastr.error("Sorry for the inconvenience...");
      }

      // console.log(err.response);

      return;
    }
  }
  render() {
    if (this.state.freeze == 1) {
      return (
        <img
          src={
            "https://erp-reports.intermesh.net/PowerBI/static/media/loaderpreovp.17269b86.gif"
          }
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          alt="Loading...."
        />
      );
    } else {
      const reportStyle = {
        // style object for report component
        width: "100%",
        height: window.screen.height * 0.8,
      };

      const extraSettings = {
        filterPaneEnabled: false, //true
        navContentPaneEnabled: true, //true
        hideErrors: false,
        // Use this *only* when you want to override error experience i.e, use onError
        // ... more custom settings
      };

      return (
        <React.Fragment>
          <Report
            tokenType="Embed" // "Aad"
            accessToken={this.state.authorizationToken} // accessToken goes here
            embedUrl={this.state.embedUrl} // embedUrl goes here
            embedId={this.state.reportId} // report or dashboard Id goes here
            // pageName="" // set as current page of the report
            reportMode="View" // open report in a particular mode View/Edit/Create
            datasetId={this.state.datasetId} // required for reportMode = "Create" and optional for dynamic databinding in `report` on `View` mode
            // groupId={groupId} // optional. Used when reportMode = "Create" and to chose the target workspace when the dataset is shared.
            extraSettings={extraSettings}
            //permissions="All" // View, For "Edit" mode permissions should be "All"
            style={reportStyle}
            onLoad={this.handleReportLoad}
            onRender={this.handleReportRender} // not allowed in "Create" mode
            onSelectData={this.handleDataSelected}
            onPageChange={this.handlePageChange}
            onTileClicked={this.handleTileClicked}
            onSave={this.handleReportSave} // works for "Edit" and "Create"
            onButtonClicked={(data) => {
              if (data.type === "Bookmark") {
                this.handleReportLoad(this.report);
              }
            }}
          ></Report>
        </React.Fragment>
      );
    }
  }
}

export default ShowReport;
