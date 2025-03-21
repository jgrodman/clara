import Airtable from 'airtable';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const baseId = 'appMnJElGa31162oW'

export const userRequestField = 'User Request'
export const nameField = 'Name'
export const phoneNumberField = 'Phone Number'

// limited docs with the js library, so creating the table directly via axios
export async function createTable() {
    const headers = {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
    }
    const tableName = `conversation-${uuidv4()}`
    const res = await axios.post(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, JSON.stringify({
        description: 'Conversation transcript',
        fields: [
            {
                "name": userRequestField,
                "type": "multilineText"
            },
            {
                "name": nameField,
                "type": "singleLineText"
            },
            {
                "name": phoneNumberField,
                "type": "singleLineText"
            }
        ],
        name: tableName
    }), { headers });
    return { tableName, tableId: res.data.id }
}

export async function insertData(args: { tableName: string, fields: { [fieldName: string]: string } }) {
    const { tableName, fields } = args

    const table = airtable.base(baseId).table(tableName);
    await table.create(fields);
}
