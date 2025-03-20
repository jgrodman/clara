import Airtable from 'airtable';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const baseId = 'appMnJElGa31162oW'

const userRequestField = 'User Request'
// limited docs with the js library, so creating the table directly via axios
export async function createTable() {
    const headers = {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
    }
    const tableName = `conversation-${uuidv4()}`
    await axios.post(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, JSON.stringify({
        description: 'Conversation transcript',
        fields: [
            {
                "name": userRequestField,
                "type": "multilineText"
            }
        ],
        name: tableName
    }), { headers });
    return tableName
}

export async function insertData(tableName: string, data: string) {
    const table = airtable.base(baseId).table(tableName);
    await table.create({
        [userRequestField]: data
    });
}
