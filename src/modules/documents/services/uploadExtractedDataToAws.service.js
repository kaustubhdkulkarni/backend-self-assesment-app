const { uploadMetaJson } = require("../../../utils/fileUpload");
const DocModel = require('../documents.model');

async function uploadExtractedDataToAws() {

    // let doc = await DocModel.findOne({}).sort({_id: -1})
    // let jsonObj = JSON.stringify(doc.extractedData)
    
    // let url = await  (doc._id.toString(), jsonObj)
    // console.log("url", url);


    try {
        const cursor = DocModel.find({seqId: {$gte: 5000}}).cursor();
        let num = 1
        for (let document = await cursor.next(); document != null; document = await cursor.next()) {
            const documentId = document._id.toString();
            const extractedData = JSON.stringify(document.extractedData)
            
            try {
                let url = await uploadMetaJson(documentId, extractedData);
                console.log(num, document.seqId, ">>", url);
                num++
            } catch (error) {
                console.error("Doc upload fail", document.documentNo, document._id.toString());
            }
        }
        
        
        console.log("All documents processed and uploaded to S3");
    } catch (error) {
        console.error("Error processing documents:", error);

    }
}

module.exports = uploadExtractedDataToAws