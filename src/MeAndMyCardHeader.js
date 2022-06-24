import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import DescriptionIcon from "@material-ui/icons/Description";
import { Tooltip } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";
import ReactGA from "react-ga";
import { PageView, initGA, Event } from "./GoogleAnalytics";
import AES from "./Aes";
const MeAndMyCardHeader = ({ rep2, repos, category, classes, expanded,params,handlePopoverOpen, p_empid, p_AK}) => {

  if (rep2.length > 1) {
    // for monthly reports
    console.log(
      "for monthly reports section in running in cardhearder function"
    );

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
              [classes.expandOpen]: expanded === rep2[0].REPORT_CAT_MAPPING_ID,
            })}
            onClick={(e) =>
              handlePopoverOpen(
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
    if (rep2[0].REPORT_TYPE !== "ERP") {
      // for single reports
      console.log("For single report is running in the cardheader else part");
      

      if (
        rep2[0].FK_IIL_MOD_FNS_ID === "1243" ||
        rep2[0].FK_IIL_MOD_FNS_ID === "1194" ||
        rep2[0].FK_IIL_MOD_FNS_ID === "1193" ||
        rep2[0].FK_IIL_MOD_FNS_ID === "1195" ||
        rep2[0].FK_IIL_MOD_FNS_ID === "1242" ||
        rep2[0].FK_IIL_MOD_FNS_ID === "1247"
      ) {
        console.log("rep: ", rep2);
        const repId = rep2[0].REPORT_ID;
        const userName = rep2[0].USER_NAME;
        let overrider = p_empid;
        let AK = p_AK;
        
        if (
          rep2[0].OVERRIDER_TILL_EMP !== "-999" &&
          rep2[0].OVERRIDER_TILL_EMP !== "0" &&
          rep2[0].OVERRIDER_TILL_EMP !== undefined
        ) {
          overrider = rep2[0].OVERRIDER_TILL_EMP;
        }

        let url = `https://weberp6.intermesh.net:444/reports/powerbi/getreport?reportid=${repId}&username=${userName}&empid=${overrider}&tableName=Structure&columnName=Employee%20ID&AK=${AK}`;
        let encoded = btoa(url);

        return (
          <Link to={`/showreport?X=${encoded}`} >
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
              category + "_" + rep2[0].REPORT_NAME + "_" + rep2[0].REPORT_MONTH
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
          <input type="hidden" name="reportname" value={rep2[0].REPORT_NAME} />
          <input
            type="hidden"
            name="workspaceid"
            value={rep2[0].WORKSPACE_ID}
          />
          <input type="hidden" name="reportid" value={rep2[0].REPORT_ID} />
          <input type="hidden" name="username" value={rep2[0].USER_NAME} />
          <input type="hidden" name="AK" value={p_AK} />
          <input type="hidden" name="empid" value={p_empid} />
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

export default MeAndMyCardHeader;
