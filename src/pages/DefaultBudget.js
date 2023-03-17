import React, { useEffect, useState } from "react";
import { Button, Container, Stack } from "react-bootstrap";
import BudgetTitle from "../components/BudgetTitle";
import CategoryCard from "../components/CategoryCard";
import BB_Nav from "../components/Navbar";
import { SignInURL } from "../components/Vars";
import { CreateBudgetURL } from "../components/Vars";
import { EditBudgetURL } from "../components/Vars";

// try api call to get budgets (or check if stored token exists/is valid), if get budgets works, get categories for default budget and display them to the screen
// if get budgets doesn't work, redirect to cognito sign in page. 

function DefaultBudget() {
    const loginURL = SignInURL
    const [defaultBudget, setDefaultBudget] = useState(null)
    const CreateBudgetPage = CreateBudgetURL
    const EditBudgetLink = EditBudgetURL

    window.localStorage.setItem('DefaultBudget', null);
    window.localStorage.setItem('EMAIL', null);

    // window.localStorage.setItem("BB_USER_TOKEN", "")

    function getDefaultBudget(Token) {
                // make API Call
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${Token}`);
                // myHeaders.append("Access-Control-Allow-Origin", '*')
        
                var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow',
                mode: 'cors'
                };
        
                fetch("https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/budgets", requestOptions)
                .then(response => response.json())
                .then(result => {
                    // console.log("Get Budgets res: ", result)
                    const expired = '{"message":"The incoming token has expired"}'
                    const Unauthorized = '{"message":"Unauthorized"}'
                    if (JSON.stringify(result) === expired || JSON.stringify(result) === Unauthorized) {
                        // console.log("redirect to sign-in")
                        window.location.replace(loginURL);
                        setDefaultBudget(message => {
                            return JSON.stringify(result)
                        })
                    }
                    else if (JSON.stringify(result) === '{"Budgets":[]}') {
                        
                        // console.log("User has no budgets", result)
                        // console.log("redirect to Create Budget page")
                        window.location.replace(CreateBudgetPage);
                        setDefaultBudget(message => {
                            return JSON.stringify(result)
                        })
                    }
                    else {
                        // console.log("Budgets: ", result);
                        // get default budget ID
                        var DefaultBudgetID = null;
                        var DBudget = null;
                        result.Budgets.forEach(Budget => {
                            if (Budget.IsDefault === true ) {
                                DefaultBudgetID = Budget.BudgetID;
                                DBudget = Budget
                            }
                        });
                        // setDefaultBudget(MyBudget => {
                        //     return DBudget
                        // });
                        
                        // ------------------
                        // get categories
                        // ------------------
                        // make API Call
                        // console.log(DefaultBudgetID)
                        var myHeaders = new Headers();
                        myHeaders.append("Authorization", `Bearer ${Token}`);
                        myHeaders.append("BudgetID", `${DefaultBudgetID}`)
                        // myHeaders.append("Access-Control-Allow-Origin", '*')
        
                        var requestOptions = {
                        method: 'GET',
                        headers: myHeaders,
                        redirect: 'follow',
                        mode: 'cors'
                        };
        
                        fetch(`https://82u01p1v58.execute-api.us-east-1.amazonaws.com/Prod/categories?BudgetID=${DefaultBudgetID}`, requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            // console.log(result)
                            if (result === '{"message":"The incoming token has expired"}' || result === '{"message":"Unauthorized"}') {
                                // console.log("redirect to sign-in")
                                window.location.replace(loginURL);
                                setDefaultBudget(message => {
                                    return JSON.stringify(result)
                                })
                            }
                            else if (JSON.stringify(result) === '{}') {
                                // console.log("Default Budget has no categories", JSON.stringify(result))
                                setDefaultBudget(MyBudget => {
                                    return JSON.stringify({...DBudget, ...result})
                                })

                            }
                            else {
                                // console.log("here's your categories!", result)
                                // add categories to state {...MyBudget, ...result}
                                setDefaultBudget(MyBudget => {
                                    return JSON.stringify({...DBudget, ...result})
                                })
                            }
        
                        })
                        .catch(error => console.log('error', error));
        
                        
                    }
        
                })
                .catch(error => console.log('error', error));
    }
        
    // Get token from URL if exists
    var currentURL = window.location;
    var token = currentURL.hash;
    var accessToken = new URLSearchParams(token).get('access_token');
    // console.log(accessToken);
    // window.localStorage.setItem('BB_USER_TOKEN', accessToken);    
    // if no token in URL
    if (accessToken === null) {
        // console.log('Token Not in url')
        // get stored token
        var accessToken = window.localStorage.getItem('BB_USER_TOKEN')
        // console.log('stored Token:', accessToken)
        
        getDefaultBudget(accessToken)
    }
    // if there is a token in the url
    else {
        // console.log('Token in URL')
        window.localStorage.setItem('BB_USER_TOKEN', accessToken);
        getDefaultBudget(accessToken)

    }
    
    

    function renderbudget(BudgetResponse) {
        if (BudgetResponse === null) {
            return "Loading..."
        }
        else if (defaultBudget === '{"Categories":{}}') {
            console.log("Empty Budget: ", defaultBudget)
            // window.location.replace(CreateBudgetPage);
        }
        else {
            // console.log(BudgetResponse)
            var Budget = JSON.parse(defaultBudget)
            window.localStorage.setItem('DefaultBudget', defaultBudget);
            Budget.Categories.sort((a, b) => {
                return Number(a.CategoryPositionID) - Number(b.CategoryPositionID)
            });
            return(
                <Container>
                        {/* <p>{BudgetResponse}</p> */}
                        <Stack>
                            <BudgetTitle name={Budget.BudgetName} amount={Number(Budget.BudgetAmountUsed)} max={Number(Budget.BudgetAmountTotal)}/>
                        </Stack>
                        <hr style={{color: 'black', width: '100%', border: '1px solid black'}} />
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                            gap: "1rem",
                            alignItems: "flex-start"
                        }}>
                            {Budget.Categories.map((Category, index) => {
                                // console.log(Category)
                                return(
                                    <CategoryCard key={index} index={index} setDefaultBudget={setDefaultBudget} cat={Category} categoryid={Category.CategoryID} budget={Budget} name={Category.CategoryName} amount={Number(Category.CategoryAmountUsed)} max={Number(Category.CategoryAmountTotal)}/>
                                )
                            })}
                        </div>
                        <Stack>
                            <Container className="mt-3">
                                <Button variant="secondary" href={EditBudgetLink}>Edit Budget</Button>
                            </Container>
                            
                        </Stack>
                </Container>

            )
        }
    }

    return(
        <Container>
            <Container>
                <BB_Nav/>
            </Container>
            {renderbudget(defaultBudget)}
            <hr style={{
                    color: 'black'
                }} />
        </Container>
    )
}

export default DefaultBudget;