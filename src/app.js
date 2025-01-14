const {MongoClient, ObjectId} = require('mongodb');
const uri = require("./atlasdb");
const client = new MongoClient(uri);
const dbname = "Tester1";
collectionn_name = "Test";
const accountsCollection = client.db(dbname).collection(collectionn_name);

const connecttodatabase= async() =>{
    try{
        await client.connect();
        
        console.log(`Connected to the ${dbname} database`);
    } catch(err){
        console.error("Failed to connect to the database", err);
    }
}
const sampleAccounts = {
    //Objectid : "6776dae846c4f1a17624fet3",
    account_holder: "Keerthan",
    account_id : "MDB8829001667",
    account_type: "checking",
    balance : 230,
    last_updated : new Date()
}
const update = { balance: 100}
const documenttoUpdate = { _id: ObjectId('6776e6e1f6cff7204a7928d4') }

const main = async () => {
    try{ await connecttodatabase();
        const result = await accountsCollection.updateOne(documenttoUpdate, update)
        result.modifiedCount === 1 ? console.log(result) : console.log("No changes made");
        
    }
    catch (err){
        console.error("Failed to create the users collection", err);
        return;
    }
}
main();