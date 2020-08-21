const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

roleQuestions();

// Questions
async function roleQuestions() {
 try{
    var employeeArr = [];

    console.log("Please build your team.");

    var role = { role: "" };
    while(role.role !== "I don't want to add anymore team members."){
        //Role question
        role = await inquirer.prompt({
            type: "list",
            name: "role",
            message: "Which type of team member would you like to add?",
            choices: [
                "Manager",
                "Engineer",
                "Intern",
                "I don't want to add anymore team members."
            ]
        });

        if (role.role == "I don't want to add anymore team members."){
            break;
        }
        
        //Employee questions
        const employee = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the " + role.role + "'s name?",
            validate: stringValidator
        },
        {
            type: "input",
            name: "id",
            message: "What is the " + role.role + "'s ID?",
            validate: numberValidator
        },
        {
            type: "input",
            name: "email",
            message: "What is the " + role.role + "'s email?",
            validate: emailValidator
        }
    ]);

    switch (role.role) {
        case "Manager":
            const manager = await inquirer.prompt({
            //Manager-only
            type: "input",
            name: "officeNumber",
            message: "What is the manager's office number?",
            validate: numberValidator
            });

        var managerObj = new Manager(employee.name, employee.id, employee.email, manager.officeNumber);

        employeeArr.push(managerObj);

        break;

        case "Engineer":
            const engineer = await inquirer.prompt({
            //Engineer-only
            type: "input",
            name: "github",
            message: "What is the engineer's GitHub username?",
            validate: stringValidator
            });

        var engineerObj = new Engineer(employee.name, employee.id, employee.email, engineer.github);

        employeeArr.push(engineerObj);

        break;

        case "Intern":
            const intern = await inquirer.prompt({
            //Intern-only
            type: "input",
            name: "school",
            message: "What is the intern's school?",
            validate: stringValidator
        });

        var internObj = new Intern(employee.name, employee.id, employee.email, intern.school);

        employeeArr.push(internObj);

        break;
    
        default:
            break;
    }

}

fs.exists(OUTPUT_DIR, (exists) => {
    if(exists === false){
        fs.mkdir(OUTPUT_DIR, {recursive: true}, (err) => {
            if(err) throw err;
        
            fs.writeFile(outputPath, render(employeeArr), function(err){
                if (err) {
                    return console.log(err);
                }
            console.log("Success!");
            });
        });
    }
    else {       
        fs.writeFile(outputPath, render(employeeArr), function(err){
            if (err) {
                return console.log(err);
            }
            console.log("Success!");
        });
    }
});

} catch (err) {
    console.log(err);
  }
}

//Input validators
function stringValidator(stringInput){
    if(/^\W+$/.test(stringInput) || !isNaN(stringInput)){
        return "Your input must be a string.";
    }
    else{
        return true;
    }
}

function numberValidator(numberInput){
    if(isNaN(numberInput) == true){
        return "Your input must be a number.";
    }
    else{
        return true;
    }
}

function emailValidator(emailInput){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailInput)){
        return true;
    }
    else{
        return "You have entered an invalid email address!";
    }
}
