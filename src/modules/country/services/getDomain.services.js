const mongoose = require("mongoose"); // Import mongoose if not imported previously
const Model = require("../domain.model");

const getDomain = async (user) => {
    try {
        const filterQuery = {active:true}

        if (user.role != "superAdmin") {
            const domainArray = ["TW"]
            for (let i = 0; i < user?.domain.length; i++) {
                if (!domainArray.includes(user.domain[i].split("/")[1])) {
                    domainArray.push(user.domain[i].split("/")[1])
                }
                domainArray.push(user.domain[i].split("/")[2])
            }    
            if (domainArray.length) {
                filterQuery.label = { $in: domainArray };
            }
        }

        const response = await Model.find(filterQuery)
        return response
    } catch (error) {
        console.error("Error in getDomain:", error);
        return null; // You might want to consider throwing the error here instead
    }
};

module.exports = getDomain;
