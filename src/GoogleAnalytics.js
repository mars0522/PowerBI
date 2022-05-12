import ReactGA from "react-ga";

let designation = "";
let vertical = "";
let department = "";
let funcarea = "";
let employeeid = "";


export const PageView = () => {
    ReactGA.pageview("React/PowerBI");
}

export const initGA = (Designation,Vertical,Department,Funcarea,EmployeeId) => {
    designation = Designation
    vertical = Vertical
    department = Department
    funcarea = Funcarea
    employeeid =EmployeeId
};

export const Event = (event,name, value=1) => {
    let category = vertical + '_' + department + '_' + funcarea + '_' + designation;
    ReactGA.set({ dimension1: employeeid });//Employee
    ReactGA.set({ dimension2: vertical });//Vertical
    ReactGA.set({ dimension3: department });//Department
    ReactGA.set({ dimension4: funcarea });//FunctionalArea
    ReactGA.set({ dimension5: designation });//Designation
    ReactGA.event({
        category: category,
        action: 'PowerBI_Click',
        label: 'PowerBi_'+name,
        value: value
    });
};