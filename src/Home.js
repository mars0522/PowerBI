import React, { Component } from "react";
import axios from "axios";
import "./Home.css";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/CardHeader";
import Toastr from "toastr";
import "toastr/build/toastr.min.css";
import { Tooltip } from "@material-ui/core";
import DescriptionIcon from "@material-ui/icons/Description";
import Popover from "@material-ui/core/Popover";
import CardActionArea from "@material-ui/core/CardActionArea";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import ReactGA from "react-ga";
import { PageView, initGA, Event } from "./GoogleAnalytics";
import AES from "./Aes";
import MenuItem from "@material-ui/core/MenuItem";
import LoaderImage from "./Images/loaderpreovp.gif";
import { Link } from "react-router-dom";

ReactGA.initialize("UA-28761981-1"); //GA Trackingak

const styles = (theme) => ({
  root: {
    maxWidth: 450,
    border: "grey solid 1px",
    boxShadow:
      "0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%), 0 1px 5px 0 rgb(0 0 0 / 20%);",
    "&:hover": {
      boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
    },
    margin: "-8px 10px 8px 10px",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    background: "#337ab7;",
  },
  name: {
    fontFamily: ['"Calibri"'].join(","),
    fontWeight: "550",
    marginBottom: "0px",
  },
  popover: {
    backgroundColor: "rgba(0,0,30,0.4)",
    spacing: "100",
  },
  paper: {},
});

function groupBy(data, key) {
  return data.reduce((acc, x) => {
    acc[x[key]] = [...(acc[x[key]] || []), x];
    return acc;
  }, {});
}
class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      reports: [],
      monthrep: [],
      empid: 0,
      AK: "",
      expanded: false,
      loading: "initial",
      anchorEl: null,
      open: false,
      freeze: 0,
      overrider: 0,
      overrider_AK:''
    };
    this.getcategory = this.getcategory.bind(this);
    this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
  }
  //open and close popup
  handlePopoverOpen(event, id, rep2, category) {
    if ((rep2 && rep2.length !== 1) || !rep2) {
      this.setState({
        expanded: this.state.expanded ? null : id,
        anchorEl: this.state.anchorEl === event.target ? null : event.target,
      });
    }
  }
  // function to get all the reports from the api
  async getcategory(empid, AK) {
    if (
      !process.env.REACT_APP_REACTENV ||
      process.env.REACT_APP_REACTENV === "development"
    ) {
      var url =
        "http://merp.intermesh.net/index.php/erpreport/report/display?empid=" +
        empid +
        "&AK=" +
        AK;
    } else {
      var url =
        "https://merp.intermesh.net/index.php/erpreport/report/display?empid=" +
        empid +
        "&AK=" +
        AK;
    }
    try {
      await fetch(url, {
        mode: "cors",
        method: "post",
      })
        .then((res) => res.json())
        .then(
          (result) => {
            if (result["status"] === 200) {
              this.setState({
                reports: result.data,
                loading: "false",
              });
            } else {
              Toastr.error(result["message"]);
              this.setState({
                loading: "false",
                freeze: 1,
              });
            }
          },
          (error) => {
            this.setState({
              loading: "false",
              freeze: 1,
            });
            // console.log(error);
            Toastr.error("There is some error while fetching the data");
            //console.log("There is some error while fetching the data");
          }
        );
    } catch (e) {
      // console.log(e);
    }
  }

  getUrlParameter = (name) => {
    let params = this.getUrlVarsBase64()["W"];
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
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    return false;
  }
  
  // api to verify token and set google anaytics paramters
  async verifyToken (empid, AK){
    if (AK.length > 0) {
      let validate = await fetch(
        "https://merp.intermesh.net/index.php/Userlisting/Employeedetails?empid=" +
          empid +
          "&AK=" +
          AK
      );
      let status = await validate.json();
      if (status.status === "200") {
        let designation = status.data.employeeDetails[0].DESIGNATIONNAME;
        let vertical = status.data.employeeDetails[0].VERTICALNAME;
        let department = status.data.employeeDetails[0].IIL_DEPT_NAME;
        let funcarea = status.data.employeeDetails[0].FUNCTIONALAREANAME;
        initGA(designation, vertical, department, funcarea, empid);
      } else {
        Toastr.error("You are not authorised to view this page");
        this.setState({
          loading: false,
          freeze: 1,
        });
        return false;
      }
    } else {
      Toastr.error("You are not authorised to view this page. AK problem");
      this.setState({
        loading: false,
        freeze: 1,
      });
      return false;
    }
  }
  async componentDidMount() {
    PageView(); // GA to track page view
  }

  async componentWillMount() {
    //console.log("Env : " + process.env.REACT_APP_REACTENV);
    this.setState({ loading: "true" }); // to show loader
    var empid;
    var AK;
    empid = this.getUrlParameter("empid");
    AK = this.getUrlParameter("AK");

    // console.log(empid);
    // console.log(AK);
    this.setState({
      empid: empid,
      AK: AK,
    });
    await this.getcategory(empid, AK);
    await this.verifyToken(empid, AK);
  }

  async getOverrider_AK(overrider) {

    let response = await fetch(`https://merp.intermesh.net/index.php/Login/loginotpgeneration?usertype=999&display=-1&empid=${overrider}`);
    let data = await response.json();
    console.log("data", data);
    return data;
     
   }
  render() {
    if (this.state.loading === "true") {
      return (
        <img
          src={LoaderImage}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          alt="Loader"
        />
      );
    }
    if (this.state.reports.length === 0 && this.state.freeze !== 1)
      return (
        <div
          style={{
            textAlign: "center",
            color: "#2e3192",
            marginTop: "16px",
            borderLeft: "6px solid red",
            borderRight: "6px solid red",
            backgroundColor: "#fdd",
          }}
        >
          <h3>
            Restriction! You don't have permission for any of the reports.
            Please take permission to access reports.
          </h3>
        </div>
      );
    const reportName = groupBy(this.state.reports, "REPORT_TYPE");
    // group json data absed on report_type

    const { classes } = this.props;
    const { anchorEl, expanded } = this.state;
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const showreport = (rep2, category) => {


      if (rep2.length > 1) {
        return (
          <div>
            <ul>
              <span>
                <h4 className="heading1">{rep2[0].REPORT_NAME}</h4>
              </span>
              { rep2[0].FK_IIL_MOD_FNS_ID !=='1243' 
                ? rep2.map((row) => {
                    return (
                      <MenuItem>
                        <form
                          action="https://weberp6.intermesh.net:444/reports/powerbi/getreport"
                          method="post"
                          onSubmit={(e) => {
                            Event(
                              "ReportClick",
                              category +
                                "_" +
                                rep2[0].REPORT_NAME +
                                "_" +
                                row.REPORT_MONTH
                            );
                          }}
                          target="_blank"
                        >
                          <button
                            type="submit"
                            name="submit"
                            value={row.REPORT_MONTH}
                            className="btn-link"
                          >
                            {row.REPORT_MONTH}
                          </button>
                          <input
                            type="hidden"
                            name="reportname"
                            value={row.REPORT_NAME}
                          />
                          <input
                            type="hidden"
                            name="workspaceid"
                            value={row.WORKSPACE_ID}
                          />
                          <input
                            type="hidden"
                            name="reportid"
                            value={row.REPORT_ID}
                          />
                          <input
                            type="hidden"
                            name="username"
                            value={row.USER_NAME}
                          />
                          <input
                            type="hidden"
                            name="AK"
                            value={this.state.AK}
                          />
                          <input
                            type="hidden"
                            name="empid"
                            value={this.state.empid}
                          />
                        </form>
                      </MenuItem>
                    );
                  })
                : rep2.map((row) => {
                  
                  console.log("Row", row);
                    const repId = row.REPORT_ID;
                    const userName = row.USER_NAME;
                  const overrider = row.OVERRIDER_TILL_EMP;
                  // console.log("Overrider", overrider);
                  let employeeid = this.empid;
                  if (overrider !== '-999') {
                    employeeid = overrider;
                  }
                  const Data = this.getOverrider_AK(overrider)  // returns promise
                  
                  console.log("AK testing,",Data.then(res=> console.log(res)))
                    const AK =
                      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMzIzMCIsImV4cCI6MTY1MTYzNjA3NSwiaWF0IjoxNjUxNTQ5Njc1LCJpc3MiOiJFTVBMT1lFRSJ9.9B_aviEm6IhtyozkkRj9nVzxBYMMFwvPuDyZF8-LMz8"
                    const url = `https://localhost:3000/?reportid=${repId}&username=${userName}&empid=${employeeid}&tableName=Structure&columnName=Employee%20ID&AK=${AK}`;
                    // console.log(url);
                    const encoded = btoa(url);
                    return (
                      <MenuItem>
                        <Link to={`/showreport?X=${encoded}`}>
                          <button
                            type="submit"
                            name="submit"
                            value={row.REPORT_MONTH}
                            className="btn-link"
                          >
                            {row.REPORT_MONTH}
                          </button>
                        </Link>
                      </MenuItem>
                    );
                  })}
            </ul>
          </div>
        );
      }
    };
    const cardheader = (rep2, repos, category) => {
      if (rep2.length > 1) {
        // for monthly reports
        return (
          <CardHeader
            avatar={
              <Avatar className={classes.avatar}>
                <DescriptionIcon />
              </Avatar>
            }
            title={
              <Tooltip title={rep2[0].REPORT_DESCRIPTION}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h3"
                  className={classes.name}
                  style={{ fontSize: "21px", textAlign: "left" }}
                >
                  {repos}
                </Typography>
              </Tooltip>
            }
            action={
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]:
                    expanded == rep2[0].REPORT_CAT_MAPPING_ID,
                })}
                onClick={(e) =>
                  this.handlePopoverOpen(
                    e,
                    rep2[0].REPORT_CAT_MAPPING_ID,
                    rep2,
                    category
                  )
                }
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            }
          />
        );
      } else {

        console.log('Testing:',rep2[0]);
        if (rep2[0].REPORT_TYPE !== "ERP") {
          // for single reports
          let params = this.getUrlVarsBase64()["W"];

          if (rep2[0].CATEGORY_NAME === "FSF(CSD/KCD)" && rep2[0].FK_IIL_MOD_FNS_ID==='1243') {
            const repId = rep2[0].REPORT_ID;
            const userName = rep2[0].USER_NAME;
            const overrider = rep2[0].OVERRIDER_TILL_EMP
            // console.log("overrider:", overrider)
            const employeeid = overrider;
            const AK =
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMzIzMCIsImV4cCI6MTY1MTYzNjA3NSwiaWF0IjoxNjUxNTQ5Njc1LCJpc3MiOiJFTVBMT1lFRSJ9.9B_aviEm6IhtyozkkRj9nVzxBYMMFwvPuDyZF8-LMz8";

            const url = `https://localhost:3000/?reportid=${repId}&username=${userName}&empid=${employeeid}&tableName=Structure&columnName=Employee%20ID&AK=${AK}`; 
            const encoded = btoa(url);

            return (
              <Link to={`/showreport?X=${encoded}`}>
                <CardHeader
                  avatar={
                    <Avatar className={classes.avatar}>
                      <DescriptionIcon />
                    </Avatar>
                  }
                  title={
                    <Tooltip title={rep2[0].REPORT_DESCRIPTION}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h3"
                        className={classes.name}
                        style={{ fontSize: "21px", textAlign: "left" }}
                      >
                        {repos}
                      </Typography>
                    </Tooltip>
                  }
                ></CardHeader>
              </Link>
            );
          }

          return (
            <form
              action="https://weberp6.intermesh.net:444/reports/powerbi/getreport"
              method="post"
              onSubmit={(e) => {
                Event(
                  "ReportClick",
                  category +
                    "_" +
                    rep2[0].REPORT_NAME +
                    "_" +
                    rep2[0].REPORT_MONTH
                );
              }}
              target="_blank"
            >
              <button type="submit" name="submit" value="" className="btn-link">
                <CardHeader
                  avatar={
                    <Avatar className={classes.avatar}>
                      <DescriptionIcon />
                    </Avatar>
                  }
                  title={
                    <Tooltip title={rep2[0].REPORT_DESCRIPTION}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h3"
                        className={classes.name}
                        style={{ fontSize: "21px", textAlign: "left" }}
                      >
                        {repos}
                      </Typography>
                    </Tooltip>
                  }
                />
              </button>
              <input
                type="hidden"
                name="reportname"
                value={rep2[0].REPORT_NAME}
              />
              <input
                type="hidden"
                name="workspaceid"
                value={rep2[0].WORKSPACE_ID}
              />
              <input type="hidden" name="reportid" value={rep2[0].REPORT_ID} />
              <input type="hidden" name="username" value={rep2[0].USER_NAME} />
              <input type="hidden" name="AK" value={this.state.AK} />
              <input type="hidden" name="empid" value={this.state.empid} />
            </form>
          );
        } else {
          //for erp reports
          var aes = AES("reportid=" + rep2[0].WORKSPACE_ID);
          var url = "https://weberp.intermesh.net" + rep2[0].REPORT_ID + aes;
          return (
            <form
              action={url}
              method="post"
              onSubmit={(e) => {
                Event("ReportClick", category + "_" + rep2[0].REPORT_NAME);
              }}
              target="_blank"
            >
              <button type="submit" name="submit" value="" className="btn-link">
                <CardHeader
                  avatar={
                    <Avatar className={classes.avatar}>
                      <DescriptionIcon />
                    </Avatar>
                  }
                  title={
                    <Tooltip title={rep2[0].REPORT_DESCRIPTION}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h3"
                        className={classes.name}
                        style={{ fontSize: "21px", textAlign: "left" }}
                      >
                        {repos}
                      </Typography>
                    </Tooltip>
                  }
                />
              </button>
            </form>
          );
        }
      }
    };

    return (
      <div className="app">
        {Object.entries(reportName).map(([name, rep1]) => {
          const reports = groupBy(rep1, "CATEGORY_NAME"); // group json data based on category
          // console.log("reports",reports);  // category wise report

          return (
            <div className="header-border mt-4">
              <span>
                <h1 className="heading">{name} Reports</h1>
              </span>

              {Object.entries(reports).map(([category, rep]) => {
                const report = groupBy(rep, "REPORT_NAME"); // group jsaon data based on report name
                // console.log("report", report); // namewise reports
                return (
                  <div className="dep">
                    <h2>
                      {" "}
                      <span className="dep-name">
                        {category === "ERP" ? "" : category}
                      </span>
                    </h2>

                    <Grid container justify="flex-start" spacing={2}>
                      {Object.entries(report).map(([repos, rep2]) => {

                        // repos -> report title
                        // rep2 -> monthwise report
                        return (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            key={rep2[0].REPORT_CAT_MAPPING_ID}
                          >
                            <Card
                              style={{ height: "100%" }}
                              className={classes.root}
                              onClick={(e) =>
                                this.handlePopoverOpen(
                                  e,
                                  rep2[0].REPORT_CAT_MAPPING_ID,
                                  rep2,
                                  category
                                )
                              }
                            >
                              <CardActionArea>
                                {cardheader(rep2, repos, category)}
                              </CardActionArea>
                            </Card>
                            <Popover
                              className={classes.popover}
                              classes={{
                                paper: classes.paper,
                              }}
                              open={expanded === rep2[0].REPORT_CAT_MAPPING_ID}
                              onClose={this.handlePopoverOpen}
                              anchorEl={anchorEl}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                              }}
                            >
                              {showreport(rep2, category)}
                            </Popover>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Home);
