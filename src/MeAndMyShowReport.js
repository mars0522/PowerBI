import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { Link } from "react-router-dom";
import ReactGA from "react-ga";
import { PageView, initGA, Event } from "./GoogleAnalytics";
const MeAndMyShowReport = ({ rep2, category,pass_empid, pass_AK }) => {
    // rep2 is an array of monthly reports
    // console.log("Showreport: ", rep2);
    if (rep2.length > 1) {
      return (
        <div>
          <ul>
            <span>
              <h4 className="heading1">{rep2[0].REPORT_NAME}</h4>
            </span>

            {rep2[0].FK_IIL_MOD_FNS_ID !== "1243" &&
            rep2[0].FK_IIL_MOD_FNS_ID !== "1194" &&
            rep2[0].FK_IIL_MOD_FNS_ID !== "1193" &&
            rep2[0].FK_IIL_MOD_FNS_ID !== "1195" &&
            rep2[0].FK_IIL_MOD_FNS_ID !== "1242" &&
            rep2[0].FK_IIL_MOD_FNS_ID !== "1247"
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
                          value={pass_AK}
                        />
                        <input
                          type="hidden"
                          name="empid"
                          value={pass_empid}
                        />
                      </form>
                    </MenuItem>
                  );
                })
              : rep2.map((row) => {
                  console.log("Row:", row);
                  const repId = row.REPORT_ID;
                  const userName = row.USER_NAME;
                let overrider = pass_empid;
                let AK = pass_AK;
                  // let AK = this.state.AK;
                  // let flag = 0

                  if (
                    row.OVERRIDER_TILL_EMP !== "-999" &&
                    row.OVERRIDER_TILL_EMP !== "0" &&
                    row.OVERRIDER_TILL_EMP !== undefined
                  ) {
                    overrider = row.OVERRIDER_TILL_EMP;
                  }

                  
                  let url = `https://weberp6.intermesh.net:444/reports/powerbi/getreport?reportid=${repId}&username=${userName}&empid=${overrider}&tableName=Structure&columnName=Employee%20ID&AK=${AK}`;
                  let encoded = btoa(url);
                  
                  return (
                    <MenuItem>
                      <Link to={`/showreport?X=${encoded}`} target="_blank">
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
  
export default MeAndMyShowReport;