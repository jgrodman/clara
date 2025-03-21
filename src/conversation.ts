import { Request, Response, text } from 'express';
import { textToSpeech } from './textToSpeech';
import fs from 'fs';
import path from 'path';
import { speechToText } from './speechToText';
import { createTable, insertData, userRequestField, nameField, phoneNumberField } from './airtable';

// type State = 'initial' | 'getContact' | 'request' | 'conclude'
// const state: State = 'initial'

const audioDir = path.join(process.cwd(), 'artifacts/audio-input');
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

export const startConversation = async (req: Request, res: Response) => {
    res.send("Initiating conversation")
    let tableName = ""
    try {
        const { tableName, tableId } = await createTable()
        await initial()
        await getContact()
        let hasMoreRequests = true;
        while (hasMoreRequests) {
            hasMoreRequests = await handleRequest();
        }
        await textToSpeech("Thank you for your request. Have a great day!")
        console.log(`Share link: https://airtable.com/appMnJElGa31162oW/shrV7EDE6qrAqgelD/${tableId}`)
    } catch (error) {
        console.error(error)
    }








    async function initial() {
        await textToSpeech("Hello, I am hal. Please state your request");
        const text = await speechToText();
        await insertData({ tableName, fields: { [userRequestField]: text } })
    }

    async function getContact() {
        let confirm = false
        let name = ""
        let phoneNumber = ""
        while (!confirm) {
            await textToSpeech("Please state your name");
            name = await speechToText();
            await textToSpeech("Please state your phone number")
            phoneNumber = await speechToText()
            await textToSpeech("Your name is " + name + " and your phone number is " + phoneNumber + ". Is this correct? Please confirm by saying yes")
            const confirmText = await speechToText()
            if (confirmText.toLowerCase() === "yes") {
                confirm = true
            }
        }
        await insertData({ tableName, fields: { [nameField]: name, [phoneNumberField]: phoneNumber } })
        await textToSpeech("Your contact information has been saved")
    }

    async function handleRequest() {
        await textToSpeech("Please state your request")
        const text = await speechToText()
        await insertData({ tableName, fields: { [userRequestField]: text } })
        await textToSpeech("Do you have any other requests? Say yes if you do, or no if you don't")
        const confirmText = await speechToText()
        if (confirmText.toLowerCase() === "yes") {
            return true
        }
        return false
    }
};
